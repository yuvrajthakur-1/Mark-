import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Filter, ChevronDown, ArrowUpDown, ChevronRight, 
  Edit2, CheckCircle2, Bookmark, BarChart2, AlertCircle,
  BookOpen, Target, Clock, FileText, Video, LayoutGrid
} from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { ExamType, SubjectType } from '../components/TestEngine/types';
import { useUser } from '../context/UserContext';

export default function ExamDashboard() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { setPointsEarned, setCurrentQs } = useUser();
  
  // Find the matching exam type from syllabusData
  const examKey = useMemo(() => {
    if (!examId) return 'JEE Main' as ExamType;
    const normalizedId = examId.toLowerCase().replace(/-/g, '');
    const found = Object.keys(syllabusData).find(
      key => key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedId
    );
    return (found as ExamType) || 'JEE Main';
  }, [examId]);

  const examData = syllabusData[examKey];
  const availableSubjects = Object.keys(examData) as SubjectType[];
  
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'chapter-detail' | 'all-questions' | 'analysis' | 'bookmarks' | 'mistakes' | 'filters'>('dashboard');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(0);
  
  // Interactive state for questions
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({});
  const [bookmarkedQs, setBookmarkedQs] = useState<Record<number, boolean>>({});

  // Generate mock chapters based on the real syllabus data for the active subject
  const currentChapters = useMemo(() => {
    if (activeTab === 'Home') return [];
    const subjectChapters = examData[activeTab as SubjectType] || [];
    return subjectChapters.map((chapterName, index) => ({
      id: `c${index}`,
      name: chapterName,
      totalQs: Math.floor(Math.random() * 100) + 50,
      solvedQs: Math.floor(Math.random() * 50),
      trend: { year: 2025, count: Math.floor(Math.random() * 20) + 10, up: Math.random() > 0.5 }
    }));
  }, [activeTab, examData]);

  useEffect(() => {
    const targetDate = new Date('2026-04-02T00:00:00');
    const diff = targetDate.getTime() - new Date().getTime();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
      {/* Progress Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <button className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
            Last 1 Year PYQ <ChevronDown size={14} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Progress</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">14.74%</span>
          </div>
        </div>

        <div className="space-y-4">
          {availableSubjects.slice(0, 3).map((subject, index) => {
            const colors = [
              { text: 'text-orange-500', bg: 'bg-orange-500' },
              { text: 'text-emerald-500', bg: 'bg-emerald-500' },
              { text: 'text-blue-500', bg: 'bg-blue-500' }
            ];
            const color = colors[index % colors.length];
            return (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className={color.text}>{subject}</span>
                  <span className="text-slate-400">77/475 PYQ</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.random() * 20 + 5}%` }} className={`h-full ${color.bg} rounded-full`} />
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
          View Detailed Analysis <ChevronRight size={16} />
        </button>
      </div>

      {/* Countdown Card */}
      <div className="bg-slate-800/40 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{examKey} 2026</h3>
          <div className="flex items-center gap-2 text-sm font-bold text-brand">
            <Clock size={16} />
            2 Apr 2026
            <button className="p-1 hover:bg-brand/10 rounded-md transition-colors">
              <Edit2 size={12} />
            </button>
          </div>
        </div>
        <div className="bg-brand/10 border border-brand/20 px-4 py-3 rounded-2xl text-center">
          <div className="text-2xl font-black text-brand leading-none mb-1">{daysLeft}</div>
          <div className="text-[10px] font-bold text-brand uppercase tracking-wider">Days Left</div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setView('analysis')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <span className="font-bold text-sm">Analysis</span>
        </button>
        <button 
          onClick={() => setView('bookmarks')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Bookmark size={20} />
          </div>
          <span className="font-bold text-sm">Bookmarks</span>
        </button>
        <button 
          onClick={() => setView('mistakes')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <span className="font-bold text-sm">Mistakes</span>
        </button>
        <button 
          onClick={() => setView('filters')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-3 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Filter size={20} />
          </div>
          <span className="font-bold text-sm">Filters</span>
        </button>
      </div>
    </div>
  );

  const renderSubjectContent = () => (
    <div className="space-y-4 pb-24">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          <Filter size={16} /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          Class <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          {activeTab} Units <ChevronDown size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>

      <p className="text-sm font-bold text-slate-400">Showing chapters ({currentChapters.length}/{currentChapters.length})</p>

      <div className="space-y-3">
        {currentChapters.map(chapter => (
          <motion.button
            key={chapter.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setActiveChapter(chapter); setView('chapter-detail'); }}
            className="w-full bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4 text-left hover:bg-slate-800/60 transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === 'Physics' ? 'bg-orange-500/10 text-orange-500' :
              activeTab === 'Chemistry' ? 'bg-emerald-500/10 text-emerald-500' :
              activeTab === 'Biology' ? 'bg-rose-500/10 text-rose-500' :
              'bg-blue-500/10 text-blue-500'
            }`}>
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1 line-clamp-1">{chapter.name}</h4>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-slate-400">{chapter.solvedQs}/{chapter.totalQs} Qs</span>
                <div className="w-1 h-1 rounded-full bg-slate-600" />
                <span className={`flex items-center gap-1 ${chapter.trend.up ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {chapter.trend.year}: {chapter.trend.count} Qs {chapter.trend.up ? '↑' : ''}
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-500" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderChapterDetail = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{activeChapter.name}</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{examKey} » {activeChapter.totalQs} PYQs | 2 Topics</p>
        </div>
      </header>

      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-black text-white mb-1">{activeChapter.solvedQs}<span className="text-sm text-slate-500">/{activeChapter.totalQs}</span></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PYQ Solved</div>
        </div>
        <div>
          <div className="text-2xl font-black text-emerald-500 mb-1">30<span className="text-sm text-slate-500">/{activeChapter.solvedQs}</span></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correct Qs</div>
        </div>
        <div>
          <div className="text-2xl font-black text-brand mb-1">43.48%</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accuracy</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => { setActiveFilter(null); setView('all-questions'); }}
          className="p-4 bg-brand text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-brand/20"
        >
          <Target size={24} />
          All Previous Year Qs
          <span className="text-xs font-medium opacity-80">{activeChapter.totalQs} PYQs</span>
        </button>
        <button 
          onClick={() => { setActiveFilter('Topic Wise'); setView('all-questions'); }}
          className="p-4 bg-slate-800 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 border border-white/5 hover:bg-slate-700 transition-colors"
        >
          <LayoutGrid size={24} />
          Topic Wise PYQs
          <span className="text-xs font-medium text-slate-400">2 Topics</span>
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Difficulty Buckets</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { setActiveFilter('Beginner'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-emerald-500 mb-1">Beginner</div>
              <div className="text-xs font-bold text-slate-400">23 Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Target Main'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-blue-500 mb-1">Target Main</div>
              <div className="text-xs font-bold text-slate-400">50 Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Advance Level'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-rose-500 mb-1">Advance Level</div>
              <div className="text-xs font-bold text-slate-400">12 Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Must Do'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-orange-500 mb-1">Must Do</div>
              <div className="text-xs font-bold text-slate-400">50 Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAllQuestions = () => {
    let title = 'All PYQs';
    let subtitle = activeChapter.name;
    let questionCount = activeChapter.totalQs;

    if (activeFilter === 'Topic Wise') {
      title = 'Topic Wise PYQs';
      subtitle = '2 Topics Available';
    } else if (activeFilter === 'Beginner') {
      title = 'Beginner Level';
      questionCount = 23;
    } else if (activeFilter === 'Target Main') {
      title = 'Target Main';
      questionCount = 50;
    } else if (activeFilter === 'Advance Level') {
      title = 'Advance Level';
      questionCount = 12;
    } else if (activeFilter === 'Must Do') {
      title = 'Must Do';
      questionCount = 50;
    }

    return (
    <div className="space-y-4 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('chapter-detail')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{subtitle}</p>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5 min-w-max">
          <button 
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg ${!activeFilter ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
          >
            All PYQs
          </button>
          <button 
            onClick={() => setActiveFilter('Topic Wise')}
            className={`px-4 py-1.5 text-sm font-bold rounded-lg ${activeFilter === 'Topic Wise' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
          >
            Topic Wise
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          <Filter size={16} /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          <Video size={16} /> Video Sol
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
          Years <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-4">
        <span>{questionCount} Questions</span>
        <button className="flex items-center gap-1 text-brand">
          <ArrowUpDown size={14} /> New to Old
        </button>
      </div>

      <div className="space-y-6">
        {Array.from({ length: Math.min(10, questionCount) }).map((_, i) => {
          const isAnswered = selectedAnswers[i] !== undefined;
          const isCorrect = selectedAnswers[i] === 'B'; // Mock correct answer is B
          const showSol = showSolutions[i];
          const isBookmarked = bookmarkedQs[i];

          return (
            <div key={i} className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                </div>
                <div className="flex items-center gap-3">
                  {i % 3 === 0 && <Video size={16} className="text-brand" />}
                  <button 
                    onClick={() => setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }))}
                    className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed mb-6">
                A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
              </p>

              <div className="space-y-3 mb-6">
                {['g sin θ', 'g tan θ', 'g cos θ', 'g cot θ'].map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = selectedAnswers[i] === letter;
                  const isCorrectOption = letter === 'B';
                  
                  let btnClass = "w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ";
                  
                  if (isAnswered) {
                    if (isCorrectOption) {
                      btnClass += "bg-emerald-500/20 border-emerald-500/50 text-emerald-500";
                    } else if (isSelected) {
                      btnClass += "bg-rose-500/20 border-rose-500/50 text-rose-500";
                    } else {
                      btnClass += "bg-slate-800/50 border-white/5 text-slate-400 opacity-50";
                    }
                  } else {
                    btnClass += "bg-slate-800/50 border-white/5 text-slate-300 hover:bg-slate-700 hover:border-white/10";
                  }

                  return (
                    <button 
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedAnswers(prev => ({ ...prev, [i]: letter }));
                        setCurrentQs(prev => prev + 1);
                        if (isCorrectOption) {
                          setPointsEarned(prev => prev + 10);
                        }
                      }}
                      className={btnClass}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isAnswered && isCorrectOption ? 'bg-emerald-500/20 text-emerald-500' :
                        isAnswered && isSelected ? 'bg-rose-500/20 text-rose-500' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {letter}
                      </span>
                      <span className="font-medium">{opt}</span>
                      {isAnswered && isCorrectOption && <CheckCircle2 size={20} className="ml-auto text-emerald-500" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="pt-4 border-t border-white/5">
                  <button 
                    onClick={() => setShowSolutions(prev => ({ ...prev, [i]: !prev[i] }))}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {showSol ? 'Hide Solution' : 'View Solution'}
                  </button>
                  
                  <AnimatePresence>
                    {showSol && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-5 bg-slate-900 rounded-xl border border-white/5">
                          <h4 className="font-bold text-emerald-500 mb-2 flex items-center gap-2">
                            <CheckCircle2 size={16} /> Correct Answer: B
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            For the block to not slip, the pseudo force (ma) must balance the component of weight along the incline.
                            <br/><br/>
                            ma cos θ = mg sin θ<br/>
                            a = g tan θ
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    );
  };

  const renderAnalysis = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Detailed Analysis</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{examKey} Performance</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          Analysis charts will appear here
        </div>
      </div>
    </div>
  );

  const renderBookmarks = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Bookmarks</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Saved Questions</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          {Object.keys(bookmarkedQs).length > 0 ? `${Object.keys(bookmarkedQs).length} Bookmarked Questions` : 'No bookmarks yet'}
        </div>
      </div>
    </div>
  );

  const renderMistakes = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Mistakes</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Questions to review</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          Mistakes list will appear here
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Filters</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Customize your view</p>
        </div>
      </header>
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-center h-40 text-slate-500 font-bold">
          Filter options will appear here
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-kanit">
      {view === 'dashboard' && (
        <>
          <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#0F172A]/90 backdrop-blur-lg z-40 border-b border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => navigate('/app')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold">{examKey}</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  2025 - 2012 | 39 Papers | 17250 Qs
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setActiveTab('Home')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                  activeTab === 'Home' 
                    ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' 
                    : 'bg-slate-800 border-white/5 text-slate-500'
                }`}
              >
                Home
              </button>
              {availableSubjects.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    activeTab === tab 
                      ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' 
                      : 'bg-slate-800 border-white/5 text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          <main className="px-6 mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {activeTab === 'Home' ? renderDashboard() : renderSubjectContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}

      {view === 'chapter-detail' && (
        <main className="px-6 pt-8">
          {renderChapterDetail()}
        </main>
      )}

      {view === 'all-questions' && (
        <main className="px-6 pt-8">
          {renderAllQuestions()}
        </main>
      )}

      {view === 'analysis' && (
        <main className="px-6 pt-8">
          {renderAnalysis()}
        </main>
      )}

      {view === 'bookmarks' && (
        <main className="px-6 pt-8">
          {renderBookmarks()}
        </main>
      )}

      {view === 'mistakes' && (
        <main className="px-6 pt-8">
          {renderMistakes()}
        </main>
      )}

      {view === 'filters' && (
        <main className="px-6 pt-8">
          {renderFilters()}
        </main>
      )}

      {/* Bottom Navigation (Only inside Exam section) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/5 px-6 py-4 flex justify-between items-center z-50">
        <button onClick={() => navigate('/app/tests', { state: { initialView: 'create-list' } })} className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand transition-colors">
          <FileText size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Create Test</span>
        </button>
        <button onClick={() => setView('analysis')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'analysis' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <BarChart2 size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button onClick={() => setView('bookmarks')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'bookmarks' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <Bookmark size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bookmarks</span>
        </button>
        <button onClick={() => setView('mistakes')} className={`flex flex-col items-center gap-1 transition-colors ${view === 'mistakes' ? 'text-brand' : 'text-slate-400 hover:text-brand'}`}>
          <AlertCircle size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Mistakes</span>
        </button>
      </div>
    </div>
  );
}
