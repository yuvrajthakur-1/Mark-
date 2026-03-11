import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Book, ChevronRight, Filter } from 'lucide-react';
import { notebookDB, Note } from '../../utils/notebookDB';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const NotebookHome = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    const allNotes = notebookDB.getNotes();
    // Assuming user context has an email, if not fallback to a default for demo
    const userEmail = user?.email || 'student@example.com'; 
    setNotes(allNotes.filter(n => n.email === userEmail));
  };

  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'All' || n.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-40">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Notebook</h1>
            <p className="text-slate-400 text-sm">Your personal revision system</p>
          </div>
          <button 
            onClick={() => navigate('/app/notebook/add')}
            className="w-10 h-10 bg-brand text-white rounded-full flex items-center justify-center shadow-lg shadow-brand/20"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setFilterSubject(subject)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filterSubject === subject 
                  ? 'bg-brand text-white' 
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <Book className="mx-auto text-slate-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-300 mb-2">No notes found</h3>
            <p className="text-slate-500 text-sm">Create a note or save a mistake from a test.</p>
          </div>
        ) : (
          filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/app/notebook/${note.id}`)}
              className="bg-slate-800/40 p-5 rounded-3xl border border-white/5 cursor-pointer hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand/10 px-2 py-1 rounded-md">
                    {note.subject}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                    {note.chapter}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{note.date}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{note.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{note.content}</p>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default NotebookHome;
