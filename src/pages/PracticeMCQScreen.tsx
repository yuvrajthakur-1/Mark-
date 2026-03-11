import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, PenTool, ArrowLeft,
  Bookmark, AlertTriangle, MoreVertical, ThumbsUp, ThumbsDown, MessageSquare,
  LayoutGrid, X, User, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Scratchpad from '../components/Scratchpad';

type CommunitySolution = {
  id: string;
  userName: string;
  upvotes: number;
  text: string;
};

type Question = {
  id: number;
  subject: string;
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  options: string[];
  correctAnswer: number;
  solution: string;
  communitySolutions: CommunitySolution[];
};

const MOCK_QUESTIONS: Question[] = [
  {
    id: 101,
    subject: 'Physics',
    chapter: 'Electrostatics',
    difficulty: 'Medium',
    text: 'A charge q is placed at the center of a cube. Find the electric flux through one face.',
    options: ['q / 6ε₀', 'q / ε₀', 'q / 4ε₀', 'q / 2ε₀'],
    correctAnswer: 0,
    solution: 'Step 1: Apply Gauss Law. According to Gauss Law, the total electric flux through a closed surface is equal to the total charge enclosed divided by the permittivity of free space (ε₀).\n\nStep 2: Total flux = q/ε₀.\n\nStep 3: A cube has 6 identical faces, and the charge is at the center, so the flux is distributed equally among all 6 faces.\n\nStep 4: Flux through one face = (1/6) * (q/ε₀) = q / 6ε₀.',
    communitySolutions: [
      {
        id: 'cs1',
        userName: 'Rahul Sharma',
        upvotes: 45,
        text: 'Using Gauss theorem the total flux is q/ε₀. Since the cube is symmetric and has 6 faces, flux through one face is simply a sixth of the total.'
      },
      {
        id: 'cs2',
        userName: 'Priya Patel',
        upvotes: 12,
        text: 'Just remember: Center of cube = q/6ε₀. Corner of cube = q/24ε₀. Face center = q/2ε₀. Edge center = q/12ε₀.'
      }
    ]
  },
  {
    id: 102,
    subject: 'Physics',
    chapter: 'Kinematics',
    difficulty: 'Hard',
    text: 'A particle is moving in a circle of radius R with constant speed v. The magnitude of average acceleration after half revolution is:',
    options: ['v² / R', '2v² / πR', 'v² / πR', 'Zero'],
    correctAnswer: 1,
    solution: 'Step 1: After half revolution, the velocity vector reverses its direction.\n\nStep 2: Change in velocity (Δv) = v_final - v_initial = v - (-v) = 2v (in magnitude).\n\nStep 3: Time taken for half revolution (Δt) = Distance / Speed = πR / v.\n\nStep 4: Average acceleration = Δv / Δt = 2v / (πR / v) = 2v² / πR.',
    communitySolutions: []
  },
  {
    id: 103,
    subject: 'Chemistry',
    chapter: 'Atomic Structure',
    difficulty: 'Easy',
    text: 'The number of radial nodes for 3p orbital is:',
    options: ['0', '1', '2', '3'],
    correctAnswer: 1,
    solution: 'Step 1: The formula for radial nodes is n - l - 1.\n\nStep 2: For 3p orbital, n = 3 and l = 1.\n\nStep 3: Radial nodes = 3 - 1 - 1 = 1.',
    communitySolutions: []
  }
];

const PracticeMCQScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [questionStates, setQuestionStates] = useState<Record<number, 'unvisited' | 'attempted' | 'correct' | 'incorrect'>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [confidence, setConfidence] = useState<Record<number, 'Sure' | 'Maybe' | 'Guess'>>({});
  
  const [showSolution, setShowSolution] = useState(false);
  const [solutionTab, setSolutionTab] = useState<'official' | 'community'>('official');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [timeSpent, setTimeSpent] = useState<Record<number, number>>({});

  const currentQuestion = MOCK_QUESTIONS[currentIndex];
  const selectedOption = userAnswers[currentQuestion.id] ?? null;
  const isSubmitted = questionStates[currentQuestion.id] === 'correct' || questionStates[currentQuestion.id] === 'incorrect';

  useEffect(() => {
    // Reset solution view when changing questions
    setShowSolution(isSubmitted);
    
    // Mark as visited if unvisited
    if (!questionStates[currentQuestion.id]) {
      setQuestionStates(prev => ({ ...prev, [currentQuestion.id]: 'unvisited' }));
    }
  }, [currentIndex, currentQuestion.id, isSubmitted, questionStates]);

  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeSpent(prev => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion.id, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: index }));
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setQuestionStates(prev => ({
      ...prev,
      [currentQuestion.id]: isCorrect ? 'correct' : 'incorrect'
    }));
    setShowSolution(true);
  };

  const handleClear = () => {
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
    setConfidence(prev => {
      const newConf = { ...prev };
      delete newConf[currentQuestion.id];
      return newConf;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-kanit flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b border-white/5 bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold text-sm md:text-base flex items-center gap-3">
            <span>Question {currentIndex + 1} <span className="text-slate-500 font-normal">/ {MOCK_QUESTIONS.length}</span></span>
            <div className="flex items-center gap-1.5 text-brand bg-brand/10 px-2 py-1 rounded-md text-xs font-bold">
              <Clock size={14} />
              {formatTime(timeSpent[currentQuestion.id] || 0)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={() => toggleBookmark(currentQuestion.id)}
            className={`p-2 rounded-full transition-colors ${bookmarked[currentQuestion.id] ? 'text-yellow-500 bg-yellow-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            title="Bookmark"
          >
            <Bookmark size={20} fill={bookmarked[currentQuestion.id] ? "currentColor" : "none"} />
          </button>
          <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors" title="Report">
            <AlertTriangle size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors hidden md:block" title="Menu">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Scratchpad Overlay */}
      <AnimatePresence>
        {showScratchpad && (
          <Scratchpad onClose={() => setShowScratchpad(false)} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 flex flex-col pb-32">
        <motion.div 
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 md:p-6 mb-6"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-1 rounded-md">
              {currentQuestion.subject}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-700 px-2.5 py-1 rounded-md">
              {currentQuestion.chapter}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
              currentQuestion.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-400/10' :
              currentQuestion.difficulty === 'Medium' ? 'text-amber-400 bg-amber-400/10' :
              'text-rose-400 bg-rose-400/10'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-base md:text-lg font-medium leading-relaxed mb-6">
            {currentQuestion.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = currentQuestion.correctAnswer === index;
              
              let optionClass = "bg-slate-800 border-white/10 hover:border-brand/50 hover:bg-slate-800/80";
              let icon = null;

              if (isSubmitted) {
                if (isCorrect) {
                  optionClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                  icon = <CheckCircle2 size={20} className="text-emerald-500" />;
                } else if (isSelected) {
                  optionClass = "bg-rose-500/10 border-rose-500/50 text-rose-400";
                  icon = <XCircle size={20} className="text-rose-500" />;
                } else {
                  optionClass = "bg-slate-800/50 border-white/5 opacity-50";
                }
              } else if (isSelected) {
                optionClass = "bg-brand/10 border-brand text-brand";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${optionClass}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isSubmitted && isCorrect ? 'bg-emerald-500/20 text-emerald-500' :
                      isSubmitted && isSelected && !isCorrect ? 'bg-rose-500/20 text-rose-500' :
                      isSelected ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                  {icon}
                </button>
              );
            })}
          </div>
          
          {/* Confidence Selector */}
          {!isSubmitted && selectedOption !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-white/5"
            >
              <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Confidence Level</p>
              <div className="flex gap-2">
                {['Sure', 'Maybe', 'Guess'].map(level => {
                  const isSelected = confidence[currentQuestion.id] === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setConfidence(prev => ({ ...prev, [currentQuestion.id]: level as any }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSelected 
                          ? 'bg-brand text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {!isSubmitted ? (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className="flex-1 min-w-[120px] py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleClear}
                  disabled={selectedOption === null}
                  className="px-6 py-3 bg-slate-800 text-slate-300 border border-white/5 rounded-xl font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="flex-1 py-3 bg-slate-800 text-white border border-white/10 rounded-xl font-bold hover:bg-slate-700 transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Solution Section */}
        <AnimatePresence>
          {showSolution && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800/80 border border-white/5 rounded-2xl overflow-hidden"
            >
              <div className="flex border-b border-white/5">
                <button
                  onClick={() => setSolutionTab('official')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${solutionTab === 'official' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                >
                  Official Solution
                </button>
                <button
                  onClick={() => setSolutionTab('community')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${solutionTab === 'community' ? 'text-brand border-b-2 border-brand bg-brand/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                >
                  Community Solutions
                </button>
              </div>

              <div className="p-5 md:p-6">
                {solutionTab === 'official' ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {currentQuestion.solution}
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <span className="text-sm text-slate-400 font-medium">Was this solution helpful?</span>
                      <div className="flex gap-2">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-sm font-bold">
                          <ThumbsUp size={16} /> Yes
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 transition-all text-sm font-bold">
                          <ThumbsDown size={16} /> No
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {currentQuestion.communitySolutions.length > 0 ? (
                      currentQuestion.communitySolutions.map(sol => (
                        <div key={sol.id} className="bg-slate-900/50 rounded-xl p-4 border border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-brand">
                                <User size={12} />
                              </div>
                              <span className="text-sm font-bold text-slate-200">{sol.userName}</span>
                            </div>
                            <button className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 px-2 py-1 rounded text-xs font-bold transition-colors">
                              <ThumbsUp size={12} /> {sol.upvotes}
                            </button>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {sol.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                        <p>No community solutions yet.</p>
                        <button className="mt-3 text-brand text-sm font-bold hover:underline">Be the first to add one!</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Scratchpad Button */}
      <button 
        onClick={() => setShowScratchpad(!showScratchpad)}
        className={`fixed right-4 md:right-8 bottom-24 z-30 p-4 rounded-full shadow-xl transition-all ${showScratchpad ? 'bg-brand text-white shadow-brand/20' : 'bg-slate-800 border border-white/10 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        title="Scratchpad"
      >
        <PenTool size={24} />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/5 p-3 md:p-4 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2.5 rounded-xl font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors text-sm md:text-base"
          >
            <ChevronLeft size={20} /> <span className="hidden md:inline">Previous</span>
          </button>
          
          <button
            onClick={() => setShowPalette(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors text-sm md:text-base"
          >
            <LayoutGrid size={18} /> <span className="hidden sm:inline">Question Palette</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === MOCK_QUESTIONS.length - 1}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-light disabled:opacity-50 transition-colors text-sm md:text-base shadow-lg shadow-brand/20"
          >
            <span className="hidden md:inline">Next</span> <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Question Palette Modal */}
      <AnimatePresence>
        {showPalette && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Question Palette</h3>
                <button 
                  onClick={() => setShowPalette(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-3 overflow-y-auto p-1">
                {MOCK_QUESTIONS.map((q, idx) => {
                  const state = questionStates[q.id] || 'unvisited';
                  const isCurrent = idx === currentIndex;
                  const isBookmarked = bookmarked[q.id];
                  
                  let bgColor = 'bg-slate-800 text-slate-300 hover:bg-slate-700';
                  if (state === 'correct') bgColor = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
                  else if (state === 'incorrect') bgColor = 'bg-rose-500 text-white shadow-lg shadow-rose-500/20';
                  else if (state === 'attempted') bgColor = 'bg-blue-500 text-white shadow-lg shadow-blue-500/20';
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`relative aspect-square rounded-xl font-bold text-sm flex items-center justify-center transition-all hover:scale-105 ${bgColor} ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                    >
                      {idx + 1}
                      {isBookmarked && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800 border border-white/10"></div> Not Visited</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div> Correct</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500"></div> Incorrect</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-yellow-500"></div> Bookmarked</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeMCQScreen;
