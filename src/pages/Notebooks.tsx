import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookMarked, Plus, Folder, FileText, MoreVertical, 
  ArrowLeft, Bookmark, AlertCircle, Filter, Trash2, 
  CheckCircle2, X, ChevronRight, Search
} from 'lucide-react';

// Mock Data
const initialNotebooks = [
  { id: '1', title: 'Physics Tough Qs', count: 12, color: 'bg-orange-500' },
  { id: '2', title: 'Organic Reactions', count: 8, color: 'bg-emerald-500' },
  { id: '3', title: 'Maths Shortcuts', count: 15, color: 'bg-blue-500' },
  { id: '4', title: 'Mock Test Errors', count: 5, color: 'bg-rose-500' },
];

const mockQuestions = [
  {
    id: 'q1',
    text: 'A block of mass m is placed on a smooth inclined plane of inclination θ. The inclined plane is accelerated horizontally so that the block does not slip. What is the acceleration?',
    exam: 'JEE Main',
    year: '2024',
    shift: 'Shift 1',
    subject: 'Physics',
    chapter: 'Laws of Motion',
    type: 'bookmark'
  },
  {
    id: 'q2',
    text: 'Find the number of integral values of k for which the equation x^2 - 2(k-1)x + (2k+1) = 0 has both roots positive.',
    exam: 'JEE Main',
    year: '2023',
    shift: 'Shift 2',
    subject: 'Maths',
    chapter: 'Quadratic Equations',
    type: 'mistake'
  },
  {
    id: 'q3',
    text: 'Which of the following compounds will show the highest dipole moment?',
    exam: 'NEET',
    year: '2023',
    shift: '',
    subject: 'Chemistry',
    chapter: 'Chemical Bonding',
    type: 'notebook',
    notebookId: '2'
  }
];

const Notebooks = () => {
  const [activeTab, setActiveTab] = useState<'notebooks' | 'bookmarks' | 'mistakes'>('notebooks');
  const [activeNotebook, setActiveNotebook] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [notebooks, setNotebooks] = useState(initialNotebooks);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateNotebook = () => {
    if (!newNotebookName.trim()) return;
    const colors = ['bg-blue-500', 'bg-orange-500', 'bg-emerald-500', 'bg-rose-500', 'bg-purple-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setNotebooks([
      {
        id: Date.now().toString(),
        title: newNotebookName,
        count: 0,
        color: randomColor
      },
      ...notebooks
    ]);
    setNewNotebookName('');
    setShowCreateModal(false);
  };

  const renderQuestionCard = (q: any) => (
    <div key={q.id} className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-300 bg-slate-700 px-2 py-1 rounded border border-white/5 uppercase tracking-wider">
            {q.exam} {q.year} {q.shift && `• ${q.shift}`}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${
            q.subject === 'Physics' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
            q.subject === 'Chemistry' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
            'bg-blue-500/10 text-blue-500 border-blue-500/20'
          }`}>
            {q.subject}
          </span>
        </div>
        <button className="text-slate-500 hover:text-rose-500 transition-colors p-1">
          <Trash2 size={16} />
        </button>
      </div>
      
      <p className="text-sm text-slate-200 leading-relaxed">
        {q.text}
      </p>
      
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-xs font-medium text-slate-500">{q.chapter}</span>
        <button className="text-xs font-bold text-brand hover:text-brand/80 transition-colors">
          View Solution →
        </button>
      </div>
    </div>
  );

  const renderNotebooksGrid = () => (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Search notebooks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-brand transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-brand/10 p-5 rounded-3xl border border-brand/20 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-brand/20 transition-all border-dashed"
        >
          <div className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/20 mb-3">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm text-brand">New Notebook</span>
        </motion.div>

        {notebooks.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map((nb) => (
          <motion.div
            key={nb.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveNotebook(nb)}
            className="bg-slate-800/50 p-5 rounded-3xl border border-white/5 flex flex-col justify-between h-40 cursor-pointer hover:bg-slate-700 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} className="text-slate-400 hover:text-white" />
            </div>
            <div className={`w-10 h-10 ${nb.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <Folder size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{nb.title}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{nb.count} Questions</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderQuestionsList = (type: string) => {
    const filteredQs = mockQuestions.filter(q => 
      type === 'notebook' ? q.notebookId === activeNotebook?.id : q.type === type
    );

    return (
      <div className="space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
            Subject <ChevronRight size={16} className="rotate-90" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/5 rounded-xl text-sm font-bold text-slate-300 whitespace-nowrap">
            Chapter <ChevronRight size={16} className="rotate-90" />
          </button>
        </div>

        {filteredQs.length > 0 ? (
          <div className="space-y-4">
            {filteredQs.map(renderQuestionCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-1">No questions found</h3>
            <p className="text-sm text-slate-500">You haven't added any questions here yet.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <AnimatePresence mode="wait">
        {activeNotebook ? (
          <motion.div
            key="notebook-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-[#0f172a]"
          >
            <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-[#0f172a]/80 backdrop-blur-lg z-40 border-b border-white/5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveNotebook(null)}
                  className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-xl font-bold">{activeNotebook.title}</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{activeNotebook.count} Questions</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </header>
            <main className="px-6 pt-6">
              {renderQuestionsList('notebook')}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <header className="px-6 pt-12 pb-4 sticky top-0 bg-[#0f172a]/80 backdrop-blur-lg z-40 border-b border-white/5">
              <h1 className="text-2xl font-bold mb-6">My Space</h1>
              
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                  { id: 'notebooks', label: 'Notebooks', icon: <Folder size={16} /> },
                  { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={16} /> },
                  { id: 'mistakes', label: 'Mistakes', icon: <AlertCircle size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                      activeTab === tab.id 
                        ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' 
                        : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </header>

            <main className="px-6 pt-6">
              {activeTab === 'notebooks' && renderNotebooksGrid()}
              {activeTab === 'bookmarks' && renderQuestionsList('bookmark')}
              {activeTab === 'mistakes' && renderQuestionsList('mistake')}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Notebook Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 p-6 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 rounded-[2rem] p-6 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">New Notebook</h3>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notebook Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tough Physics Qs"
                    value={newNotebookName}
                    onChange={(e) => setNewNotebookName(e.target.value)}
                    autoFocus
                    className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                  />
                </div>
                
                <button 
                  onClick={handleCreateNotebook}
                  disabled={!newNotebookName.trim()}
                  className="w-full py-4 bg-brand text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  Create Notebook
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notebooks;
