import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Info,
  BookOpen,
  LayoutGrid,
  X
} from 'lucide-react';

interface SolutionViewerProps {
  results: any;
  onBack: () => void;
}

const SolutionViewer: React.FC<SolutionViewerProps> = ({ results, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavModal, setShowNavModal] = useState(false);
  const questions = results.questions;
  const currentQuestion = questions[currentIndex];
  const userAnswer = results.answers[currentQuestion.id];
  const isCorrect = String(userAnswer) === String(currentQuestion.correctAnswer);
  const isUnattempted = userAnswer === undefined;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#0F172A]/80 backdrop-blur-lg z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Solutions</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Q{currentIndex + 1} • {currentQuestion.subject}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowNavModal(true)}
          className="p-2 bg-slate-800 rounded-xl border border-white/5"
        >
          <LayoutGrid size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Status Banner */}
        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
          isUnattempted ? 'bg-slate-800/40 border-slate-700 text-slate-400' :
          isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
          'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {isUnattempted ? <Info size={20} /> : isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span className="text-sm font-bold">
            {isUnattempted ? 'Not Attempted' : isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
          </span>
        </div>

        {/* Question */}
        <div className="space-y-4">
          <div className="text-lg leading-relaxed text-slate-200">
            {currentQuestion.text}
          </div>
          {currentQuestion.options ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option: string, i: number) => {
                const isCorrectOption = String(option) === String(currentQuestion.correctAnswer);
                const isUserOption = String(option) === String(userAnswer);
                
                return (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
                      isCorrectOption ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10' :
                      isUserOption ? 'bg-red-500/10 border-red-500' :
                      'bg-slate-800/40 border-white/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isCorrectOption ? 'bg-emerald-500 border-emerald-500 text-white' :
                      isUserOption ? 'bg-red-500 border-red-500 text-white' :
                      'border-slate-600 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`text-sm ${isCorrectOption ? 'text-emerald-500 font-bold' : isUserOption ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {option}
                    </span>
                    {isCorrectOption && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                    {isUserOption && !isCorrectOption && <XCircle size={18} className="ml-auto text-red-500" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 rounded-2xl border-2 bg-slate-800/40 border-white/5">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block mb-2">Your Answer</span>
              <span className={`text-lg font-bold ${isCorrect ? 'text-emerald-500' : isUnattempted ? 'text-slate-400' : 'text-red-500'}`}>
                {isUnattempted ? 'Not Attempted' : userAnswer}
              </span>
            </div>
          )}
        </div>

        {/* Solution Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-brand">
            <BookOpen size={20} />
            <h3 className="font-bold">Detailed Solution</h3>
          </div>
          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Correct Answer</span>
              <span className="text-lg font-bold text-emerald-500">{currentQuestion.correctAnswer}</span>
            </div>
            <div className="text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
              <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-white/5 font-mono text-xs text-slate-400">
                // Formula used: F = ma
                // Given: m = 10kg, a = 5m/s²
                // Calculation: 10 * 5 = 50N
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="p-6 bg-slate-900 border-t border-white/5 flex gap-3">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
            currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-slate-800 text-white'
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
            currentIndex === questions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-brand text-white shadow-xl shadow-brand/30'
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </footer>

      {/* Nav Modal */}
      <AnimatePresence>
        {showNavModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-6 flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-slate-900 rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Jump to Question</h3>
                <button onClick={() => setShowNavModal(false)} className="p-2 bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {questions.map((q: any, i: number) => {
                  const ans = results.answers[q.id];
                  const correct = ans !== undefined && String(ans) === String(q.correctAnswer);
                  const unattempted = ans === undefined;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(i);
                        setShowNavModal(false);
                      }}
                      className={`h-12 rounded-xl flex items-center justify-center text-sm font-bold border transition-all ${
                        i === currentIndex ? 'border-brand ring-2 ring-brand ring-offset-2 ring-offset-slate-900' :
                        unattempted ? 'bg-slate-800 border-white/5 text-slate-500' :
                        correct ? 'bg-emerald-500 border-emerald-500 text-white' :
                        'bg-red-500 border-red-500 text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SolutionViewer;
