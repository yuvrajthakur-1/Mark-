import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Filter, Play, BarChart2, Clock, FileText } from 'lucide-react';
import { CustomTest } from './types';

interface CreateTestListProps {
  tests: CustomTest[];
  onBack: () => void;
  onCreateNew: () => void;
  onAttemptTest: (test: CustomTest) => void;
  onViewAnalysis: (test: CustomTest) => void;
}

const CreateTestList: React.FC<CreateTestListProps> = ({ tests, onBack, onCreateNew, onAttemptTest, onViewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Attempted' | 'Not Attempted'>('All');

  const filteredTests = tests.filter(test => {
    if (activeTab === 'All') return true;
    return test.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-32">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 sticky top-0 bg-[#0F172A]/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Create Your Own Test</h1>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">
            <span className="text-brand font-bold">{tests.length}</span> Tests Generated
          </p>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-300 bg-slate-800 px-4 py-2 rounded-full border border-white/5">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl border border-white/5">
          {['All', 'Attempted', 'Not Attempted'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 mt-6 space-y-4">
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/40 p-5 rounded-[2rem] border border-white/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded-md uppercase">
                      {test.exam}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{test.name}</h3>
                </div>
                {test.status === 'Attempted' && (
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-500">{test.score}/{test.totalMarks}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Score</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <FileText size={14} className="text-slate-500" />
                  {test.questionCount} Questions
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-500" />
                  {test.duration} Mins
                </div>
              </div>

              <div className="flex gap-3">
                {test.status === 'Attempted' ? (
                  <>
                    <button 
                      onClick={() => onViewAnalysis(test)}
                      className="flex-1 py-3 bg-slate-700/50 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
                    >
                      <BarChart2 size={18} />
                      View Analysis
                    </button>
                    <button 
                      onClick={() => onAttemptTest(test)}
                      className="flex-1 py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                    >
                      <Play size={18} fill="white" />
                      Retake Test
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => onAttemptTest(test)}
                    className="w-full py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
                  >
                    <Play size={18} fill="white" />
                    Resume Test
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-300">No tests found</h3>
            <p className="text-sm text-slate-500">Create your first custom test to get started</p>
          </div>
        )}
      </main>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCreateNew}
          className="w-full py-4 bg-brand text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand/30"
        >
          <Plus size={24} />
          Create new custom test
        </motion.button>
      </div>
    </div>
  );
};

export default CreateTestList;
