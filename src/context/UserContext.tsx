import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

export interface NotificationPrefs {
  push: boolean;
  emails: boolean;
  testReminders: boolean;
  newContent: boolean;
  marketing: boolean;
}

export interface ChapterProgress {
  [chapterId: string]: {
    completed: boolean;
    accuracy: number;
    score: number;
    questionsSolved: number;
  };
}

export interface DailyTask {
  id: number;
  title: string;
  completed: boolean;
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
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  notifications: NotificationPrefs;
  setNotifications: (prefs: NotificationPrefs) => void;
  profilePic: string | null;
  setProfilePic: (url: string | null) => void;
  chapterProgress: ChapterProgress;
  setChapterProgress: (progress: ChapterProgress) => void;
  activityHistory: string[];
  tasks: DailyTask[];
  setTasks: (tasks: DailyTask[]) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveActivity: (questionsSolved: number, accuracy: number, timeSpent: number, points: number, chapterId?: string) => Promise<void>;
  updateUserProfile: (data: Partial<{ theme: string; notifications: NotificationPrefs; profilePic: string | null; dailyGoal: number; dailyTasks: DailyTask[]; tasksDate: string }>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyGoal, setDailyGoalLocal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 500;
  });

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);
  const [tasks, setTasksState] = useState<DailyTask[]>([]);
  
  const setDailyGoal = (goal: number) => {
    setDailyGoalLocal(goal);
    updateUserProfile({ dailyGoal: goal });
  };

  const setTasks = (newTasks: DailyTask[]) => {
    setTasksState(newTasks);
    const today = new Date().toISOString().split('T')[0];
    updateUserProfile({ dailyTasks: newTasks, tasksDate: today });
  };

  const [currentQs, setCurrentQs] = useState(120);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userRank, setUserRank] = useState(58);
  const [user, setUser] = useState<{ uid: string; email: string; name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotificationsState] = useState<NotificationPrefs>({
    push: true, emails: true, testReminders: true, newContent: true, marketing: false
  });
  const [profilePic, setProfilePicState] = useState<string | null>(null);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>({});
  const [activityHistory, setActivityHistory] = useState<string[]>([]);

  const sendPushNotification = useCallback((title: string, body: string) => {
    if (notifications.push && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  }, [notifications.push]);

  const [goalNotified, setGoalNotified] = useState(false);

  useEffect(() => {
    if (currentQs >= dailyGoal && currentQs > 0 && !goalNotified) {
      sendPushNotification('Daily Goal Reached! 🎉', `Awesome job! You've solved ${currentQs} questions today.`);
      setGoalNotified(true);
    } else if (currentQs < dailyGoal) {
      setGoalNotified(false);
    }
  }, [currentQs, dailyGoal, goalNotified, sendPushNotification]);

  useEffect(() => {
    if (user && streak > 0) {
      const streakNotified = sessionStorage.getItem('streakNotified');
      if (!streakNotified) {
        sendPushNotification('Keep it up! 🔥', `You're on a ${streak}-day study streak!`);
        sessionStorage.setItem('streakNotified', 'true');
      }
    }
  }, [user, streak, sendPushNotification]);

  useEffect(() => {
    if (user) {
      const testNotified = sessionStorage.getItem('testNotified');
      if (!testNotified) {
        setTimeout(() => {
          sendPushNotification('Upcoming Test Reminder 📝', 'Your JEE Mock Test starts in 2 hours. Get ready!');
        }, 5000);
        sessionStorage.setItem('testNotified', 'true');
      }
    }
  }, [user, sendPushNotification]);

  const updateUserProfile = async (data: Partial<{ theme: string; notifications: NotificationPrefs; profilePic: string | null; dailyGoal: number; dailyTasks: DailyTask[]; tasksDate: string }>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      if (data.profilePic !== undefined) {
        await setDoc(doc(db, 'users_public', user.uid), { profilePic: data.profilePic }, { merge: true });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    updateUserProfile({ theme: newTheme });
  };

  const setNotifications = async (prefs: NotificationPrefs) => {
    setNotificationsState(prefs);
    updateUserProfile({ notifications: prefs });
    
    if (prefs.push && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        await Notification.requestPermission();
      }
    }
  };

  const setProfilePic = (url: string | null) => {
    setProfilePicState(url);
    updateUserProfile({ profilePic: url });
  };

  useEffect(() => {
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
          } else {
            const data = userDoc.data();
            const todayStr = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (data.streak > 0 && data.lastCompletedDate !== todayStr && data.lastCompletedDate !== yesterdayStr) {
              // Streak broken
              await setDoc(userDocRef, { streak: 0 }, { merge: true });
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
              if (data.theme) setThemeState(data.theme);
              if (data.notifications) setNotificationsState(data.notifications);
              if (data.profilePic) setProfilePicState(data.profilePic);
              if (data.chapterProgress) setChapterProgress(data.chapterProgress);
              if (data.dailyGoal) setDailyGoalLocal(data.dailyGoal);
              
              const todayStr = new Date().toISOString().split('T')[0];
              if (data.tasksDate === todayStr && data.dailyTasks) {
                setTasksState(data.dailyTasks);
              } else {
                setTasksState([]); // Reset tasks for a new day
              }
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
          
          // Fetch activity history for the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
          
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const activityQuery = query(
            collection(db, `users/${firebaseUser.uid}/activity`),
            where('date', '>=', thirtyDaysAgoStr)
          );
          
          const unsubHistory = onSnapshot(activityQuery, (snapshot) => {
            const history: string[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              // Assuming goal is met if questionsSolved >= dailyGoal
              // Since we don't have historical daily goals, we'll use the current one or a threshold
              if (data.questionsSolved > 0) {
                history.push(data.date);
              }
            });
            setActivityHistory(history);
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, `users/${firebaseUser.uid}/activity`);
          });
          
          setLoading(false);
          return () => {
            unsubDoc();
            unsubActivity();
            unsubHistory();
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

  const saveActivity = async (questionsSolved: number, accuracy: number, timeSpent: number, points: number, chapterId?: string) => {
    if (!user) return;
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    try {
      const activityRef = doc(db, `users/${user.uid}/activity`, dateStr);
      const activityDoc = await getDoc(activityRef);
      
      let prevQs = 0;
      let newQs = questionsSolved;

      if (activityDoc.exists()) {
        const data = activityDoc.data();
        prevQs = data.questionsSolved || 0;
        const prevAcc = data.accuracy || 0;
        const prevTime = data.timeSpent || 0;
        const prevPoints = data.pointsEarned || 0;
        
        newQs = prevQs + questionsSolved;
        const newAcc = newQs === 0 ? 0 : Math.round((prevAcc * prevQs + accuracy * questionsSolved) / newQs);

        await setDoc(activityRef, {
          userId: user.uid,
          date: dateStr,
          questionsSolved: newQs,
          accuracy: newAcc,
          timeSpent: prevTime + timeSpent,
          pointsEarned: prevPoints + points
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

      // Update user points and chapter progress
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newPoints = (userData.points || 0) + points;
        
        let newChapterProgress = userData.chapterProgress || {};
        if (chapterId) {
          const currentChapter = newChapterProgress[chapterId] || { completed: false, accuracy: 0, score: 0, questionsSolved: 0 };
          const newChapQs = currentChapter.questionsSolved + questionsSolved;
          const newChapAcc = newChapQs === 0 ? 0 : Math.round((currentChapter.accuracy * currentChapter.questionsSolved + accuracy * questionsSolved) / newChapQs);
          
          newChapterProgress = {
            ...newChapterProgress,
            [chapterId]: {
              ...currentChapter,
              questionsSolved: newChapQs,
              accuracy: newChapAcc,
              score: currentChapter.score + points,
              completed: newChapQs >= 5 // Example threshold for completion
            }
          };
        }

        let newStreak = userData.streak || 0;
        let lastCompletedDate = userData.lastCompletedDate;

        if (newQs >= dailyGoal && prevQs < dailyGoal) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastCompletedDate === yesterdayStr) {
            newStreak += 1;
          } else if (lastCompletedDate !== dateStr) {
            newStreak = 1;
          }
          lastCompletedDate = dateStr;
        }

        await setDoc(userRef, {
          uid: user.uid,
          email: userData.email || user.email,
          name: userData.name || user.name,
          points: newPoints,
          streak: newStreak,
          lastCompletedDate: lastCompletedDate || null,
          role: userData.role || 'user',
          rank: userData.rank !== undefined ? userData.rank : 1000,
          chapterProgress: newChapterProgress
        }, { merge: true });
        
        // Update public profile
        await setDoc(doc(db, 'users_public', user.uid), {
          uid: user.uid,
          name: userData.name || user.name,
          points: newPoints,
          rank: userData.rank !== undefined ? userData.rank : 1000,
          ...(userData.profilePic ? { profilePic: userData.profilePic } : {})
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
      theme, setTheme,
      notifications, setNotifications,
      profilePic, setProfilePic,
      chapterProgress, setChapterProgress,
      activityHistory,
      tasks, setTasks,
      loginWithGoogle,
      logout,
      saveActivity,
      updateUserProfile
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
