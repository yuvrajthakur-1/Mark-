import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Shield, Bell, LogOut, ChevronRight, Star, ArrowLeft, CheckCircle2, Smartphone, Monitor, Globe, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { pointsEarned, userRank, streak } = useUser();
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Student Name',
    email: 'student@example.com',
    phone: '+91 98765 43210',
    dob: '2005-08-15',
    gender: 'Male'
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    reminders: true,
    newContent: true,
    marketing: false
  });

  // Settings State
  const [settings, setSettings] = useState({
    theme: 'Dark Mode',
    targetExam: 'JEE Main',
    language: 'English',
    videoQuality: 'Auto'
  });

  const menuItems = [
    { id: 'personal', icon: <User size={20} />, label: 'Personal Info', color: 'text-blue-500' },
    { id: 'security', icon: <Shield size={20} />, label: 'Security', color: 'text-emerald-500' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications', color: 'text-orange-500' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', color: 'text-slate-400' },
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderView = () => {
    switch (activeView) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <input 
                type="tel" 
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                <select 
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-brand text-white font-bold rounded-2xl mt-4 flex items-center justify-center gap-2">
              {showSuccess ? <CheckCircle2 size={20} /> : null}
              {showSuccess ? 'Saved Successfully' : 'Save Changes'}
            </button>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Change Password</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input 
                  type="password" 
                  value={security.currentPassword}
                  onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input 
                  type="password" 
                  value={security.newPassword}
                  onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <input 
                  type="password" 
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                  placeholder="••••••••" 
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors" 
                />
              </div>
              <button onClick={handleSave} className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl mt-4 flex items-center justify-center gap-2">
                {showSuccess ? <CheckCircle2 size={20} /> : null}
                {showSuccess ? 'Password Updated' : 'Update Password'}
              </button>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-bold text-lg">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                <div>
                  <h4 className="font-bold text-sm">Enable 2FA</h4>
                  <p className="text-xs text-slate-500">Add an extra layer of security</p>
                </div>
                <div 
                  onClick={() => setSecurity({...security, twoFactor: !security.twoFactor})}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${security.twoFactor ? 'bg-emerald-500' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${security.twoFactor ? 'right-1' : 'left-1'}`} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-bold text-lg">Recent Devices</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center text-brand">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">iPhone 14 Pro</h4>
                    <p className="text-xs text-slate-500">Active now • Mumbai, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                    <Monitor size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">MacBook Air</h4>
                    <p className="text-xs text-slate-500">Last active 2 hours ago • Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { id: 'push', title: 'Push Notifications', desc: 'Receive alerts on your device' },
                { id: 'email', title: 'Email Updates', desc: 'Weekly progress reports' },
                { id: 'reminders', title: 'Test Reminders', desc: 'Alerts before scheduled tests' },
                { id: 'newContent', title: 'New Content', desc: 'When new PYQs are added' },
                { id: 'marketing', title: 'Offers & Promotions', desc: 'Special discounts and offers' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <div 
                    onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})}
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications[item.id as keyof typeof notifications] ? 'bg-brand' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-brand text-white font-bold rounded-2xl mt-4 flex items-center justify-center gap-2">
              {showSuccess ? <CheckCircle2 size={20} /> : null}
              {showSuccess ? 'Preferences Saved' : 'Save Preferences'}
            </button>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">App Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>Dark Mode</option>
                  <option>Light Mode</option>
                  <option>System Default</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Exam</label>
                <select 
                  value={settings.targetExam}
                  onChange={(e) => setSettings({...settings, targetExam: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>JEE Main</option>
                  <option>NEET</option>
                  <option>JEE Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Quality</label>
                <select 
                  value={settings.videoQuality}
                  onChange={(e) => setSettings({...settings, videoQuality: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:border-brand transition-colors appearance-none"
                >
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <h3 className="font-bold text-lg text-rose-500">Danger Zone</h3>
              <button className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl border border-white/5 hover:bg-slate-700 transition-colors">
                Clear App Cache
              </button>
              <button className="w-full py-4 bg-rose-500/10 text-rose-500 font-bold rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2">
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 font-kanit">
      <AnimatePresence mode="wait">
        {activeView ? (
          <motion.div
            key="subview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-screen bg-[#0f172a]"
          >
            <header className="px-6 pt-12 pb-6 flex items-center gap-4 sticky top-0 bg-[#0f172a]/80 backdrop-blur-lg z-40">
              <button 
                onClick={() => setActiveView(null)}
                className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">
                {menuItems.find(m => m.id === activeView)?.label}
              </h1>
            </header>
            <main className="px-6 pt-4">
              {renderView()}
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-brand p-1">
                  <img 
                    src="https://picsum.photos/seed/user/200/200" 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand rounded-full flex items-center justify-center border-4 border-[#0f172a]">
                  <Star size={14} fill="white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">Student Name</h1>
              <p className="text-slate-500 font-medium">JEE 2026 Aspirant</p>
              
              <div className="mt-6 flex gap-4 w-full max-w-xs">
                <div className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Rank</p>
                  <p className="text-lg font-bold text-brand">#{userRank}</p>
                </div>
                <div className="flex-1 bg-slate-800/50 p-3 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Points</p>
                  <p className="text-lg font-bold text-emerald-500">{pointsEarned}</p>
                </div>
              </div>
            </header>

            <main className="px-6 space-y-6">
              {/* Activity Calendar */}
              <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-slate-300">Activity Map</h3>
                  <span className="text-xs font-bold text-brand bg-brand/10 px-2 py-1 rounded-lg">{streak} Day Streak! 🔥</span>
                </div>
                
                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-xs font-bold text-slate-500">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`blank-${i}`} />
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const d = i + 1;
                    const level = Math.floor(Math.random() * 5);
                    let colorClass = 'bg-slate-700/50 text-slate-400';
                    if (level === 1) colorClass = 'bg-brand/20 text-brand';
                    if (level === 2) colorClass = 'bg-brand/40 text-white';
                    if (level === 3) colorClass = 'bg-brand/70 text-white';
                    if (level === 4) colorClass = 'bg-brand text-white';
                    
                    return (
                      <div 
                        key={d} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${colorClass}`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-sm bg-slate-700/50" />
                    <div className="w-4 h-4 rounded-sm bg-brand/20" />
                    <div className="w-4 h-4 rounded-sm bg-brand/40" />
                    <div className="w-4 h-4 rounded-sm bg-brand/70" />
                    <div className="w-4 h-4 rounded-sm bg-brand" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-[2rem] border border-white/5 overflow-hidden">
                {menuItems.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all ${i !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${item.color} opacity-80`}>{item.icon}</div>
                      <span className="font-bold text-slate-300">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-600" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-3 p-5 bg-rose-500/10 text-rose-500 rounded-2xl font-bold hover:bg-rose-500/20 transition-all mt-8"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
