import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Tests from './pages/Tests';
import Notebooks from './pages/Notebooks';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import BottomNav from './components/BottomNav';
import ExamDashboard from './pages/ExamDashboard';
import FormulaSubject from './pages/FormulaSubject';
import FormulaChapter from './pages/FormulaChapter';
import FormulaViewer from './pages/FormulaViewer';
import { UserProvider } from './context/UserContext';

const AppContent = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const isExamDashboard = location.pathname.startsWith('/app/exam/');
  const isFormulaRoute = location.pathname.startsWith('/app/formulas/');

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<Home />} />
        <Route path="/app/tests" element={<Tests />} />
        <Route path="/app/notebooks" element={<Notebooks />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route path="/app/leaderboard" element={<Leaderboard />} />
        <Route path="/app/exam/:examId" element={<ExamDashboard />} />
        <Route path="/app/formulas/:subjectId" element={<FormulaSubject />} />
        <Route path="/app/formulas/:subjectId/:chapterId" element={<FormulaChapter />} />
        <Route path="/app/formulas/:subjectId/:chapterId/:topicId" element={<FormulaViewer />} />
      </Routes>
      {isAppRoute && !isExamDashboard && !isFormulaRoute && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}
