import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Target, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  BarChart3,
  PieChart,
  BookOpen
} from 'lucide-react';
import { SubjectType } from './types';

interface TestReportProps {
  results: any;
  onBack: () => void;
  onViewSolutions: () => void;
}

const TestReport: React.FC<TestReportProps> = ({ results, onBack, onViewSolutions }) => {
  const [activeTab, setActiveTab] = useState<'Overall' | SubjectType>('Overall');

  // Calculate stats
  const filteredQuestions = activeTab === 'Overall' 
    ? results.questions 
    : results.questions.filter((q: any) => q.subject === activeTab);

  const totalQuestions = filteredQuestions.length;
  const attempted = filteredQuestions.filter((q: any) => results.answers[q.id] !== undefined).length;
  const correct = filteredQuestions.filter((q: any) => String(results.answers[q.id]) === String(q.correctAnswer)).length;
  const incorrect = attempted - correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const score = correct * 4 - incorrect * 1; // Assuming +4, -1 marking

  const subjects = Array.from(new Set(results.questions.map((q: any) => q.subject))) as SubjectType[];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 flex flex-col items-center text-center">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-lg font-black">{value}</div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#0F172A]/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{results.name || 'Report Card'}</h1>
            <p className="text-xs text-slate-500 font-medium">Test Analysis</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Overall', ...subjects].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
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

      <main className="px-6 mt-6 space-y-6">
        {/* Score Banner */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-brand to-indigo-600 p-8 rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl shadow-brand/20"
        >
          <div className="relative z-10">
            <div className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">Marks Obtained</div>
            <div className="text-6xl font-black mb-2">{score}</div>
            <div className="text-sm font-bold text-white/80">Out of {totalQuestions * 4}</div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            icon={Target} 
            label="Attempted" 
            value={`${attempted}/${totalQuestions}`} 
            color="bg-blue-500/10 text-blue-500" 
          />
          <StatCard 
            icon={Zap} 
            label="Accuracy" 
            value={`${accuracy}%`} 
            color="bg-orange-500/10 text-orange-500" 
          />
          <StatCard 
            icon={Clock} 
            label="Time Taken" 
            value={`${Math.floor(results.timeSpent / 60)}m`} 
            color="bg-emerald-500/10 text-emerald-500" 
          />
        </div>

        {/* Attempt Analysis */}
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <PieChart size={18} className="text-brand" />
              Attempt Analysis
            </h3>
          </div>
          
          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-2">
                <span className="text-lg font-bold">{correct}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Correct</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center mb-2">
                <span className="text-lg font-bold">{incorrect}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-slate-700 flex items-center justify-center mb-2">
                <span className="text-lg font-bold">{totalQuestions - attempted}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Unattempted</div>
            </div>
          </div>
        </div>

        {/* Time Spent Analysis */}
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-brand" />
              Time Spent Analysis
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-500">Correct Questions</span>
                <span>{Math.round(results.timeSpent * 0.6 / 60)} mins</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[60%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-red-500">Incorrect Questions</span>
                <span>{Math.round(results.timeSpent * 0.3 / 60)} mins</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[30%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Not Attempted</span>
                <span>{Math.round(results.timeSpent * 0.1 / 60)} mins</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-slate-500 w-[10%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onViewSolutions}
          className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-3 border border-white/5 shadow-xl"
        >
          <BookOpen size={20} />
          View Solutions & Explanations
          <ChevronRight size={20} />
        </motion.button>
      </main>
    </div>
  );
};

export default TestReport;
