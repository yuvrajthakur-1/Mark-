import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ClipboardCheck, 
  BarChart3, 
  FileText, 
  Layout, 
  Download, 
  ChevronRight, 
  Star,
  Users,
  Trophy,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-carter text-2xl">
              M
            </div>
            <span className="text-2xl font-carter text-brand tracking-tight">MARKS</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-brand font-medium transition-colors">JEE</a>
            <a href="#" className="text-slate-600 hover:text-brand font-medium transition-colors">NEET</a>
            <a href="#" className="text-slate-600 hover:text-brand font-medium transition-colors">CUET</a>
            <a href="#" className="text-slate-600 hover:text-brand font-medium transition-colors">Resources</a>
            <Link to="/login" className="bg-brand text-white px-6 py-2 rounded-full font-semibold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20">
              Sign In
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4"
        >
          <a href="#" className="block text-slate-600 font-medium">JEE</a>
          <a href="#" className="block text-slate-600 font-medium">NEET</a>
          <a href="#" className="block text-slate-600 font-medium">CUET</a>
          <a href="#" className="block text-slate-600 font-medium">Resources</a>
          <Link to="/login" className="block w-full bg-brand text-white px-6 py-3 rounded-xl font-semibold text-center">
            Sign In
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-bold mb-6">
              <Star size={16} fill="currentColor" />
              <span>Trusted by 5 Million+ Students</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              Master Your Prep with <span className="text-brand">MARKS</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
              The ultimate preparation app for IIT JEE, NEET & CUET. Practice chapter-wise questions, take custom tests, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all group">
                <Download size={20} />
                <span>Download App</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:border-brand hover:text-brand transition-all">
                <span>Try Web Version</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-900 aspect-[9/16] max-w-[320px] mx-auto">
              <img 
                src="https://picsum.photos/seed/marks-app/600/1000" 
                alt="App Screenshot" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/4 -right-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Daily Goal</p>
                <p className="text-sm font-bold text-slate-900">100% Completed</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Rank</p>
                <p className="text-sm font-bold text-slate-900">#12 in Physics</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="text-blue-600" />,
      title: "Chapter-wise Questions",
      description: "Access thousands of previous year questions and practice problems categorized by chapter.",
      color: "bg-blue-50"
    },
    {
      icon: <ClipboardCheck className="text-purple-600" />,
      title: "Custom Tests",
      description: "Create your own tests by selecting specific chapters, difficulty levels, and time limits.",
      color: "bg-purple-50"
    },
    {
      icon: <BarChart3 className="text-emerald-600" />,
      title: "Preparation Tracker",
      description: "Monitor your progress with detailed analytics and insights into your strengths and weaknesses.",
      color: "bg-emerald-50"
    },
    {
      icon: <FileText className="text-orange-600" />,
      title: "Revision Notes",
      description: "Quickly revise concepts with concise notes and formula sheets designed for last-minute prep.",
      color: "bg-orange-50"
    },
    {
      icon: <Layout className="text-rose-600" />,
      title: "Mock Tests",
      description: "Take full-length mock tests that simulate the actual exam environment and difficulty.",
      color: "bg-rose-50"
    },
    {
      icon: <Users className="text-indigo-600" />,
      title: "Peer Comparison",
      description: "Compare your performance with other aspirants and see where you stand in the competition.",
      color: "bg-indigo-50"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Crack Exams</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make your preparation more efficient and result-oriented.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 28 })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="py-20 bg-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <p className="text-4xl md:text-5xl font-extrabold mb-2">5M+</p>
            <p className="text-brand-100 font-medium opacity-80">Downloads</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold mb-2">4.8</p>
            <p className="text-brand-100 font-medium opacity-80">App Rating</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold mb-2">100M+</p>
            <p className="text-brand-100 font-medium opacity-80">Questions Solved</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-extrabold mb-2">10k+</p>
            <p className="text-brand-100 font-medium opacity-80">IITians & Doctors</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-carter text-2xl">
                M
              </div>
              <span className="text-2xl font-carter text-white tracking-tight">MARKS</span>
            </div>
            <p className="max-w-sm mb-6">
              Empowering students to achieve their dreams of entering top engineering and medical colleges in India.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all cursor-pointer">
                <Users size={20} />
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand hover:text-white transition-all cursor-pointer">
                <Star size={20} />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Exams</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-brand transition-colors">JEE Main</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">JEE Advanced</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">NEET</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">BITSAT</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="hover:text-brand transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          <p>© {new Date().getFullYear()} MARKS App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Aryan Sharma",
      role: "IIT Delhi, CSE",
      content: "MARKS was my go-to app for practicing PYQs. The chapter-wise categorization helped me focus on my weak areas effectively.",
      avatar: "https://picsum.photos/seed/student1/100/100"
    },
    {
      name: "Sneha Reddy",
      role: "AIIMS Delhi",
      content: "The custom test feature is a game-changer. I could create tests for exactly what I studied that day. Highly recommended for NEET aspirants!",
      avatar: "https://picsum.photos/seed/student2/100/100"
    },
    {
      name: "Ishaan Gupta",
      role: "IIT Bombay, EE",
      content: "The analytics provided by MARKS are incredibly detailed. It helped me understand my speed and accuracy trends over time.",
      avatar: "https://picsum.photos/seed/student3/100/100"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Success Stories</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Hear from students who used MARKS to secure ranks in top colleges.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50 flex flex-col h-full"
            >
              <div className="flex items-center gap-1 text-orange-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-700 italic mb-8 flex-grow">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-sm text-brand font-semibold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Resources = () => {
  const resources = [
    { title: "Formula Sheets", count: "500+ Formulas", icon: <FileText className="text-blue-500" /> },
    { title: "Revision Notes", count: "200+ Chapters", icon: <BookOpen className="text-purple-500" /> },
    { title: "PYQ Collections", count: "10+ Years", icon: <ClipboardCheck className="text-emerald-500" /> },
    { title: "Mind Maps", count: "150+ Topics", icon: <Layout className="text-orange-500" /> },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Free Study Resources</h2>
            <p className="text-xl text-slate-600 max-w-xl">
              Boost your preparation with our curated collection of study materials, available for free.
            </p>
          </div>
          <button className="text-brand font-bold flex items-center gap-2 hover:underline">
            View All Resources <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {res.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{res.title}</h3>
              <p className="text-slate-500 text-sm">{res.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "Is MARKS app free to use?",
      a: "Yes, MARKS offers a generous free tier that includes access to thousands of PYQs, chapter-wise practice, and basic analytics. We also have a premium version for advanced features."
    },
    {
      q: "Which exams are covered in the app?",
      a: "Currently, we support IIT JEE (Main & Advanced), NEET, BITSAT, and CUET. We are constantly adding more exams to our platform."
    },
    {
      q: "Can I use MARKS on my laptop?",
      a: "Absolutely! You can access MARKS on the web at web.getmarks.app with all the features available on the mobile app."
    },
    {
      q: "Does it have previous year questions?",
      a: "Yes, we have one of the most comprehensive collections of PYQs, organized chapter-wise and year-wise for all major entrance exams."
    }
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                <ChevronRight 
                  size={20} 
                  className={`text-slate-400 transition-transform ${openIndex === i ? 'rotate-90' : ''}`} 
                />
              </button>
              {openIndex === i && (
                <div className="p-6 pt-0 text-slate-600 border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UniqueFeatures = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10"
              >
                <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mb-4">
                  <Star size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Bucket List</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Save tough questions to your personal bucket list for later revision.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 mt-8"
              >
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Challenge Mode</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Compete with friends and other aspirants in real-time practice sessions.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Error Tracker</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Automatically track your silly mistakes and conceptual errors.</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/10 mt-8"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Search</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Find any question instantly using our advanced search filters.</p>
              </motion.div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Features That Make You <span className="text-brand">Unstoppable</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              We've built tools that go beyond just practice. MARKS helps you analyze, organize, and optimize your entire preparation journey.
            </p>
            <ul className="space-y-6">
              {[
                "Personalized learning paths",
                "Detailed solution explanations",
                "Time-management insights",
                "Community support and discussions"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-lg">
                  <div className="w-6 h-6 bg-brand/20 rounded-full flex items-center justify-center text-brand">
                    <CheckCircle2 size={18} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExamCoverage = () => {
  const exams = [
    { name: "JEE Main", color: "from-blue-500 to-blue-600", tag: "Engineering" },
    { name: "JEE Advanced", color: "from-indigo-500 to-indigo-600", tag: "Engineering" },
    { name: "NEET", color: "from-emerald-500 to-emerald-600", tag: "Medical" },
    { name: "BITSAT", color: "from-orange-500 to-orange-600", tag: "Engineering" },
    { name: "CUET", color: "from-purple-500 to-purple-600", tag: "University" },
    { name: "KVPY", color: "from-rose-500 to-rose-600", tag: "Scholarship" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Exams We Cover</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive preparation material for India's most competitive entrance exams.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {exams.map((exam, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${exam.color} text-white shadow-lg cursor-pointer flex flex-col items-center text-center justify-center min-h-[160px]`}
            >
              <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{exam.tag}</span>
              <h3 className="text-xl font-bold leading-tight">{exam.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Choose Your Exam",
      description: "Select from JEE, NEET, or BITSAT to get started with your specific preparation journey.",
      image: "https://picsum.photos/seed/step1/400/600"
    },
    {
      title: "Practice Chapter-wise",
      description: "Dive deep into specific chapters with thousands of categorized previous year questions.",
      image: "https://picsum.photos/seed/step2/400/600"
    },
    {
      title: "Track Your Growth",
      description: "Get detailed analytics on your speed, accuracy, and overall preparation level.",
      image: "https://picsum.photos/seed/step3/400/600"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How MARKS Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A simple three-step process to transform your preparation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-brand/20 rounded-[2rem] blur-2xl group-hover:bg-brand/30 transition-all" />
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="relative z-10 w-48 h-80 object-cover rounded-[2rem] border-4 border-white shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-xl z-20 shadow-lg">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Landing = () => {
  return (
    <div className="min-h-screen font-kanit">
      <Navbar />
      <Hero />
      <Stats />
      <ExamCoverage />
      <HowItWorks />
      <Features />
      <UniqueFeatures />
      <Resources />
      <Testimonials />
      <FAQ />
      
      {/* CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                Join millions of students who are already using MARKS to ace their competitive exams.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" referrerPolicy="no-referrer" />
                </button>
                <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" referrerPolicy="no-referrer" />
                </button>
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Free to Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Trusted by Teachers</span>
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-brand rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
