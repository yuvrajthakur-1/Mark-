import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Filter, ChevronDown, ArrowUpDown, ChevronRight, 
  Edit2, CheckCircle2, Bookmark, BarChart2, AlertCircle,
  BookOpen, Target, Clock, FileText, Video, LayoutGrid, BookMarked,
  History, ListOrdered, Check, FileEdit, AlertTriangle, Home
} from 'lucide-react';
import { syllabusData } from '../data/syllabus';
import { ExamType, SubjectType } from '../components/TestEngine/types';
import { useUser } from '../context/UserContext';
import AnalysisDashboard from './AnalysisDashboard';
import { notebookDB } from '../utils/notebookDB';

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
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Filter States
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  
  const [showClassModal, setShowClassModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  
  // Target Countdown State
  const [targetDate, setTargetDate] = useState<string>(() => {
    return localStorage.getItem(`exam_target_date_${examKey}`) || '2026-04-02';
  });
  const [targetExamName, setTargetExamName] = useState<string>(() => {
    return localStorage.getItem(`exam_target_name_${examKey}`) || `${examKey} 2026`;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [editTargetDate, setEditTargetDate] = useState(targetDate);
  const [editTargetName, setEditTargetName] = useState(targetExamName);
  const [daysLeft, setDaysLeft] = useState(0);
  
  // Interactive state for questions
  const [bookmarkedQs, setBookmarkedQs] = useState<Record<number, boolean>>({});
  const [savedToNotebook, setSavedToNotebook] = useState<Record<number, boolean>>({});
  const { user } = useUser();

  const handleSaveToNotebook = (index: number) => {
    if (savedToNotebook[index]) return;

    notebookDB.addNote({
      email: user?.email || 'student@example.com',
      subject: activeTab !== 'Home' ? activeTab : 'General',
      chapter: activeChapter?.name || 'PYQ',
      title: `PYQ: Q${index + 1}`,
      content: `Question:\nA block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?\n\nCorrect Answer: g tan θ\n\nSolution:\nFor the block to not slip, the pseudo force (ma) must balance the component of weight along the incline.\nma cos θ = mg sin θ\na = g tan θ`
    });

    setSavedToNotebook(prev => ({ ...prev, [index]: true }));
  };

  // Generate mock chapters based on the real syllabus data for the active subject
  const currentChapters = useMemo(() => {
    if (activeTab === 'Home') return [];
    const subjectChapters = examData[activeTab as SubjectType] || [];
    return subjectChapters.map((chapterName, index) => {
      const classLevel = index % 2 === 0 ? '11th' : '12th';
      const unitNum = (index % 5) + 1;
      const totalQs = 50 + (index * 7) % 50;
      const solvedQs = (index * 3) % totalQs;
      const correctQs = Math.floor(solvedQs * (0.4 + (index % 5) * 0.1)); // Random accuracy between 40% and 80%
      const accuracy = solvedQs > 0 ? ((correctQs / solvedQs) * 100).toFixed(2) : '0.00';
      
      const beginnerQs = Math.floor(totalQs * 0.3);
      const targetMainQs = Math.floor(totalQs * 0.5);
      const advanceQs = totalQs - beginnerQs - targetMainQs;
      const mustDoQs = Math.floor(totalQs * 0.4);

      return {
        id: `c${index}`,
        name: chapterName,
        totalQs,
        solvedQs,
        correctQs,
        accuracy,
        beginnerQs,
        targetMainQs,
        advanceQs,
        mustDoQs,
        trend: { year: 2025, count: 10 + (index % 10), up: index % 2 === 0 },
        class: classLevel,
        unit: `Unit ${unitNum}`
      };
    });
  }, [activeTab, examData]);

  const filteredAndSortedChapters = useMemo(() => {
    let result = [...currentChapters];
    
    if (selectedClass) {
      result = result.filter(c => c.class === selectedClass);
    }
    
    if (selectedUnit) {
      result = result.filter(c => c.unit === selectedUnit);
    }
    
    if (sortOrder === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'qs-high') {
      result.sort((a, b) => b.totalQs - a.totalQs);
    } else if (sortOrder === 'qs-low') {
      result.sort((a, b) => a.totalQs - b.totalQs);
    }
    
    return result;
  }, [currentChapters, selectedClass, selectedUnit, sortOrder]);

  useEffect(() => {
    const target = new Date(targetDate + 'T00:00:00');
    const diff = target.getTime() - new Date().getTime();
    setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, [targetDate]);

  const handleSaveTarget = () => {
    setTargetDate(editTargetDate);
    setTargetExamName(editTargetName);
    localStorage.setItem(`exam_target_date_${examKey}`, editTargetDate);
    localStorage.setItem(`exam_target_name_${examKey}`, editTargetName);
    setIsEditingTarget(false);
  };

  const formattedTargetDate = useMemo(() => {
    return new Date(targetDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, [targetDate]);

  const renderDashboard = () => {
    // Calculate overall progress
    let totalSolved = 0;
    let totalQs = 0;
    const subjectProgress: Record<string, { solved: number, total: number }> = {};

    availableSubjects.forEach(subject => {
      const chapters = examData[subject as SubjectType] || [];
      let subjectSolved = 0;
      let subjectTotal = 0;
      chapters.forEach((_, index) => {
        const tQs = 50 + (index * 7) % 50;
        const sQs = (index * 3) % tQs;
        subjectSolved += sQs;
        subjectTotal += tQs;
      });
      subjectProgress[subject] = { solved: subjectSolved, total: subjectTotal };
      totalSolved += subjectSolved;
      totalQs += subjectTotal;
    });

    const overallProgress = totalQs > 0 ? ((totalSolved / totalQs) * 100).toFixed(2) : '0.00';

    return (
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
            <span className="text-4xl font-black text-white">{overallProgress}%</span>
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
            const progress = subjectProgress[subject];
            const percentage = progress.total > 0 ? (progress.solved / progress.total) * 100 : 0;
            return (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className={color.text}>{subject}</span>
                  <span className="text-slate-400">{progress.solved}/{progress.total} PYQ</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${color.bg} rounded-full`} />
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
          <h3 className="text-lg font-bold text-white mb-1">{targetExamName}</h3>
          <div className="flex items-center gap-2 text-sm font-bold text-brand">
            <Clock size={16} />
            {formattedTargetDate}
            <button 
              onClick={() => setIsEditingTarget(true)}
              className="p-1 hover:bg-brand/10 rounded-md transition-colors"
            >
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
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => setView('analysis')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <span className="font-bold text-xs">Analysis</span>
        </button>
        <button 
          onClick={() => setView('bookmarks')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Bookmark size={20} />
          </div>
          <span className="font-bold text-xs">Bookmarks</span>
        </button>
        <button 
          onClick={() => setView('mistakes')}
          className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2 hover:bg-slate-800/60 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <span className="font-bold text-xs">Mistakes</span>
        </button>
      </div>
    </div>
    );
  };

  const renderSubjectContent = () => (
    <div className="space-y-4 pb-24">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        <button 
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap hover:bg-slate-700 transition-colors"
        >
          <Filter size={16} /> Filter
        </button>
        <button 
          onClick={() => setShowClassModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedClass ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
        >
          {selectedClass || 'Class'} <ChevronDown size={16} />
        </button>
        <button 
          onClick={() => setShowUnitModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${selectedUnit ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
        >
          {selectedUnit || `${activeTab} Units`} <ChevronDown size={16} />
        </button>
        <button 
          onClick={() => setShowSortModal(true)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${sortOrder !== 'default' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
        >
          <ArrowUpDown size={16} /> Sort
        </button>
      </div>

      <p className="text-sm font-bold text-slate-400">Showing chapters ({filteredAndSortedChapters.length}/{currentChapters.length})</p>

      <div className="space-y-3">
        {filteredAndSortedChapters.map(chapter => (
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
        {filteredAndSortedChapters.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>No chapters match the selected filters.</p>
            <button 
              onClick={() => { setSelectedClass(null); setSelectedUnit(null); setSortOrder('default'); }}
              className="mt-4 text-brand font-bold hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
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
          <div className="text-2xl font-black text-emerald-500 mb-1">{activeChapter.correctQs}<span className="text-sm text-slate-500">/{activeChapter.solvedQs}</span></div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correct Qs</div>
        </div>
        <div>
          <div className="text-2xl font-black text-brand mb-1">{activeChapter.accuracy}%</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accuracy</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => { setActiveFilter(null); setView('all-questions'); }}
          className="p-4 bg-brand text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-brand/20"
        >
          <Target size={24} />
          Practice MCQ
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
              <div className="text-xs font-bold text-slate-400">{activeChapter.beginnerQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Target Main'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-blue-500 mb-1">Target Main</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.targetMainQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Advance Level'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-rose-500 mb-1">Advance Level</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.advanceQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={() => { setActiveFilter('Must Do'); setView('all-questions'); }}
            className="bg-slate-800/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
          >
            <div>
              <div className="font-bold text-orange-500 mb-1">Must Do</div>
              <div className="text-xs font-bold text-slate-400">{activeChapter.mustDoQs} Qs</div>
            </div>
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'dashboard' || view === 'chapter-detail' || view === 'all-questions' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setShowCreateTestModal(true)}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative ${showCreateTestModal ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="absolute -top-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</div>
          <FileEdit size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Create Test</span>
        </button>
        <button 
          onClick={() => setView('analysis')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'analysis' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BarChart2 size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Analysis</span>
        </button>
        <button 
          onClick={() => setView('bookmarks')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${view === 'bookmarks' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookMarked size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Bookmarks</span>
        </button>
        <button 
          onClick={() => setView('mistakes')}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all relative ${view === 'mistakes' ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="absolute -top-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</div>
          <AlertTriangle size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">My Mistakes</span>
        </button>
      </div>
    </div>
  );

  const renderAllQuestions = () => {
    const isTopicOrAll = activeFilter === 'Topic Wise' || !activeFilter;
    
    let title = 'Practice MCQ';
    let subtitle = activeChapter.name;
    let questionCount = activeChapter.totalQs;

    if (activeFilter === 'Beginner') {
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

    if (isTopicOrAll) {
      if (selectedTopic) {
        const topicQsCount = selectedTopic === 'Units' ? Math.floor(activeChapter.totalQs * 0.3) : Math.floor(activeChapter.totalQs * 0.7);
        return (
          <div className="space-y-4 pb-24">
            <div className="space-y-6">
              <header className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-slate-400"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">{selectedTopic}</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                    {examKey} » {topicQsCount} PYQs
                  </p>
                </div>
              </header>

              <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-4">
                <span>{topicQsCount} Questions</span>
                <button className="flex items-center gap-1 text-brand">
                  <ArrowUpDown size={14} /> New to Old
                </button>
              </div>

              {Array.from({ length: Math.min(10, topicQsCount) }).map((_, i) => {
                const isBookmarked = bookmarkedQs[i];

                return (
                  <div 
                    key={i} 
                    className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/app/practice', { state: { questionIndex: i } })}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {i % 3 === 0 && <Video size={16} className="text-brand" />}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                          <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-200 leading-relaxed">
                      A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                    </p>
                  </div>
                );
              })}
            </div>
            <DashboardBottomNav />
          </div>
        );
      }

      return (
        <div className="space-y-4 pb-24">
          <header className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('chapter-detail')} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">{activeChapter.name}</h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {examKey} » {activeChapter.totalQs} PYQs | 2 Topics
              </p>
            </div>
          </header>

          <div className="flex border-b border-white/10 mb-6">
            <button 
              onClick={() => { setActiveFilter(null); setSelectedTopic(null); }}
              className={`flex-1 pb-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${!activeFilter ? 'text-brand border-b-2 border-brand' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <History size={18} />
              All PYQs
            </button>
            <button 
              onClick={() => { setActiveFilter('Topic Wise'); setSelectedTopic(null); }}
              className={`flex-1 pb-3 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeFilter === 'Topic Wise' ? 'text-brand border-b-2 border-brand' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <ListOrdered size={18} />
              Topic-Wise PYQs
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand bg-brand/10 text-brand text-sm font-medium whitespace-nowrap">
              As per syllabus <Check size={16} />
            </button>
            <button className="px-4 py-2 rounded-full border border-white/10 text-slate-300 text-sm font-medium whitespace-nowrap hover:bg-white/5">
              Removed
            </button>
            <button className="px-4 py-2 rounded-full border border-white/10 text-slate-300 text-sm font-medium whitespace-nowrap hover:bg-white/5">
              Reduced
            </button>
          </div>

          {activeFilter === 'Topic Wise' ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedTopic('Units')}
                className="w-full bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-lg mb-1">Units</div>
                  <div className="text-sm text-slate-400">{Math.floor(activeChapter.totalQs * 0.3)} Questions</div>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </button>
              
              <button 
                onClick={() => setSelectedTopic('Dimensions')}
                className="w-full bg-slate-800/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-lg mb-1">Dimensions</div>
                  <div className="text-sm text-slate-400 flex items-center gap-3">
                    {Math.floor(activeChapter.totalQs * 0.7)} Questions
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/50 text-rose-400 bg-rose-500/10">MUST DO</span>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from({ length: Math.min(10, questionCount) }).map((_, i) => {
                const isBookmarked = bookmarkedQs[i];

                return (
                  <div 
                    key={i} 
                    className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/app/practice', { state: { questionIndex: i } })}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {i % 3 === 0 && <Video size={16} className="text-brand" />}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                        >
                          <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-200 leading-relaxed">
                      A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <DashboardBottomNav />
        </div>
      );
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

      <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-4">
        <span>{questionCount} Questions</span>
        <button className="flex items-center gap-1 text-brand">
          <ArrowUpDown size={14} /> New to Old
        </button>
      </div>

      <div className="space-y-6">
        {Array.from({ length: Math.min(10, questionCount) }).map((_, i) => {
          const isBookmarked = bookmarkedQs[i];

          return (
            <div 
              key={i} 
              className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              onClick={() => navigate('/app/practice', { state: { questionIndex: i } })}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                </div>
                <div className="flex items-center gap-3">
                  {i % 3 === 0 && <Video size={16} className="text-brand" />}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-200 leading-relaxed">
                A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
              </p>
            </div>
          );
        })}
      </div>

        <DashboardBottomNav />
      </div>
    );
  };

  const renderAnalysis = () => (
    <div className="pb-24">
      <AnalysisDashboard onBack={() => setView('dashboard')} />
      <DashboardBottomNav />
    </div>
  );

  const renderBookmarks = () => {
    const bookmarkedIndices = Object.keys(bookmarkedQs).filter(key => bookmarkedQs[Number(key)]).map(Number);
    
    return (
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
        
        {bookmarkedIndices.length === 0 ? (
          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
            <div className="flex flex-col items-center justify-center h-40 text-slate-500 font-bold gap-4">
              <Bookmark size={48} className="opacity-20" />
              <p>No bookmarks yet</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarkedIndices.map((i) => {
              const isBookmarked = bookmarkedQs[i];

              return (
                <div 
                  key={i} 
                  className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate('/app/practice', { state: { questionIndex: i } })}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm">Q{i+1}</span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-white/5">2025 • Shift 1</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {i % 3 === 0 && <Video size={16} className="text-brand" />}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookmarkedQs(prev => ({ ...prev, [i]: !prev[i] }));
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-200 leading-relaxed">
                    A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <DashboardBottomNav />
      </div>
    );
  };

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
      <DashboardBottomNav />
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
                  2025 - 2012 | 39 Papers | {
                    availableSubjects.reduce((acc, subject) => {
                      const chapters = examData[subject as SubjectType] || [];
                      return acc + chapters.reduce((subAcc, _, index) => subAcc + (50 + (index * 7) % 50), 0);
                    }, 0)
                  } Qs
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

      {/* Target Edit Modal */}
      <AnimatePresence>
        {isEditingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Target</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Exam Name</label>
                  <input 
                    type="text" 
                    value={editTargetName}
                    onChange={(e) => setEditTargetName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Date</label>
                  <input 
                    type="date" 
                    value={editTargetDate}
                    onChange={(e) => setEditTargetDate(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditingTarget(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-brand hover:bg-brand-light shadow-lg shadow-brand/20 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Class Filter Modal */}
      <AnimatePresence>
        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowClassModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Select Class</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSelectedClass(null); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === null ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  All Classes
                </button>
                <button 
                  onClick={() => { setSelectedClass('11th'); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === '11th' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Class 11th
                </button>
                <button 
                  onClick={() => { setSelectedClass('12th'); setShowClassModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedClass === '12th' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Class 12th
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unit Filter Modal */}
      <AnimatePresence>
        {showUnitModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowUnitModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[70vh] flex flex-col"
            >
              <h3 className="text-lg font-bold text-white mb-4">Select {activeTab} Unit</h3>
              <div className="space-y-2 overflow-y-auto pr-2">
                <button 
                  onClick={() => { setSelectedUnit(null); setShowUnitModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedUnit === null ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  All Units
                </button>
                {[1, 2, 3, 4, 5].map(unitNum => (
                  <button 
                    key={unitNum}
                    onClick={() => { setSelectedUnit(`Unit ${unitNum}`); setShowUnitModal(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${selectedUnit === `Unit ${unitNum}` ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                  >
                    Unit {unitNum}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sort Modal */}
      <AnimatePresence>
        {showSortModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSortModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Sort Chapters</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setSortOrder('default'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'default' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Default Order
                </button>
                <button 
                  onClick={() => { setSortOrder('name-asc'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'name-asc' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Name (A-Z)
                </button>
                <button 
                  onClick={() => { setSortOrder('name-desc'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'name-desc' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Name (Z-A)
                </button>
                <button 
                  onClick={() => { setSortOrder('qs-high'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'qs-high' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Questions (High to Low)
                </button>
                <button 
                  onClick={() => { setSortOrder('qs-low'); setShowSortModal(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${sortOrder === 'qs-low' ? 'bg-brand/20 text-brand' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  Questions (Low to High)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comprehensive Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowFilterModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button 
                  onClick={() => {
                    setSelectedClass(null);
                    setSelectedUnit(null);
                    setSortOrder('default');
                  }}
                  className="text-sm font-bold text-brand hover:underline"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-6 overflow-y-auto pr-2 pb-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Class</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedClass(selectedClass === '11th' ? null : '11th')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${selectedClass === '11th' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      11th
                    </button>
                    <button 
                      onClick={() => setSelectedClass(selectedClass === '12th' ? null : '12th')}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors border ${selectedClass === '12th' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      12th
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Unit</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5].map(unitNum => (
                      <button 
                        key={unitNum}
                        onClick={() => setSelectedUnit(selectedUnit === `Unit ${unitNum}` ? null : `Unit ${unitNum}`)}
                        className={`py-2.5 rounded-xl font-bold text-sm transition-colors border ${selectedUnit === `Unit ${unitNum}` ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Unit {unitNum}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Sort By</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setSortOrder('default')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${sortOrder === 'default' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      Default Order
                    </button>
                    <button 
                      onClick={() => setSortOrder('qs-high')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors border ${sortOrder === 'qs-high' ? 'bg-brand/20 border-brand text-brand' : 'bg-slate-800 border-white/5 text-slate-300 hover:bg-slate-700'}`}
                    >
                      Questions (High to Low)
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full py-3.5 mt-4 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-light transition-colors"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Create Test Modal */}
      <AnimatePresence>
        {showCreateTestModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateTestModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-4">
                <FileEdit size={32} className="text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create Custom Test</h3>
              <p className="text-sm text-slate-400 mb-6">
                This feature is coming soon! You will be able to create custom tests from your bookmarked questions and mistakes.
              </p>
              <button
                onClick={() => setShowCreateTestModal(false)}
                className="w-full py-3.5 bg-brand text-white rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand-light transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
