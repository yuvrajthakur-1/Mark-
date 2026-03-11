import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Target, BarChart2, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { 
  getTestReports, 
  overallStats, 
  subjectStats, 
  chapterStats, 
  weakChapters, 
  timeAnalysis, 
  accuracyTrend,
  TestReport
} from '../utils/analysis';

interface AnalysisDashboardProps {
  onBack: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ onBack }) => {
  const [reports, setReports] = useState<TestReport[]>([]);

  useEffect(() => {
    setReports(getTestReports());
  }, []);

  const overall = overallStats(reports);
  const subjects = subjectStats(reports);
  const chapters = chapterStats(reports);
  const weak = weakChapters(chapters);
  const avgTime = timeAnalysis(reports);
  const trend = accuracyTrend(reports);

  if (reports.length === 0) {
    return (
      <div className="space-y-6 pb-24">
        <header className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Detailed Analysis</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Performance</p>
          </div>
        </header>
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 text-center">
          <BarChart2 size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-300 mb-2">No Test Data Yet</h3>
          <p className="text-sm text-slate-500">Complete a test to see your performance analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Detailed Analysis</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Performance</p>
        </div>
      </header>

      {/* Overall Performance */}
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Target size={20} className="text-brand" />
          Overall Performance
        </h2>
        <div className="flex items-end gap-2 mb-6">
          <span className="text-4xl font-black text-white">{overall.accuracy}%</span>
          <span className="text-sm font-bold text-slate-400 mb-1">Accuracy</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
            <div className="text-2xl font-bold text-emerald-500">{overall.correct}</div>
            <div className="text-xs font-bold text-emerald-500/70 uppercase tracking-wider">Correct</div>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
            <div className="text-2xl font-bold text-rose-500">{overall.wrong}</div>
            <div className="text-xs font-bold text-rose-500/70 uppercase tracking-wider">Wrong</div>
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Avg Time per Test</h3>
            <p className="text-xs text-slate-400">Time efficiency</p>
          </div>
        </div>
        <div className="text-xl font-bold text-white">
          {Math.round(avgTime / 60)} <span className="text-sm text-slate-400">min</span>
        </div>
      </div>

      {/* Subject Analysis */}
      <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
        <h2 className="text-lg font-bold mb-4">Subject Analysis</h2>
        <div className="space-y-4">
          {Object.entries(subjects).map(([subject, data]) => {
            const acc = data.total > 0 ? (data.correct / data.total) * 100 : 0;
            return (
              <div key={subject}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>{subject}</span>
                  <span className="text-brand">{acc.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${acc}%` }} 
                    className="h-full bg-brand rounded-full" 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Chapters */}
      {weak.length > 0 && (
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-500">
            <AlertTriangle size={20} />
            Weak Chapters
          </h2>
          <div className="space-y-3">
            {weak.map((w, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-white/5">
                <span className="font-medium text-sm">{w.chapter}</span>
                <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">
                  {w.accuracy}% Acc
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy Trend */}
      {trend.length > 1 && (
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-white/5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand" />
            Accuracy Trend
          </h2>
          <div className="h-40 flex items-end gap-2 pt-4">
            {trend.slice(-10).map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-800 rounded-t-sm relative flex-1 flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${t.accuracy}%` }}
                    className="w-full bg-brand rounded-t-sm"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-500">T{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
