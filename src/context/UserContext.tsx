import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  currentQs: number;
  setCurrentQs: (qs: number | ((prev: number) => number)) => void;
  pointsEarned: number;
  setPointsEarned: (points: number | ((prev: number) => number)) => void;
  streak: number;
  setStreak: (streak: number) => void;
  userRank: number;
  user: { email: string; name: string } | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyGoal, setDailyGoal] = useState(500);
  const [currentQs, setCurrentQs] = useState(120);
  const [pointsEarned, setPointsEarned] = useState(925);
  const [streak, setStreak] = useState(5);
  const [userRank, setUserRank] = useState(58);
  const [user, setUser] = useState<{ email: string; name: string } | null>({ email: 'student@example.com', name: 'Student' });

  // Simple logic to calculate rank based on points
  // In a real app, this would be calculated against other users on a backend
  useEffect(() => {
    // Mock logic: 10000 points = rank 1, 0 points = rank 1000
    // Just a simple inverse relationship for demonstration
    const calculatedRank = Math.max(1, Math.floor(1000 - (pointsEarned / 10)));
    setUserRank(calculatedRank);
  }, [pointsEarned]);

  return (
    <UserContext.Provider value={{
      dailyGoal, setDailyGoal,
      currentQs, setCurrentQs,
      pointsEarned, setPointsEarned,
      streak, setStreak,
      userRank,
      user
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
