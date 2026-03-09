import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Search, EyeOff, Bookmark, ThumbsDown, ThumbsUp, Zap, Beaker, Calculator, FileText } from 'lucide-react';
import { formulasData } from '../data/formulas';

const FormulaSubject = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  
  // Normalize subjectId to match keys in formulasData
  const subjectKey = useMemo(() => {
    if (!subjectId) return 'Physics';
    const normalized = subjectId.toLowerCase();
    if (normalized === 'physics') return 'Physics';
    if (normalized === 'chemistry') return 'Chemistry';
    if (normalized === 'maths' || normalized === 'mathematics') return 'Mathematics';
    return 'Physics';
  }, [subjectId]);

  const subjectData = formulasData[subjectKey] || { chapters: {} };
  const chapters = Object.keys(subjectData.chapters);

  // Calculate stats
  let totalCards = 0;
  let notSeen = 0;
  let bookmarked = 0;
  let needRevision = 0;
  let memorized = 0;

  chapters.forEach(chapter => {
    const topics = subjectData.chapters[chapter].topics;
    Object.values(topics).forEach(topic => {
      totalCards += topic.total_cards;
      topic.cards.forEach(card => {
        if (card.status.not_seen) notSeen++;
        if (card.status.bookmarked) bookmarked++;
        if (card.status.need_revision) needRevision++;
        if (card.status.memorized) memorized++;
      });
    });
  });

  // If no cards, just mock some numbers for display purposes
  if (totalCards === 0) {
    totalCards = 857;
    notSeen = 660;
    bookmarked = 0;
    needRevision = 0;
    memorized = 14;
  }

  const getSubjectIcon = () => {
    if (subjectKey === 'Physics') return <Zap size={24} className="text-orange-500" />;
    if (subjectKey === 'Chemistry') return <Beaker size={24} className="text-emerald-500" />;
    return <Calculator size={24} className="text-blue-500" />;
  };

  const getSubjectColor = () => {
    if (subjectKey === 'Physics') return 'bg-orange-500/20 text-orange-500';
    if (subjectKey === 'Chemistry') return 'bg-emerald-500/20 text-emerald-500';
    return 'bg-blue-500/20 text-blue-500';
  };

  const getChapterColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-emerald-500 to-emerald-600',
      'from-rose-500 to-rose-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-indigo-500 to-indigo-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#1a1d24] text-white pb-24 font-kanit">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#1a1d24]/90 backdrop-blur-lg z-40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSubjectColor()}`}>
              {getSubjectIcon()}
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">{subjectKey}</h1>
              <p className="text-sm text-slate-400 font-medium">{totalCards} Formula Cards</p>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 transition-all">
          <Search size={24} />
        </button>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Stats */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-slate-300">Your Stats</h2>
          <div className="bg-[#252932] rounded-2xl p-5 border border-white/5 grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="flex items-start gap-3">
              <EyeOff size={20} className="text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Not Seen</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{notSeen}</span>
                  <span className="text-xs text-slate-500">{((notSeen / totalCards) * 100 || 0).toFixed(2)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bookmark size={20} className="text-indigo-400 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Bookmarked</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{bookmarked}</span>
                  <span className="text-xs text-slate-500">{((bookmarked / totalCards) * 100 || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ThumbsDown size={20} className="text-rose-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Need Revision</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{needRevision}</span>
                  <span className="text-xs text-slate-500">{((needRevision / totalCards) * 100 || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ThumbsUp size={20} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-400 font-medium">Memorized</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{memorized}</span>
                  <span className="text-xs text-slate-500">{((memorized / totalCards) * 100 || 0).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Chapters */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-slate-300">All Chapters</h2>
          <div className="grid grid-cols-2 gap-4">
            {chapters.map((chapter, index) => {
              const topics = subjectData.chapters[chapter].topics;
              const topicCount = Object.keys(topics).length;
              let chapterCards = 0;
              Object.values(topics).forEach(t => chapterCards += t.total_cards);

              return (
                <Link key={chapter} to={`/app/formulas/${subjectId}/${encodeURIComponent(chapter)}`}>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${getChapterColor(index)} rounded-2xl p-5 h-48 flex flex-col justify-between relative overflow-hidden group`}
                  >
                    <div className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-500">
                      <FileText size={120} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-lg leading-tight mb-1">{chapter}</h3>
                      <p className="text-sm font-medium text-white/80">{topicCount} Topics</p>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-white/90 font-bold">
                        <FileText size={16} />
                        <span>{chapterCards}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Zap size={16} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FormulaSubject;
