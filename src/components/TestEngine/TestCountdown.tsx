import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';

interface TestCountdownProps {
  onComplete: () => void;
}

const TestCountdown: React.FC<TestCountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#0F172A] z-[100] flex flex-center items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-brand/5 animate-pulse" />
      
      <div className="text-center relative z-10">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-brand/20 rounded-full flex items-center justify-center text-brand relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Rocket size={48} />
            </motion.div>
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-2xl animate-pulse" />
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-[0.2em]">Preparing your test</h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-8xl font-black text-white"
          >
            {count > 0 ? count : 'GO!'}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestCountdown;
