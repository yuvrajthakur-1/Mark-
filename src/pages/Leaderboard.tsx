import React from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, Star, TrendingUp, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('Today');
  const { pointsEarned, userRank } = useUser();

  // Sort leaders and inject the current user if they are in the top 5
  // For demonstration, we'll just keep the static list and add the user at the bottom
  const leaders = [
    { name: 'Shreyansh', points: 7300, rank: 1, avatar: 'https://picsum.photos/seed/l1/100/100' },
    { name: 'Aarju', points: 6105, rank: 2, avatar: 'https://picsum.photos/seed/l2/100/100' },
    { name: 'Irfan', points: 3830, rank: 3, avatar: 'https://picsum.photos/seed/l3/100/100' },
    { name: 'KOYAMU', points: 3275, rank: 4, avatar: 'https://picsum.photos/seed/l4/100/100' },
    { name: 'ilm', points: 3220, rank: 5, avatar: 'https://picsum.photos/seed/l5/100/100' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-12 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-brand/20 rounded-full flex items-center justify-center blur-2xl absolute inset-0" />
          <Trophy className="text-brand relative z-10" size={64} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 uppercase tracking-tight">Legend League</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          You are now competing against 99%ilers! Stay in this league for 10 weeks.
        </p>

        <div className="mt-8 flex bg-slate-800/50 p-1 rounded-2xl w-full max-w-xs mx-auto">
          {['Today', 'This Week'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-brand text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 space-y-4">
        {leaders.map((leader, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${leader.rank === 1 ? 'bg-brand/10 border-brand/30' : 'bg-slate-800/50 border-white/5'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${leader.rank === 1 ? 'bg-brand text-white' : 'bg-slate-700 text-slate-400'}`}>
                {leader.rank === 1 ? <Medal size={20} /> : leader.rank}
              </div>
              <img src={leader.avatar} alt={leader.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-slate-200">{leader.name}</h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <TrendingUp size={10} className="text-emerald-500" />
                  <span>Rank Up</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center text-[10px] font-bold text-white">M</div>
              <span className="font-bold text-slate-200">{leader.points}</span>
            </div>
          </motion.div>
        ))}

        {/* User Rank Sticky */}
        <div className="fixed bottom-20 left-6 right-6 bg-slate-900/95 backdrop-blur-lg border border-brand/50 p-5 rounded-3xl flex items-center justify-between shadow-2xl z-40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {userRank}
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200">You</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Keep pushing!</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-white/5">
            <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center text-[10px] font-bold text-white">M</div>
            <span className="font-bold text-slate-200">{pointsEarned}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
