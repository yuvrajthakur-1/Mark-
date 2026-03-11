import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TestsHome from '../components/TestEngine/TestsHome';
import CreateTestList from '../components/TestEngine/CreateTestList';
import CreateTestFlow from '../components/TestEngine/CreateTestFlow';
import TestCountdown from '../components/TestEngine/TestCountdown';
import TestInterface from '../components/TestEngine/TestInterface';
import TestReport from '../components/TestEngine/TestReport';
import SolutionViewer from '../components/TestEngine/SolutionViewer';
import PYQHome from '../components/TestEngine/PYQ/PYQHome';
import PYQExamList from '../components/TestEngine/PYQ/PYQExamList';
import AnalysisDashboard from './AnalysisDashboard';
import { CustomTest, PYQPaper } from '../components/TestEngine/types';
import { useUser } from '../context/UserContext';

import { saveTestReport } from '../utils/analysis';

type TestView = 'home' | 'create-list' | 'create-flow' | 'countdown' | 'interface' | 'report' | 'solutions' | 'pyq-home' | 'pyq-exam-list' | 'analysis-dashboard';

const Tests = () => {
  const location = useLocation();
  const { setPointsEarned, setCurrentQs } = useUser();
  const [view, setView] = useState<TestView>('home');
  const [activeTestData, setActiveTestData] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [selectedExam, setSelectedExam] = useState<'JEE Main' | 'NEET' | null>(null);
  
  // Handle initial view from navigation state
  useEffect(() => {
    if (location.state?.initialView) {
      setView(location.state.initialView as TestView);
    }
  }, [location.state]);
  
  // Lifted state for persistence
  const [customTests, setCustomTests] = useState<CustomTest[]>([
    {
      id: 'ct1',
      name: 'Physics: Mechanics & Waves',
      exam: 'JEE Main',
      subjects: ['Physics'],
      chapters: ['ch1', 'ch2'],
      questionCount: 30,
      duration: 60,
      createdAt: new Date().toISOString(),
      status: 'Not Attempted',
    }
  ]);

  const [pyqPapers, setPyqPapers] = useState<Record<string, PYQPaper[]>>({});

  const handleBack = () => {
    if (view === 'create-list') setView('home');
    else if (view === 'create-flow') setView('create-list');
    else if (view === 'report') {
      // If it was a custom test, go to create-list, if PYQ, go to pyq-exam-list
      if (activeTestData?.isPYQ) setView('pyq-exam-list');
      else setView('create-list');
    }
    else if (view === 'solutions') setView('report');
    else if (view === 'analysis-dashboard') setView('report');
    else if (view === 'pyq-home') setView('home');
    else if (view === 'pyq-exam-list') setView('pyq-home');
    else window.history.back();
  };

  const startTest = (data: any) => {
    setActiveTestData(data);
    setView('countdown');
  };

  const handleTestComplete = (results: any) => {
    // Calculate score
    const correct = results.questions.filter((q: any) => String(results.answers[q.id]) === String(q.correctAnswer)).length;
    const attempted = Object.keys(results.answers).length;
    const incorrect = attempted - correct;
    const skipped = results.questions.length - attempted;
    const score = correct * 4 - incorrect * 1;

    setTestResults({ ...results, score, name: activeTestData.name });
    
    // Save report for analysis
    saveTestReport({
      email: 'student@example.com', // Mock email
      testId: activeTestData.id,
      subject: activeTestData.subjects?.[0] || 'Physics', // Default to Physics if not specified
      chapter: activeTestData.chapters?.[0] || 'General',
      correct,
      wrong: incorrect,
      skipped,
      total: results.questions.length,
      score,
      timeTaken: results.timeSpent || 0,
      date: new Date().toISOString()
    });
    
    // Update global user stats
    setCurrentQs(prev => prev + attempted);
    setPointsEarned(prev => prev + (correct * 10)); // 10 points per correct answer
    
    // Update status in state
    if (activeTestData?.isPYQ) {
      const examKey = activeTestData.exam;
      setPyqPapers(prev => ({
        ...prev,
        [examKey]: prev[examKey]?.map(p => 
          p.id === activeTestData.id 
            ? { ...p, status: 'Attempted' as const, attemptDate: "Today" } 
            : p
        ) || []
      }));
    } else {
      setCustomTests(prev => prev.map(t => 
        t.id === activeTestData.id 
          ? { 
              ...t, 
              status: 'Attempted' as const, 
              score: score, 
              totalMarks: results.questions.length * 4 
            } 
          : t
      ));
    }
    
    setView('report');
  };

  const handleCreateFinish = (data: any) => {
    const newTest: CustomTest = {
      id: `ct-${Date.now()}`,
      name: data.name || `Custom Test ${customTests.length + 1}`,
      exam: data.exam,
      subjects: data.subjects,
      chapters: data.chapters,
      questionCount: data.questionCount,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      status: 'Not Attempted',
    };
    
    setCustomTests(prev => [newTest, ...prev]);
    startTest({ ...newTest, isPYQ: false });
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {view === 'home' && (
        <TestsHome 
          onBack={handleBack}
          onCreateTest={() => setView('create-list')}
          onViewPYQs={() => setView('pyq-home')}
          onViewTestSeries={() => {}}
        />
      )}

      {view === 'pyq-home' && (
        <PYQHome 
          onBack={() => setView('home')}
          onSelectExam={(exam) => {
            setSelectedExam(exam);
            setView('pyq-exam-list');
          }}
        />
      )}

      {view === 'pyq-exam-list' && (
        <PYQExamList 
          exam={selectedExam || 'JEE Main'}
          papers={pyqPapers[selectedExam || 'JEE Main'] || []}
          setPapers={(papers) => setPyqPapers(prev => ({ ...prev, [selectedExam || 'JEE Main']: papers }))}
          onBack={() => setView('pyq-home')}
          onSelectPaper={(paper) => {
            startTest({
              ...paper,
              isPYQ: true,
              subjects: paper.exam === 'JEE Main' ? ['Physics', 'Chemistry', 'Mathematics'] : ['Physics', 'Chemistry', 'Biology'],
              questionCount: paper.exam === 'JEE Main' ? 75 : 180,
              duration: 180,
            });
          }}
          onViewAnalysis={(paper) => {
            // Mock results for analysis
            setTestResults({
              name: paper.name,
              questions: Array.from({ length: 10 }).map((_, i) => ({ id: i, subject: 'Physics', correctAnswer: 'A' })),
              answers: {},
              timeSpent: 3600,
              score: 0
            });
            setActiveTestData({ ...paper, isPYQ: true });
            setView('report');
          }}
        />
      )}

      {view === 'create-list' && (
        <CreateTestList 
          tests={customTests}
          onBack={() => setView('home')}
          onCreateNew={() => setView('create-flow')}
          onAttemptTest={(test) => startTest({ ...test, isPYQ: false })}
          onViewAnalysis={(test) => {
            setTestResults({
              name: test.name,
              questions: Array.from({ length: test.questionCount }).map((_, i) => ({ id: i, subject: test.subjects[0], correctAnswer: 'A' })),
              answers: {},
              timeSpent: 1800,
              score: test.score || 0
            });
            setActiveTestData({ ...test, isPYQ: false });
            setView('report');
          }}
        />
      )}

      {view === 'create-flow' && (
        <CreateTestFlow 
          onBack={() => setView('create-list')}
          onFinish={handleCreateFinish}
        />
      )}

      {view === 'countdown' && (
        <TestCountdown onComplete={() => setView('interface')} />
      )}

      {view === 'interface' && (
        <TestInterface 
          testData={activeTestData}
          onExit={() => setView('create-list')}
          onSubmit={handleTestComplete}
        />
      )}

      {view === 'report' && (
        <TestReport 
          results={testResults || { questions: [], answers: {}, timeSpent: 0 }}
          onBack={() => setView('create-list')}
          onViewSolutions={() => setView('solutions')}
          onViewAnalysis={() => setView('analysis-dashboard')}
        />
      )}

      {view === 'solutions' && (
        <SolutionViewer 
          results={testResults}
          onBack={() => setView('report')}
        />
      )}

      {view === 'analysis-dashboard' && (
        <AnalysisDashboard onBack={() => setView('report')} />
      )}
    </div>
  );
};

export default Tests;
