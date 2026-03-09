import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Check, 
  Zap, 
  Atom, 
  FlaskConical, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  Info,
  Clock,
  HelpCircle,
  Calendar,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { ExamType, SubjectType, Chapter } from './types';
import { getChaptersForExam, syllabusData } from '../../data/syllabus';

interface CreateTestFlowProps {
  onBack: () => void;
  onFinish: (testData: any) => void;
}

const CreateTestFlow: React.FC<CreateTestFlowProps> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState(1);
  const [testName, setTestName] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectType[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [outOfSyllabus, setOutOfSyllabus] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState<SubjectType | null>(null);
  const [mockChapters, setMockChapters] = useState<Chapter[]>([]);
  
  // Settings
  const [questionSource, setQuestionSource] = useState<'PYQ' | 'Practice' | 'Mixed'>('PYQ');
  const [questionsPerSubject, setQuestionsPerSubject] = useState(10);
  const [testDuration, setTestDuration] = useState(60);
  const [yearFilter, setYearFilter] = useState<'All' | 'Last 5 Years' | 'Specific'>('All');

  useEffect(() => {
    if (selectedExam) {
      setMockChapters(getChaptersForExam(selectedExam));
    } else {
      setMockChapters([]);
    }
  }, [selectedExam]);

  const getSubjectsByExam = () => {
    if (!selectedExam) return [];
    const examData = syllabusData[selectedExam];
    if (!examData) return [];
    
    return Object.keys(examData).map(subject => {
      let icon = BookOpen;
      let color = 'text-slate-400';
      
      if (subject === 'Physics') { icon = Atom; color = 'text-blue-400'; }
      else if (subject === 'Chemistry') { icon = FlaskConical; color = 'text-emerald-400'; }
      else if (subject === 'Mathematics') { icon = Calculator; color = 'text-orange-400'; }
      else if (subject === 'Biology') { icon = Zap; color = 'text-rose-400'; }
      
      return { type: subject as SubjectType, icon, color };
    });
  };

  const currentSubjects = getSubjectsByExam();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else onFinish({
      name: testName || `${selectedExam} Custom Test`,
      exam: selectedExam,
      subjects: selectedSubjects,
      chapters: selectedChapters,
      questionCount: selectedSubjects.length * questionsPerSubject,
      duration: testDuration,
      source: questionSource,
      yearFilter
    });
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onBack();
  };

  const toggleSubject = (subject: SubjectType) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
      // Remove chapters associated with the unselected subject
      const subjectChapterIds = mockChapters.filter(c => c.subject === subject).map(c => c.id);
      setSelectedChapters(selectedChapters.filter(id => !subjectChapterIds.includes(id)));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleChapter = (chapterId: string) => {
    if (selectedChapters.includes(chapterId)) {
      setSelectedChapters(selectedChapters.filter(id => id !== chapterId));
    } else {
      setSelectedChapters([...selectedChapters, chapterId]);
    }
  };

  const handleExamSelect = (exam: ExamType) => {
    if (exam !== selectedExam) {
      setSelectedExam(exam);
      setSelectedSubjects([]);
      setSelectedChapters([]);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Test Details</h2>
        <p className="text-slate-400">Give your test a name and choose an exam</p>
      </div>

      <div className="space-y-3 mb-8">
        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Test Name</label>
        <input 
          type="text"
          placeholder="e.g. Physics Mechanics Practice"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full p-5 bg-slate-800/40 border-2 border-white/5 rounded-3xl text-lg font-bold text-white focus:border-brand outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Choose Exam</label>
        <div className="grid grid-cols-1 gap-4">
          {(Object.keys(syllabusData) as ExamType[]).map((exam) => (
            <motion.div
              key={exam}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExamSelect(exam)}
              className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedExam === exam 
                  ? 'bg-brand/10 border-brand shadow-lg shadow-brand/10' 
                  : 'bg-slate-800/40 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedExam === exam ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400'}`}>
                  <Zap size={24} />
                </div>
                <span className="text-lg font-bold">{exam}</span>
              </div>
              {selectedExam === exam && <Check className="text-brand" size={24} />}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Subject Selection</h2>
        <p className="text-slate-400">Choose one or more subjects</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {currentSubjects.map(({ type, icon: Icon, color }) => (
          <motion.div
            key={type}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleSubject(type)}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              selectedSubjects.includes(type)
                ? 'bg-brand/10 border-brand shadow-lg shadow-brand/10' 
                : 'bg-slate-800/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedSubjects.includes(type) ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Icon size={24} className={selectedSubjects.includes(type) ? 'text-white' : color} />
              </div>
              <span className="text-lg font-bold">{type}</span>
            </div>
            {selectedSubjects.includes(type) && <Check className="text-brand" size={24} />}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Add Chapters</h2>
        <p className="text-slate-400">Select specific chapters for your test</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
            <Info size={20} />
          </div>
          <div>
            <p className="text-sm font-bold">Include out of syllabus Qs</p>
            <p className="text-xs text-slate-500">Questions from removed topics</p>
          </div>
        </div>
        <button 
          onClick={() => setOutOfSyllabus(!outOfSyllabus)}
          className={`w-12 h-6 rounded-full transition-all relative ${outOfSyllabus ? 'bg-brand' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${outOfSyllabus ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      <div className="space-y-4">
        {selectedSubjects.map((subject) => (
          <div key={subject} className="bg-slate-800/40 rounded-3xl border border-white/5 overflow-hidden">
            <div 
              onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                  {(() => {
                    const s = currentSubjects.find(s => s.type === subject);
                    const Icon = s?.icon || Atom;
                    return <Icon size={20} />;
                  })()}
                </div>
                <div className="text-left">
                  <h4 className="font-bold">{subject}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">
                      {mockChapters.filter(c => c.subject === subject && selectedChapters.includes(c.id)).length} / {mockChapters.filter(c => c.subject === subject).length} Chapters selected
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const subjectChapters = mockChapters.filter(c => c.subject === subject).map(c => c.id);
                        const allSelected = subjectChapters.every(id => selectedChapters.includes(id));
                        if (allSelected) {
                          setSelectedChapters(selectedChapters.filter(id => !subjectChapters.includes(id)));
                        } else {
                          setSelectedChapters([...new Set([...selectedChapters, ...subjectChapters])]);
                        }
                      }}
                      className="text-[10px] font-bold text-brand hover:underline"
                    >
                      {mockChapters.filter(c => c.subject === subject).every(c => selectedChapters.includes(c.id)) ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                </div>
              </div>
              {expandedSubject === subject ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            <AnimatePresence>
              {expandedSubject === subject && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-slate-900/50"
                >
                  <div className="p-5 flex flex-wrap gap-2">
                    {mockChapters.filter(c => c.subject === subject).map((chapter) => {
                      const isVisible = outOfSyllabus || !chapter.isRemoved;
                      if (!isVisible) return null;
                      
                      return (
                        <button
                          key={chapter.id}
                          onClick={() => toggleChapter(chapter.id)}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${
                            selectedChapters.includes(chapter.id)
                              ? 'bg-brand border-brand text-white'
                              : 'bg-slate-800 border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                        >
                          {chapter.name}
                          {chapter.isReduced && <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-500 rounded text-[8px] uppercase">Reduced</span>}
                          {chapter.isRemoved && <span className="px-1.5 py-0.5 bg-red-500/20 text-red-500 rounded text-[8px] uppercase">Removed</span>}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Question Settings</h2>
        <p className="text-slate-400">Configure your test parameters</p>
      </div>

      <div className="space-y-6">
        {/* Source */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Question Source</label>
          <div className="grid grid-cols-3 gap-2">
            {(['PYQ', 'Practice', 'Mixed'] as const).map((source) => (
              <button
                key={source}
                onClick={() => setQuestionSource(source)}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  questionSource === source 
                    ? 'bg-brand/10 border-brand text-brand' 
                    : 'bg-slate-800/40 border-white/5 text-slate-500'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Questions per Subject</label>
            <span className="text-brand font-bold">{questionsPerSubject} Qs</span>
          </div>
          <input 
            type="range" 
            min="5" 
            max="30" 
            step="5"
            value={questionsPerSubject}
            onChange={(e) => setQuestionsPerSubject(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>5 Qs</span>
            <span>15 Qs</span>
            <span>30 Qs</span>
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Test Duration</label>
            <span className="text-brand font-bold">{testDuration} Mins</span>
          </div>
          <input 
            type="range" 
            min="15" 
            max="180" 
            step="15"
            value={testDuration}
            onChange={(e) => setTestDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>15m</span>
            <span>90m</span>
            <span>180m</span>
          </div>
        </div>
      </div>

      <div className="bg-brand/5 p-6 rounded-3xl border border-brand/20 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center text-brand">
          <HelpCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-bold">Total Questions: {selectedSubjects.length * questionsPerSubject}</p>
          <p className="text-xs text-slate-400">Based on your selected subjects</p>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Year Filter</h2>
        <p className="text-slate-400">Select the year range for questions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(['All', 'Last 5 Years', 'Specific'] as const).map((filter) => (
          <motion.div
            key={filter}
            whileTap={{ scale: 0.98 }}
            onClick={() => setYearFilter(filter)}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              yearFilter === filter 
                ? 'bg-brand/10 border-brand shadow-lg shadow-brand/10' 
                : 'bg-slate-800/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${yearFilter === filter ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400'}`}>
                <Calendar size={24} />
              </div>
              <span className="text-lg font-bold">{filter}</span>
            </div>
            {yearFilter === filter && <Check className="text-brand" size={24} />}
          </motion.div>
        ))}
      </div>

      {/* Test Preview Section */}
      <div className="mt-12 p-6 bg-slate-800/40 rounded-[2rem] border border-white/5">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Test Summary</h3>
        <div className="mb-4">
          <p className="text-lg font-bold">{testName || `${selectedExam} Custom Test`}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full">{selectedExam}</span>
          {selectedSubjects.map(s => (
            <span key={s} className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded-full">{s}</span>
          ))}
          <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded-full">{selectedSubjects.length * questionsPerSubject} Qs</span>
          <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-bold rounded-full">{testDuration} Mins</span>
        </div>
      </div>
    </div>
  );

  const canGoNext = () => {
    if (step === 1) return selectedExam !== null;
    if (step === 2) return selectedSubjects.length > 0;
    if (step === 3) {
      // Ensure at least one chapter is selected for EACH selected subject
      return selectedSubjects.every(subject => 
        mockChapters.some(c => c.subject === subject && selectedChapters.includes(c.id))
      );
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#0F172A]/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold">
            {step <= 2 ? 'Create Your Own Test' : 
             step === 3 ? expandedSubject || 'Select Chapters' :
             step === 4 ? 'Test Settings' : 'Year Filter'}
          </h1>
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-xl border border-white/5 flex items-center justify-center text-slate-400">
          {step <= 2 ? <Calendar size={20} /> : 
           step === 3 ? <Info size={20} /> :
           step === 4 ? <SlidersHorizontal size={20} /> : <Calendar size={20} />}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 py-2">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-1 px-6 pt-6 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={!canGoNext()}
          onClick={handleNext}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-xl ${
            canGoNext() 
              ? 'bg-brand text-white shadow-brand/30' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {step === 5 ? 'Create Test' : 'Continue'}
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default CreateTestFlow;
