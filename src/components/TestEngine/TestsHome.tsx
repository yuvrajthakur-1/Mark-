import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, FileText, ChevronRight, Star } from 'lucide-react';

interface TestsHomeProps {
  onBack: () => void;
  onCreateTest: () => void;
  onViewPYQs: () => void;
  onViewTestSeries: (id: string) => void;
}

const TestsHome: React.FC<TestsHomeProps> = ({ onBack, onCreateTest, onViewPYQs, onViewTestSeries }) => {
  const testSeries = [
    {
      id: '1',
      title: 'JEE Main 2024 Full Mock Series',
      subtitle: '15 Full Length Tests with detailed analysis',
      image: 'https://picsum.photos/seed/jee1/400/200',
      students: '12k+',
    },
    {
      id: '2',
      title: 'Chapter-wise PYQ Series (2019-2023)',
      subtitle: 'Topic-wise sorted previous year questions',
      image: 'https://picsum.photos/seed/pyq1/400/200',
      students: '45k+',
    },
    {
      id: '3',
      title: 'Advanced Level Problem Set',
      subtitle: 'Challenging problems for JEE Advanced prep',
      image: 'https://picsum.photos/seed/adv1/400/200',
      students: '8k+',
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-24">
      {/* Top App Bar */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-[#0F172A]/80 backdrop-blur-lg z-40">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">MARKS Tests</h1>
            <div className="w-5 h-5 bg-brand rounded-md flex items-center justify-center">
              <Star size={12} fill="white" className="text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6 mt-4">
        {/* Primary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onCreateTest}
            className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="relative z-10 pr-12">
              <h2 className="text-xl font-bold mb-2">Create Your Own Test</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                565+ students took a Custom Test in last hour
              </p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
              <Calendar size={28} />
            </div>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onViewPYQs}
            className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between cursor-pointer group relative overflow-hidden"
          >
            <div className="relative z-10 pr-12">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold">PYQ Mock Tests</h2>
                <span className="px-2 py-0.5 bg-brand text-[10px] font-bold rounded-full uppercase tracking-wider">NEW</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                519+ students took a PYQ Mock Test in last hour
              </p>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-700/50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
          </motion.div>
        </div>

        {/* Section: Test Series */}
        <div className="pt-4">
          <div className="mb-6">
            <h3 className="text-lg font-bold">India's Most Trusted Test Series</h3>
            <p className="text-sm text-slate-400">Brought to you by Quizrr</p>
          </div>

          <div className="space-y-4">
            {testSeries.map((series) => (
              <motion.div
                key={series.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewTestSeries(series.id)}
                className="bg-slate-800/30 rounded-[2rem] border border-white/5 overflow-hidden cursor-pointer group"
              >
                <div className="h-40 relative">
                  <img 
                    src={series.image} 
                    alt={series.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {series.students} Students
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg">{series.title}</h4>
                    <ChevronRight size={20} className="text-slate-500 group-hover:text-brand transition-colors" />
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{series.subtitle}</p>
                  <button className="text-brand text-sm font-bold flex items-center gap-1 group/link">
                    View Details
                    <ChevronRight size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestsHome;
