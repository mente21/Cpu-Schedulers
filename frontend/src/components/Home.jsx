import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  Shuffle, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Zap, 
  Terminal, 
  BarChart3, 
  Database, 
  Layers,
  ChevronRight,
  Code2
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const algos = [
    {
      id: 'rr',
      name: 'Round Robin',
      desc: 'Preemptive time-slicing for optimal response time.',
      icon: <Shuffle size={32} />,
      tags: ['QUANTUM', 'NO STARVATION'],
      color: '#00f2ff',
      path: '/rr'
    },
    {
      id: 'fcfs',
      name: 'FCFS',
      desc: 'The simplest scheduling algorithm with zero overhead.',
      icon: <ArrowRight size={32} />,
      tags: ['NON-PREEMPTIVE', 'BATCH'],
      color: '#7000ff',
      path: '/fcfs'
    },
    {
      id: 'sjf',
      name: 'Shortest Job',
      desc: 'Minimizes average waiting time for known bursts.',
      icon: <Activity size={32} />,
      tags: ['OPTIMAL', 'GREEDY'],
      color: '#ff007a',
      path: '/sjf'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-bg-mesh" />
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >



          <motion.div variants={itemVariants} className="hero-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="ml-2"></span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            Master the <br />
            <span className="hero-title-gradient">Computational Core</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtitle">
            Experience the pulse of the OS. An advanced, high-fidelity simulation environment 
            designed to visualize, analyze, and master CPU scheduling algorithms.
          </motion.p>

          <motion.div variants={itemVariants} className="hero-actions">
            <button onClick={() => navigate('/rr')} className="btn-hero-primary">
              Initialize System
            </button>
            <button 
                onClick={() => window.open('https://github.com/mentedebele35-eng/RoundRobinScheduler', '_blank')}
                className="btn-hero-secondary"
            >
              <span className="flex items-center gap-2">
                <Code2 size={18} /> Source Code
              </span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ALGORITHMS GRID */}
      <section className="algos-section">
        <motion.div 
          className="algos-grid"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {algos.map((algo, i) => (
            <div 
              key={algo.id} 
              className="algo-card group"
              onClick={() => navigate(algo.path)}
              style={{ '--hover-color': algo.color }}
            >
              <div>
                <span className="algo-number">{`0${i + 1}`}</span>
                <div className="algo-icon-wrapper" style={{ color: algo.color, borderColor: `${algo.color}30` }}>
                  {algo.icon}
                </div>
                <h3 className="algo-title">{algo.name}</h3>
                <p className="algo-desc">{algo.desc}</p>
              </div>
              
              <div>
                <div className="algo-tags mb-8">
                  {algo.tags.map(tag => (
                    <span key={tag} className="algo-tag" style={{ color: algo.color, borderColor: `${algo.color}30` }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="btn-launch">
                  Launch Module <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* BENTO FEATURES */}
      <section className="bento-section">
        <div className="bento-header">
          <span className="section-label">System Capabilities</span>
          <h2 className="section-title">Engineered for <br/> Performance</h2>
        </div>

        <div className="bento-grid">
          {/* Large Item */}
          <div className="bento-item bento-large group">
            <div className="bento-icon">
              <Activity size={32} />
            </div>
            <h3 className="bento-title">Real-time Telemetry</h3>
            <p className="bento-text">
              Watch distinct processes compete for CPU time in millisecond-accurate simulations. 
              Our engine visualizes the context switches, queue states, and burst times as they happen.
            </p>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={300} strokeWidth={0.5} />
            </div>
          </div>

          <div className="bento-item bento-medium">
             <div className="bento-icon" style={{ color: '#7000ff' }}>
              <Zap size={32} />
             </div>
             <h3 className="bento-title">Zero Latency</h3>
             <p className="bento-text">Built on a lightweight React core for instant state updates.</p>
          </div>

          <div className="bento-item bento-small">
             <div className="bento-icon" style={{ color: '#ff007a' }}>
              <Terminal size={32} />
             </div>
             <h3 className="bento-title">Custom Logic</h3>
             <p className="bento-text">Modify quantum times and burst priorities on the fly.</p>
          </div>
          
           <div className="bento-item bento-large flex-row items-center justify-between !p-12">
             <div>
                <h3 className="bento-title">Export Data</h3>
                <p className="bento-text max-w-lg">
                  Generate comprehensive reports of your simulation runs for academic analysis.
                </p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/10">
               <Database size={48} className="text-gray-400" />
             </div>
          </div>
        </div>
      </section>

      {/* TECH FOOTER */}
      <section className="specs-section">
        <div className="specs-container">
          <div className="specs-grid">
             <div>
                <span className="section-label">Architecture</span>
                <h2 className="text-5xl font-black uppercase mb-8">Deep Kernel <br/> Integration</h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                   The simulation engine mimics actual scheduling data structures including PCB blocks, ready queues, and wait states.
                </p>

                <div className="spec-stat-row">
                   <div>
                      <div className="text-4xl font-black text-white mb-2">O(1)</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-cyan-400">Lookup Time</div>
                   </div>
                   <div>
                      <div className="text-4xl font-black text-white mb-2">60fps</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-purple-400">Refresh Rate</div>
                   </div>
                </div>
             </div>

             <div className="relative h-64 flex items-end gap-2 bg-black/40 rounded-3xl p-6 border border-white/5">
                {[40, 70, 30, 85, 50, 95, 60, 45, 80, 55, 90, 35].map((h, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: '10%' }}
                     whileInView={{ height: `${h}%` }}
                     transition={{ 
                       duration: 1.5, 
                       delay: i * 0.05, 
                       repeat: Infinity, 
                       repeatType: "reverse" 
                     }}
                     className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500/50 to-purple-500/50"
                   />
                ))}
                <div className="absolute top-6 left-6 font-mono text-xs text-green-400">SYS_MONITOR_ACTIVE</div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;