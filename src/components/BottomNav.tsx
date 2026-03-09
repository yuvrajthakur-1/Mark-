import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, BookMarked, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/app' },
    { icon: <ClipboardList size={24} />, label: 'Tests', path: '/app/tests' },
    { icon: <BookMarked size={24} />, label: 'Notebooks', path: '/app/notebooks' },
    { icon: <User size={24} />, label: 'My Profile', path: '/app/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 w-full h-full transition-all
              ${isActive ? 'text-brand' : 'text-slate-500 hover:text-slate-300'}
            `}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
