import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Tests from './pages/Tests';
import NotebookHome from './modules/notebook/NotebookHome';
import AddNote from './modules/notebook/AddNote';
import NoteViewer from './modules/notebook/NoteViewer';
import EditNote from './modules/notebook/EditNote';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import BottomNav from './components/BottomNav';
import ExamDashboard from './pages/ExamDashboard';
import FormulaSubject from './pages/FormulaSubject';
import FormulaChapter from './pages/FormulaChapter';
import FormulaViewer from './pages/FormulaViewer';
import PracticeMCQScreen from './pages/PracticeMCQScreen';
import { UserProvider, useUser } from './context/UserContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const isExamDashboard = location.pathname.startsWith('/app/exam/');
  const isFormulaRoute = location.pathname.startsWith('/app/formulas/');
  const isNotebookSubRoute = location.pathname.startsWith('/app/notebook/') && location.pathname !== '/app/notebook';
  const isPracticeRoute = location.pathname.startsWith('/app/practice');

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/app/tests" element={<ProtectedRoute><Tests /></ProtectedRoute>} />
        <Route path="/app/practice" element={<ProtectedRoute><PracticeMCQScreen /></ProtectedRoute>} />
        <Route path="/app/notebook" element={<ProtectedRoute><NotebookHome /></ProtectedRoute>} />
        <Route path="/app/notebook/add" element={<ProtectedRoute><AddNote /></ProtectedRoute>} />
        <Route path="/app/notebook/:id" element={<ProtectedRoute><NoteViewer /></ProtectedRoute>} />
        <Route path="/app/notebook/edit/:id" element={<ProtectedRoute><EditNote /></ProtectedRoute>} />
        <Route path="/app/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/app/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/app/exam/:examId" element={<ProtectedRoute><ExamDashboard /></ProtectedRoute>} />
        <Route path="/app/formulas/:subjectId" element={<ProtectedRoute><FormulaSubject /></ProtectedRoute>} />
        <Route path="/app/formulas/:subjectId/:chapterId" element={<ProtectedRoute><FormulaChapter /></ProtectedRoute>} />
        <Route path="/app/formulas/:subjectId/:chapterId/:topicId" element={<ProtectedRoute><FormulaViewer /></ProtectedRoute>} />
      </Routes>
      {isAppRoute && !isExamDashboard && !isFormulaRoute && !isNotebookSubRoute && !isPracticeRoute && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ErrorBoundary>
  );
}
