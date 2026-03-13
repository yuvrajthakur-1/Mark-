import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mic, 
  Trophy, 
  ChevronRight, 
  Flame, 
  FileText, 
  Calendar,
  Zap,
  Beaker,
  Calculator,
  ArrowRight,
  Target,
  CheckCircle2,
  Circle,
  Plus,
  X,
  RotateCcw,
  BookOpen,
  PenTool
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Physics');
  
  // Daily Goal State from Context
  const { dailyGoal, setDailyGoal, currentQs, setCurrentQs, dailyPoints, streak, setStreak, user } = useUser();
  
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState(dailyGoal.toString());
  const [wrongQs, setWrongQs] = useState(35); // Start with a few wrong questions to demonstrate
  const [correctQs, setCorrectQs] = useState(85);
  
  // Daily Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Solve 50 Physics PYQs', completed: false },
    { id: 2, title: 'Take a Custom Test', completed: true },
    { id: 3, title: 'Review Mistakes', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const progressPercentage = Math.min(100, Math.max(0, (currentQs / dailyGoal) * 100));
  const isTodayCompleted = currentQs >= dailyGoal;

  useEffect(() => {
    const todayStr = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const lastCompletedDate = localStorage.getItem('lastCompletedDate');
    let currentStreak = parseInt(localStorage.getItem('studyStreak') || '0');

    // Initialize if empty
    if (!localStorage.getItem('studyStreak')) {
      currentStreak = streak;
      localStorage.setItem('studyStreak', currentStreak.toString());
      localStorage.setItem('lastCompletedDate', yesterdayStr);
    }

    if (currentQs >= dailyGoal) {
      if (lastCompletedDate !== todayStr) {
        if (lastCompletedDate === yesterdayStr) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
        localStorage.setItem('lastCompletedDate', todayStr);
        localStorage.setItem('studyStreak', currentStreak.toString());
        setStreak(currentStreak);
      } else {
         if (streak !== currentStreak) {
           setStreak(currentStreak);
         }
      }
    } else {
      if (lastCompletedDate !== todayStr && lastCompletedDate !== yesterdayStr) {
        currentStreak = 0;
        localStorage.setItem('studyStreak', '0');
        setStreak(0);
      } else {
        if (streak !== currentStreak) {
          setStreak(currentStreak);
        }
      }
    }
  }, [currentQs, dailyGoal, setStreak, streak]);

  // Generate last 7 days for streak
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isToday = i === 6;
    
    let isCompleted = false;
    if (isToday) {
      isCompleted = isTodayCompleted;
    } else {
      const daysAgo = 6 - i;
      if (isTodayCompleted) {
        isCompleted = daysAgo < streak;
      } else {
        isCompleted = daysAgo <= streak;
      }
    }

    return {
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' })[0],
      isToday,
      isCompleted
    };
  });

  const handleSaveGoal = () => {
    const parsed = parseInt(newGoalValue);
    if (!isNaN(parsed) && parsed > 0) {
      setDailyGoal(parsed);
    }
    setIsEditingGoal(false);
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskTitle.trim(), completed: false }]);
    setNewTaskTitle('');
  };

  const handleDeleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const exams = [
    { name: 'JEE Main', icon: 'https://www.google.com/favicon.ico' },
    { name: 'JEE Advanced', icon: 'https://www.google.com/favicon.ico' },
    { name: 'BITSAT', icon: 'https://www.google.com/favicon.ico' },
    { name: 'MHT-CET', icon: 'https://www.google.com/favicon.ico' },
    { name: 'NDA', icon: 'https://www.google.com/favicon.ico' },
    { name: 'VITEEE', icon: 'https://www.google.com/favicon.ico' },
    { name: 'WBJEE', icon: 'https://www.google.com/favicon.ico' },
    { name: 'KCET', icon: 'https://www.google.com/favicon.ico' },
    { name: 'NEST', icon: 'https://www.google.com/favicon.ico' },
    { name: 'COMEDK', icon: 'https://www.google.com/favicon.ico' },
  ];

  const chapters = {
    Physics: [
      { title: 'Current Electricity', qs: 39, color: 'from-blue-500 to-blue-600', icon: <Zap size={20} /> },
      { title: 'Semiconductors', qs: 51, color: 'from-emerald-500 to-emerald-600', icon: <Beaker size={20} /> },
      { title: 'Alternating Current', qs: 11, color: 'from-rose-500 to-rose-600', icon: <Zap size={20} /> },
    ],
    Chemistry: [
      { title: 'Organic Chemistry', qs: 45, color: 'from-orange-500 to-orange-600', icon: <Beaker size={20} /> },
      { title: 'Chemical Bonding', qs: 32, color: 'from-purple-500 to-purple-600', icon: <Beaker size={20} /> },
    ],
    Maths: [
      { title: 'Calculus', qs: 60, color: 'from-indigo-500 to-indigo-600', icon: <Calculator size={20} /> },
      { title: 'Algebra', qs: 48, color: 'from-amber-500 to-amber-600', icon: <Calculator size={20} /> },
    ]
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#0f172a]/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-brand p-0.5">
            <img 
              src={`https://picsum.photos/seed/${user?.uid || 'user'}/100/100`}
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm font-medium">Hey, {user?.name || 'Student'}</span>
              <div className="bg-brand/20 text-brand text-[10px] font-bold px-1.5 py-0.5 rounded border border-brand/30 uppercase tracking-wider">
                Premium
              </div>
            </div>
            <h1 className="text-lg font-bold">Ready to practice?</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20">
            <Flame size={16} className="text-orange-500" />
            <span className="text-orange-500 font-bold text-sm">{streak}</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand hover:bg-slate-700 transition-all">
            <Sparkles size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Daily Goal */}
        <section className="bg-slate-800/50 rounded-[2rem] p-6 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                Your Daily Goal
                <button 
                  onClick={() => {
                    setNewGoalValue(dailyGoal.toString());
                    setIsEditingGoal(true);
                  }}
                  className="text-xs text-brand bg-brand/10 px-2 py-1 rounded-md hover:bg-brand/20 transition-colors"
                >
                  Edit
                </button>
              </h2>
              
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="number" 
                    value={newGoalValue}
                    onChange={(e) => setNewGoalValue(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 w-24 text-white font-bold outline-none focus:border-brand"
                    autoFocus
                  />
                  <button onClick={handleSaveGoal} className="bg-brand text-white px-3 py-1 rounded-lg text-sm font-bold">Save</button>
                  <button onClick={() => setIsEditingGoal(false)} className="bg-slate-700 text-white p-1.5 rounded-lg"><X size={16}/></button>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-brand">{currentQs}</span>
                  {currentQs < dailyGoal && (
                    <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">+{dailyGoal - currentQs}</span>
                  )}
                  <span className="text-slate-400 font-bold">/ {dailyGoal} Qs</span>
                </div>
              )}
            </div>
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <Target size={24} />
            </div>
          </div>
          
          <div className="relative h-12 flex items-center justify-between px-2 mb-4">
            <div className="absolute left-0 right-0 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-brand rounded-full relative" 
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
              </motion.div>
            </div>
            
            {[
              { icon: '🚶', label: 'Start', threshold: 0 },
              { icon: '🏃', label: 'Running', threshold: 50 },
              { icon: '🏁', label: 'Finish', threshold: 100 }
            ].map((step, i) => {
              const isActive = progressPercentage >= step.threshold;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.3 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-colors duration-500 ${isActive ? 'bg-brand text-white border-2 border-[#0F172A]' : 'bg-slate-800 border-2 border-slate-600 text-slate-500'}`}
                  >
                    {step.icon}
                  </motion.div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <span className="text-slate-400">Points Earned:</span>
                  <span className="text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded-md">
                    <Zap size={14} className="fill-amber-400" /> {dailyPoints}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Correct: +10 | Wrong: 0 | Re-attempt: +5
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Study Streak</h3>
              <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
                <Flame size={16} className="fill-orange-500" />
                <span className="font-bold">{streak} Days</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {last7Days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    day.isCompleted 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                      : day.isToday
                        ? 'bg-slate-700 border-2 border-orange-500 text-orange-500'
                        : 'bg-slate-800/50 border border-white/5 text-slate-500'
                  }`}>
                    {day.isCompleted ? <Flame size={20} className="fill-white" /> : day.dayName}
                  </div>
                  <span className={`text-[10px] font-bold ${day.isToday ? 'text-orange-500' : 'text-slate-500'}`}>
                    {day.isToday ? 'Today' : day.dayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Tasks */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daily Tasks</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
              {tasks.filter(t => t.completed).length}/{tasks.length} Done
            </span>
          </div>

          <form onSubmit={handleAddTask} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand transition-colors"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="bg-brand text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="space-y-3">
            {tasks.map(task => (
              <motion.div 
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all group ${
                  task.completed 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-500" />
                  ) : (
                    <Circle size={20} className="text-slate-500" />
                  )}
                  <span className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
                <button 
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  className="text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-4">
                No tasks for today. Add one above!
              </div>
            )}
          </div>
        </section>

        {/* PYQ Bank */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Chapter wise PYQ Bank</h2>
            <button className="text-brand text-sm font-bold uppercase tracking-wider">View All</button>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 snap-x">
            <div className="grid grid-rows-2 grid-flow-col gap-4">
              {exams.map((exam, i) => {
                const examId = exam.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/app/exam/${examId}`)}
                    className="w-36 h-24 bg-slate-800/80 rounded-2xl p-4 border border-white/5 flex flex-col justify-between snap-start hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    <img src={exam.icon} alt={exam.name} className="w-6 h-6 rounded" />
                    <span className="text-xs font-bold leading-tight">{exam.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MARKS Tests */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">MARKS Tests</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/app/practice">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-3xl relative overflow-hidden group cursor-pointer h-full"
              >
                <div className="absolute top-3 right-3 bg-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Hot</div>
                <PenTool className="text-white/20 absolute -bottom-4 -right-4" size={80} />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <PenTool size={20} />
                  </div>
                  <h3 className="font-bold leading-tight">Practice MCQs</h3>
                </div>
              </motion.div>
            </Link>

            <Link to="/app/tests" state={{ initialView: 'pyq-home' }}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-3xl relative overflow-hidden group cursor-pointer h-full"
              >
                <div className="absolute top-3 right-3 bg-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">New</div>
                <FileText className="text-white/20 absolute -bottom-4 -right-4" size={80} />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold leading-tight">PYQ Mock Tests</h3>
                </div>
              </motion.div>
            </Link>
            
            <Link to="/app/tests" state={{ initialView: 'create-list' }} className="col-span-2">
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-3xl relative overflow-hidden group cursor-pointer h-full"
              >
                <div className="absolute top-3 right-3 bg-orange-500 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Updated</div>
                <Calendar className="text-white/20 absolute -bottom-4 -right-4" size={80} />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-bold leading-tight">Create Your Own Test</h3>
                </div>
              </motion.div>
            </Link>
          </div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-slate-800 border border-brand/30 rounded-3xl p-5 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <Flame size={24} />
              </div>
              <div>
                <h3 className="font-bold">Solve DPPs</h3>
                <p className="text-xs text-slate-400">554+ aspirants solved DPP in last 1 hr! 🔥</p>
              </div>
            </div>
            <ChevronRight className="text-slate-500 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </section>

        {/* Formula Cards */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Formula Cards</h2>
            <Link to="/app/leaderboard" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand hover:bg-slate-700 transition-all">
              <Trophy size={20} />
            </Link>
          </div>

          <div className="flex bg-slate-800/50 p-1 rounded-2xl mb-6">
            {['Physics', 'Chemistry', 'Maths'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 snap-x">
            <Link to={`/app/formulas/${activeTab}`} className="min-w-[160px] bg-slate-800 rounded-3xl p-5 flex flex-col justify-center items-center h-40 snap-start shadow-lg cursor-pointer border border-brand/30 hover:bg-slate-700 transition-all">
              <div className="w-12 h-12 bg-brand/20 rounded-full flex items-center justify-center text-brand mb-3">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-sm leading-tight text-center">View All<br/>{activeTab} Formulas</h3>
            </Link>
            {(chapters[activeTab as keyof typeof chapters] || []).map((chapter, i) => (
              <Link key={i} to={`/app/formulas/${activeTab}/${encodeURIComponent(chapter.title)}`}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`min-w-[160px] bg-gradient-to-br ${chapter.color} rounded-3xl p-5 flex flex-col justify-between h-40 snap-start shadow-lg cursor-pointer`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {chapter.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-1">{chapter.title}</h3>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">{chapter.qs} Cards</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
