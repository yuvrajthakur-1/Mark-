import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Bookmark, ThumbsDown, ThumbsUp, List, Zap, ChevronLeft, BookMarked as BookMarkedIcon } from 'lucide-react';
import { formulasData } from '../data/formulas';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { notebookDB } from '../utils/notebookDB';
import { useUser } from '../context/UserContext';

const FormulaViewer = () => {
  const navigate = useNavigate();
  const { subjectId, chapterId, topicId } = useParams();
  
  const subjectKey = useMemo(() => {
    if (!subjectId) return 'Physics';
    const normalized = subjectId.toLowerCase();
    if (normalized === 'physics') return 'Physics';
    if (normalized === 'chemistry') return 'Chemistry';
    if (normalized === 'maths' || normalized === 'mathematics') return 'Mathematics';
    return 'Physics';
  }, [subjectId]);

  const chapterKey = decodeURIComponent(chapterId || '');
  const topicKey = decodeURIComponent(topicId || '');
  
  const subjectData = formulasData[subjectKey] || { chapters: {} };
  const chapterData = subjectData.chapters[chapterKey] || { topics: {} };
  const topicData = chapterData.topics[topicKey] || { cards: [], total_cards: 0 };
  const cards = topicData.cards;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [localCards, setLocalCards] = useState(cards);
  const [isFinished, setIsFinished] = useState(false);
  const [savedToNotebook, setSavedToNotebook] = useState<Record<number, boolean>>({});
  const { user } = useUser();

  if (!localCards || localCards.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-800 font-kanit p-6">
        <h2 className="text-2xl font-bold mb-4">No Formula Cards Found</h2>
        <p className="text-slate-500 mb-8 text-center">There are currently no formula cards available for {topicKey}.</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-800 font-kanit p-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <ThumbsUp size={48} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-center">Great Job!</h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">You've reviewed all formula cards for {topicKey}.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setIsFinished(false);
            }}
            className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            Review Again
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition-colors"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentCard = localCards[currentIndex];

  const handleNext = () => {
    if (currentIndex < localCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const updateStatus = (statusKey: 'memorized' | 'need_revision' | 'bookmarked') => {
    setLocalCards(prev => {
      const newCards = [...prev];
      const card = { ...newCards[currentIndex] };
      card.status = { ...card.status };
      
      if (statusKey === 'memorized') {
        card.status.memorized = true;
        card.status.need_revision = false;
        card.status.not_seen = false;
      } else if (statusKey === 'need_revision') {
        card.status.need_revision = true;
        card.status.memorized = false;
        card.status.not_seen = false;
      } else if (statusKey === 'bookmarked') {
        card.status.bookmarked = !card.status.bookmarked;
      }
      
      newCards[currentIndex] = card;
      
      // Update the global data as well for this session
      const globalCard = formulasData[subjectKey].chapters[chapterKey].topics[topicKey].cards[currentIndex];
      if (globalCard) {
        globalCard.status = card.status;
      }
      
      return newCards;
    });
  };

  const handleThumbsUp = () => {
    updateStatus('memorized');
    handleNext();
  };

  const handleThumbsDown = () => {
    updateStatus('need_revision');
    handleNext();
  };

  const toggleBookmark = () => {
    updateStatus('bookmarked');
  };

  const handleSaveToNotebook = () => {
    if (savedToNotebook[currentIndex]) return;

    notebookDB.addNote({
      email: user?.email || 'student@example.com',
      subject: subjectKey,
      chapter: chapterKey,
      title: `Formula: ${currentCard.title}`,
      content: `Definition:\n${currentCard.definition}\n\nFormula:\n${currentCard.formula}\n\nVariables:\n${Object.entries(currentCard.variables).map(([k, v]) => `${k}: ${v}`).join('\n')}`
    });

    setSavedToNotebook(prev => ({ ...prev, [currentIndex]: true }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-kanit flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-lg z-40 border-b border-slate-200">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {chapterKey} • {topicKey}
          </p>
          <h1 className="text-lg font-bold leading-tight line-clamp-1">{currentCard.title}</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all ml-4"
        >
          <X size={24} />
        </button>
      </header>

      {/* Progress Bar & Badges */}
      <div className="px-4 py-3 flex items-center justify-between bg-white z-30 relative shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md">
            <List size={16} />
            <span>{currentIndex + 1}/{localCards.length}</span>
          </div>
          {currentCard.status.memorized && (
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-200">
              Memorized
            </div>
          )}
          {currentCard.status.need_revision && (
            <div className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-rose-200">
              Needs Revision
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSaveToNotebook}
            disabled={savedToNotebook[currentIndex]}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border ${
              savedToNotebook[currentIndex] 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-500' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookMarkedIcon size={20} className={savedToNotebook[currentIndex] ? "fill-current" : ""} />
          </button>
          <button 
            onClick={toggleBookmark}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all shadow-sm border border-slate-200"
          >
            <Bookmark size={20} className={currentCard.status.bookmarked ? "fill-current text-blue-500" : ""} />
          </button>
        </div>
      </div>

      {/* Card Content Area */}
      <main className="flex-1 relative overflow-y-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-md mx-auto space-y-6"
          >
            {/* Title */}
            <h2 className="text-4xl font-black text-center text-slate-900 tracking-tight" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif" }}>
              {currentCard.title}
            </h2>

            {/* Definition */}
            <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 shadow-sm relative">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-amber-400 rounded-full border-2 border-white" />
              <p className="text-lg font-medium text-slate-800 leading-relaxed">
                <span className="font-bold text-amber-700 mr-2">•</span>
                {currentCard.definition}
              </p>
            </div>

            {/* Formula Display */}
            <div className="bg-purple-50 rounded-3xl p-8 border-2 border-purple-200 shadow-md flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10 text-4xl text-purple-900 font-bold bg-white px-8 py-6 rounded-2xl shadow-sm border border-purple-100">
                <BlockMath math={currentCard.formula} />
              </div>
            </div>

            {/* Variables & Units */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Variables & Units</h3>
              <div className="space-y-3">
                {Object.entries(currentCard.variables).map(([symbol, meaning]) => (
                  <div key={symbol} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg border border-blue-100">
                        <InlineMath math={symbol} />
                      </div>
                      <span className="font-bold text-slate-700">{meaning}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                      {currentCard.units[symbol] || '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            {currentCard.important_notes && currentCard.important_notes.length > 0 && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap size={16} /> Important Notes
                </h3>
                <ul className="space-y-2">
                  {currentCard.important_notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 font-medium">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Mistakes */}
            {currentCard.common_mistakes && currentCard.common_mistakes.length > 0 && (
              <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200">
                <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <X size={16} /> Common Mistakes
                </h3>
                <ul className="space-y-2">
                  {currentCard.common_mistakes.map((mistake, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 font-medium">
                      <span className="text-rose-500 font-bold mt-0.5">×</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Example */}
            {currentCard.example && (
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">Example</h3>
                <p className="text-slate-700 font-medium italic">{currentCard.example}</p>
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                currentCard.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                currentCard.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                'bg-rose-100 text-rose-700 border-rose-200'
              }`}>
                {currentCard.difficulty}
              </span>
              {currentCard.exam_relevance.map(exam => (
                <span key={exam} className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {exam}
                </span>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-50 flex justify-center gap-6">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={handleThumbsDown}
          className="w-16 h-16 rounded-full bg-white border-2 border-rose-100 flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all shadow-lg"
        >
          <ThumbsDown size={28} />
        </button>
        <button 
          onClick={handleThumbsUp}
          className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-emerald-400 flex items-center justify-center text-white hover:bg-emerald-600 hover:scale-105 transition-all shadow-lg shadow-emerald-500/30"
        >
          <ThumbsUp size={28} />
        </button>
      </div>
    </div>
  );
};

export default FormulaViewer;
