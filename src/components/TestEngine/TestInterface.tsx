import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Menu,
  Play
} from 'lucide-react';
import { SubjectType, Question } from './types';

interface TestInterfaceProps {
  testData: any;
  onExit: () => void;
  onSubmit: (results: any) => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ testData, onExit, onSubmit }) => {
  const [currentSubject, setCurrentSubject] = useState<SubjectType>(testData.subjects[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Mock questions generation
  const questions: Question[] = React.useMemo(() => {
    const qCount = testData.questionCount || 30;
    const subCount = testData.subjects.length;
    const qPerSub = Math.floor(qCount / subCount);
    const remainder = qCount % subCount;

    return testData.subjects.flatMap((sub: SubjectType, subIdx: number) => {
      const count = qPerSub + (subIdx < remainder ? 1 : 0);
      return Array.from({ length: count }).map((_, i) => {
        const year = testData.yearFilter === 'Last 5 Years' 
          ? 2020 + Math.floor(Math.random() * 6)
          : 2010 + Math.floor(Math.random() * 16);
        
        const source = testData.isPYQ ? 'PYQ' : (testData.source || 'Practice');

        return {
          id: `${sub}-${i}`,
          type: i % 5 === 0 ? 'Numerical' : 'MCQ',
          subject: sub,
          text: `[${source} ${year}] This is a sample question for ${sub}. What is the correct approach to solve this problem involving multiple concepts?`,
          options: i % 5 === 0 ? undefined : ['Option A is correct', 'Option B is incorrect', 'Option C is partially correct', 'Option D is definitely wrong'],
          correctAnswer: i % 5 === 0 ? 42 : 'Option A is correct',
          explanation: 'Step by step explanation goes here...',
          points: 4
        };
      });
    });
  }, [testData]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const toggleMarkForReview = () => {
    if (markedForReview.includes(currentQuestion.id)) {
      setMarkedForReview(markedForReview.filter(id => id !== currentQuestion.id));
    } else {
      setMarkedForReview([...markedForReview, currentQuestion.id]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentSubject(questions[currentQuestionIndex + 1].subject);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentSubject(questions[currentQuestionIndex - 1].subject);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      answers,
      markedForReview,
      timeSpent: testData.duration * 60 - timeLeft,
      questions
    });
  };

  const getQuestionStatus = (index: number) => {
    const qId = questions[index].id;
    if (index === currentQuestionIndex) return 'current';
    if (markedForReview.includes(qId)) return 'marked';
    if (answers[qId] !== undefined) return 'answered';
    return 'unvisited';
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A] text-white flex flex-col z-50 overflow-hidden font-kanit">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-bottom border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold truncate max-w-[120px]">{testData.name}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live Test</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaused(true)}
            className="p-2 bg-slate-800 rounded-xl border border-white/5 text-slate-400 hover:text-brand transition-colors"
          >
            <Clock size={18} />
          </button>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-2xl border border-white/5">
            <span className="font-mono font-bold text-lg tabular-nums text-brand">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <button 
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-2 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20"
        >
          Submit
        </button>
      </header>

      {/* Subject Tabs */}
      <div className="flex px-4 bg-slate-900/30 border-b border-white/5 overflow-x-auto no-scrollbar">
        {testData.subjects.map((sub: SubjectType) => (
          <button
            key={sub}
            onClick={() => {
              const firstQIndex = questions.findIndex(q => q.subject === sub);
              setCurrentQuestionIndex(firstQIndex);
              setCurrentSubject(sub);
            }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all relative ${
              currentSubject === sub ? 'text-brand' : 'text-slate-500'
            }`}
          >
            {sub}
            {currentSubject === sub && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Question Navigation Bar */}
      <div className="px-4 py-3 bg-slate-900/20 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
        {questions.map((q, i) => {
          const status = getQuestionStatus(i);
          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentQuestionIndex(i);
                setCurrentSubject(q.subject);
              }}
              className={`min-w-[40px] h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all border ${
                status === 'current' ? 'bg-brand border-brand text-white scale-110' :
                status === 'marked' ? 'bg-orange-500 border-orange-500 text-white' :
                status === 'answered' ? 'bg-emerald-500 border-emerald-500 text-white' :
                'bg-slate-800 border-white/5 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Question Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-brand">Q{currentQuestionIndex + 1}</span>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider">
              {currentQuestion.type}
            </span>
          </div>
          <div className="text-sm font-bold text-emerald-500">+{currentQuestion.points} Marks</div>
        </div>

        <div className="text-lg leading-relaxed text-slate-200">
          {currentQuestion.text}
        </div>

        {/* Answer Input */}
        <div className="space-y-4 pt-4">
          {currentQuestion.type === 'MCQ' ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                    answers[currentQuestion.id] === option
                      ? 'bg-brand/10 border-brand shadow-lg shadow-brand/10'
                      : 'bg-slate-800/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    answers[currentQuestion.id] === option ? 'bg-brand border-brand text-white' : 'border-slate-600 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className={answers[currentQuestion.id] === option ? 'text-white font-bold' : 'text-slate-400'}>
                    {option}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Enter your answer</p>
              <input 
                type="number"
                placeholder="0.00"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full p-6 bg-slate-800/40 border-2 border-white/5 rounded-3xl text-2xl font-bold text-brand focus:border-brand outline-none transition-all"
              />
            </div>
          ) }
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="p-6 bg-slate-900/80 backdrop-blur-lg border-t border-white/5">
        <div className="flex gap-3 mb-4">
          <button 
            onClick={() => setAnswers({ ...answers, [currentQuestion.id]: undefined })}
            className="flex-1 py-3 text-sm font-bold text-slate-400 border border-white/5 rounded-xl hover:bg-white/5 transition-all"
          >
            Clear
          </button>
          <button 
            onClick={toggleMarkForReview}
            className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
              markedForReview.includes(currentQuestion.id)
                ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                : 'text-slate-400 border-white/5 hover:bg-white/5'
            }`}
          >
            {markedForReview.includes(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
          </button>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
              currentQuestionIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-slate-800 text-white'
            }`}
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          <button 
            onClick={handleNext}
            className="flex-[2] py-4 bg-brand text-white rounded-2xl flex items-center justify-center gap-2 font-bold shadow-xl shadow-brand/30"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Section' : 'Save & Next'}
            <ChevronRight size={20} />
          </button>
        </div>

        <button 
          onClick={() => setShowNavModal(true)}
          className="w-full mt-4 py-2 text-xs font-bold text-slate-500 flex items-center justify-center gap-2"
        >
          <LayoutGrid size={14} />
          View All Questions
        </button>
      </footer>

      {/* Navigation Modal */}
      <AnimatePresence>
        {showNavModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] p-6 flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-slate-900 rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Question Paper</h3>
                <button onClick={() => setShowNavModal(false)} className="p-2 bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {testData.subjects.map((sub: SubjectType) => (
                  <div key={sub} className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{sub}</h4>
                    <div className="grid grid-cols-5 gap-3">
                      {questions.filter(q => q.subject === sub).map((q) => {
                        const index = questions.findIndex(item => item.id === q.id);
                        const status = getQuestionStatus(index);
                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentQuestionIndex(index);
                              setCurrentSubject(sub);
                              setShowNavModal(false);
                            }}
                            className={`h-12 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${
                              status === 'current' ? 'bg-brand border-brand text-white' :
                              status === 'marked' ? 'bg-orange-500 border-orange-500 text-white' :
                              status === 'answered' ? 'bg-emerald-500 border-emerald-500 text-white' :
                              'bg-slate-800 border-white/5 text-slate-500'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-500 rounded-md" />
                  <span className="text-xs text-slate-400 font-bold">Answered</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-md" />
                  <span className="text-xs text-slate-400 font-bold">Marked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-slate-800 border border-white/5 rounded-md" />
                  <span className="text-xs text-slate-400 font-bold">Unvisited</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-brand rounded-md" />
                  <span className="text-xs text-slate-400 font-bold">Current</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Modal */}
      <AnimatePresence>
        {isPaused && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-8 text-center border border-white/5"
            >
              <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center text-brand mx-auto mb-6">
                <Clock size={40} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Test Paused</h3>
              <p className="text-slate-400 mb-8">
                Take a breath. Your progress is saved. The timer is stopped.
              </p>
              <button 
                onClick={() => setIsPaused(false)}
                className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/30 flex items-center justify-center gap-2"
              >
                <Play size={20} fill="white" />
                Resume Test
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-8 text-center"
            >
              <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center text-brand mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Submit Test?</h3>
              <p className="text-slate-400 mb-8">
                You have answered {Object.keys(answers).length} out of {questions.length} questions. Are you sure you want to submit?
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-500/20"
                >
                  Submit Test
                </button>
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl"
                >
                  Go Back to Test
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestInterface;
