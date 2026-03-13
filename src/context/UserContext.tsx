import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface UserContextType {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  currentQs: number;
  setCurrentQs: (qs: number | ((prev: number) => number)) => void;
  pointsEarned: number;
  setPointsEarned: (points: number | ((prev: number) => number)) => void;
  dailyPoints: number;
  setDailyPoints: (points: number | ((prev: number) => number)) => void;
  streak: number;
  setStreak: (streak: number) => void;
  userRank: number;
  user: { uid: string; email: string; name: string; role: string } | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveActivity: (questionsSolved: number, accuracy: number, timeSpent: number, points: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 500;
  });

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);
  const [currentQs, setCurrentQs] = useState(120);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userRank, setUserRank] = useState(58);
  const [user, setUser] = useState<{ uid: string; email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        await getDoc(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Student',
              rank: 1000,
              points: 0,
              streak: 0,
              role: 'user'
            };
            try {
              await setDoc(userDocRef, newUser);
              // Also create public profile
              await setDoc(doc(db, 'users_public', firebaseUser.uid), {
                uid: firebaseUser.uid,
                name: newUser.name,
                points: newUser.points,
                rank: newUser.rank
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, `users/${firebaseUser.uid}`);
            }
          }
          
          // Listen to user document changes
          const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUser({
                uid: data.uid,
                email: data.email,
                name: data.name,
                role: data.role
              });
              setPointsEarned(data.points || 0);
              setStreak(data.streak || 0);
              setUserRank(data.rank || 1000);
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          });
          
          // Fetch today's activity
          const today = new Date();
          const dateStr = today.toISOString().split('T')[0];
          const activityRef = doc(db, `users/${firebaseUser.uid}/activity`, dateStr);
          const unsubActivity = onSnapshot(activityRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setCurrentQs(data.questionsSolved || 0);
              setDailyPoints(data.pointsEarned || 0);
            } else {
              setCurrentQs(0);
              setDailyPoints(0);
            }
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}/activity/${dateStr}`);
          });
          
          setLoading(false);
          return () => {
            unsubDoc();
            unsubActivity();
          };
        } catch (error) {
          console.error("Error fetching user data", error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const saveActivity = async (questionsSolved: number, accuracy: number, timeSpent: number, points: number) => {
    if (!user) return;
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    try {
      const activityRef = doc(db, `users/${user.uid}/activity`, dateStr);
      const activityDoc = await getDoc(activityRef);
      
      if (activityDoc.exists()) {
        const data = activityDoc.data();
        await setDoc(activityRef, {
          userId: user.uid,
          date: dateStr,
          questionsSolved: data.questionsSolved + questionsSolved,
          accuracy: Math.round((data.accuracy * data.questionsSolved + accuracy * questionsSolved) / (data.questionsSolved + questionsSolved)) || 0,
          timeSpent: data.timeSpent + timeSpent,
          pointsEarned: (data.pointsEarned || 0) + points
        }, { merge: true });
      } else {
        await setDoc(activityRef, {
          userId: user.uid,
          date: dateStr,
          questionsSolved,
          accuracy,
          timeSpent,
          pointsEarned: points
        });
      }

      // Update user points
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newPoints = (userData.points || 0) + points;
        await setDoc(userRef, {
          points: newPoints
        }, { merge: true });
        
        // Update public profile
        await setDoc(doc(db, 'users_public', user.uid), {
          points: newPoints
        }, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/activity/${dateStr}`);
    }
  };

  return (
    <UserContext.Provider value={{
      dailyGoal, setDailyGoal,
      currentQs, setCurrentQs,
      pointsEarned, setPointsEarned,
      dailyPoints, setDailyPoints,
      streak, setStreak,
      userRank,
      user,
      loading,
      loginWithGoogle,
      logout,
      saveActivity
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
