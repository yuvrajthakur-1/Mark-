import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { notebookDB, Note } from '../../utils/notebookDB';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      const notes = notebookDB.getNotes();
      const found = notes.find(n => n.id === Number(id));
      if (found) {
        setSubject(found.subject);
        setChapter(found.chapter);
        setTitle(found.title);
        setContent(found.content);
      }
    }
  }, [id]);

  const handleSave = () => {
    if (!title || !content || !subject || !chapter) {
      alert('Please fill in all fields');
      return;
    }

    notebookDB.updateNote(Number(id), {
      subject,
      chapter,
      title,
      content,
    });

    navigate(`/app/notebook/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-[#0f172a]/90 backdrop-blur-md z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Edit Note</h1>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-brand/20"
        >
          <Save size={16} />
          Save
        </button>
      </header>

      <main className="px-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chapter</label>
            <input
              type="text"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Mechanics"
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Work Energy Concept"
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors font-bold text-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your notes here..."
              rows={10}
              className="w-full bg-slate-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-colors resize-none"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditNote;
