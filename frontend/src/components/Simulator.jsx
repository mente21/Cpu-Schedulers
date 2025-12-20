import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Pause, RotateCcw, Trash2, Cpu, Activity, Clock, Layers, Terminal } from 'lucide-react';
import { simulate } from '../utils/schedulerEngine';
import GanttChart from './GanttChart';
import ResultTable from './ResultTable';
import './Simulator.css';

const COLORS = ['#00f2ff', '#7000ff', '#ff007a', '#00ff88', '#ffb800', '#ff4d4d', '#00d1ff', '#9d00ff'];

const Simulator = ({ algorithm }) => {
  const [processes, setProcesses] = useState([
    { id: 1, arrivalTime: 0, burstTime: 5, color: COLORS[0] },
    { id: 2, arrivalTime: 1, burstTime: 3, color: COLORS[1] },
    { id: 3, arrivalTime: 2, burstTime: 8, color: COLORS[2] }
  ]);
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef(null);

  const [newArrival, setNewArrival] = useState('');
  const [newBurst, setNewBurst] = useState('');

  // Algorithm Descriptions
  const algoInfo = {
    RR: {
      title: "Round Robin",
      desc: "Time-quantum based scheduling ensuring fair CPU distribution.",
      details: ["PREEMPTIVE MODE", "TIME-SHARING OPTIMIZED", "STARVATION FREE"],
      icon: <Clock size={24} />
    },
    FCFS: {
      title: "First Come First Serve",
      desc: "Non-preemptive execution based strictly on arrival order.",
      details: ["NON-PREEMPTIVE", "BATCH PROCESSING", "SIMPLE QUEUE"],
      icon: <Layers size={24} />
    },
    SJF: {
      title: "Shortest Job First",
      desc: "Optimizes throughput by prioritizing shorter burst cycles.",
      details: ["MINIMIZES WAITING", "GREEDY APPROACH", "HIGH THROUGHPUT"],
      icon: <Activity size={24} />
    }
  };

  const currentInfo = algoInfo[algorithm];

  const addProcess = () => {
    if (newArrival === '' || newBurst === '') return;
    const nextId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([
      ...processes,
      { 
        id: nextId, 
        arrivalTime: parseInt(newArrival), 
        burstTime: parseInt(newBurst), 
        color: COLORS[nextId % COLORS.length] 
      }
    ]);
    setNewArrival('');
    setNewBurst('');
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
    setResult(null);
  };

  const calculate = () => {
    const q = algorithm === 'RR' ? quantum : Infinity;
    const res = simulate(processes, q, algorithm);
    setResult(res);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!result) calculate();
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setResult(null);
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (isPlaying && result && currentStep < result.log.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 800);
    } else if (currentStep >= result?.log.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, result]);

  const currentLog = result?.log[currentStep] || null;

  return (
    <div className="simulator-container">
      <div className="sim-bg-mesh" />

      {/* --- Header Section --- */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sim-header-section"
      >
        <div className="sim-badge">
          <span className="animate-pulse">●</span> System Module
        </div>
        <h1 className="sim-page-title">{currentInfo.title}</h1>
        <p className="sim-page-desc">{currentInfo.desc}</p>
      </motion.section>

      {/* --- Benchmark Info Grid --- */}
      <div className="sim-info-grid">
        {currentInfo.details.map((detail, idx) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             key={idx} 
             className="sim-info-card flex items-center gap-4"
           >
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 font-bold border border-white/10">
               {idx + 1}
             </div>
             <span className="text-xs font-bold tracking-widest uppercase opacity-70">{detail}</span>
           </motion.div>
        ))}
      </div>

      {/* --- Main Dashboard --- */}
      <div className="sim-main-layout">
        
        {/* LEFT COLUMN: Controls & Input */}
        <div className="flex flex-col gap-6">
          {/* Configuration Card */}
          <div className="sim-card">
            <div className="sim-card-header">
              <Plus className="text-cyan-400" />
              <h3 className="sim-card-title">Process Injection</h3>
            </div>
            
            <div className="sim-input-group">
              <label className="sim-label">Arrival Time (ms)</label>
              <input 
                type="number" 
                className="sim-input" 
                value={newArrival} 
                onChange={(e) => setNewArrival(e.target.value)} 
                placeholder="0" 
              />
            </div>
            <div className="sim-input-group">
              <label className="sim-label">Burst Time (ms)</label>
              <input 
                type="number" 
                className="sim-input" 
                value={newBurst} 
                onChange={(e) => setNewBurst(e.target.value)} 
                placeholder="5" 
              />
            </div>

            {algorithm === 'RR' && (
              <div className="sim-input-group">
                <label className="sim-label">Time Quantum</label>
                <input 
                  type="number" 
                  className="sim-input" 
                  value={quantum} 
                  onChange={(e) => setQuantum(parseInt(e.target.value))} 
                />
              </div>
            )}

            <button className="sim-btn-primary mt-4" onClick={addProcess}>
              Initialize Process
            </button>
          </div>

          {/* Active Process Table Card */}
          <div className="sim-card !p-0 overflow-hidden">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 flex items-center gap-2">
                  <Layers size={16} /> Stack Pool
                </h3>
                <span className="text-[0.6rem] bg-white/10 px-2 py-1 rounded text-dim font-bold">{processes.length} Active</span>
             </div>
             <div className="sim-table-container !border-0 !bg-transparent !rounded-none">
                <table className="sim-table">
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Arr</th>
                      <th>Burst</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {processes.map(p => (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                          <td className="font-mono">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }}></div> 
                              P{p.id}
                            </div>
                          </td>
                          <td className="text-dim">{p.arrivalTime}</td>
                          <td className="text-dim">{p.burstTime}</td>
                          <td className="text-right">
                            <button onClick={() => removeProcess(p.id)} className="btn-delete" title="Remove Process">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {processes.length === 0 && (
                      <tr><td colSpan="4" className="text-center py-8 text-dim opacity-40 text-xs uppercase tracking-widest">Buffer Empty</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Visualization */}
        <div className="flex flex-col gap-6">
          <div className="sim-card flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="sim-card-title mb-1">Execution Controller</h3>
                  <div className="text-[0.65rem] text-cyan-400 uppercase tracking-[0.2em] font-bold">● Live Kernel Stream</div>
               </div>
               
               <div className="sim-viz-controls">
                 <button className="sim-btn-icon" onClick={reset} title="Reset"><RotateCcw size={18} /></button>
                 <div className="w-[1px] h-8 bg-white/10 mx-1"></div>
                 <button className={`sim-btn-primary !w-auto !px-8 !py-3 ${isPlaying ? 'opacity-90' : ''}`} onClick={togglePlay}>
                    <div className="flex items-center gap-2">
                       {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                       {isPlaying ? 'Pause' : 'Run'}
                    </div>
                 </button>
               </div>
            </div>

            <GanttChart timeline={result?.timeline || []} />
            
            <div className="mt-auto pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="sim-label !mb-0">System Log Trace</span>
                    <div className="h-[2px] flex-grow bg-white/5"></div>
                  </div>
                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5 font-mono text-xs h-[100px] flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10"><Terminal size={40} /></div>
                    <div className="text-cyan-400 font-black mb-2 flex items-center gap-2">
                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                       TIME T = {currentLog?.time || 0}ms
                    </div>
                    <div className="text-gray-300 leading-relaxed tracking-tight">
                      {currentLog?.message || 'Ready for instruction. Add processes and hit Run.'}
                    </div>
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="sim-label !mb-0">Pipeline State</span>
                    <div className="h-[2px] flex-grow bg-white/5"></div>
                  </div>
                  <div className="flex justify-between items-center px-6 py-4 bg-white/[0.02] rounded-3xl border border-white/[0.04]">
                    <div className="flex flex-col items-center">
                      <span className="text-[0.6rem] text-dim font-bold uppercase mb-2">Queue Pool</span>
                      <div className="flex -space-x-2">
                        {currentLog?.readyQueue?.map(pid => (
                          <motion.div key={pid} layoutId={`p-${pid}`} className="w-9 h-9 rounded-full border-2 border-[#111] flex items-center justify-center text-[0.65rem] font-black shadow-lg" style={{ backgroundColor: processes.find(p => p.id === pid)?.color, color: 'white' }}>P{pid}</motion.div>
                        ))}
                        {(!currentLog?.readyQueue || currentLog.readyQueue.length === 0) && (
                          <div className="text-[0.65rem] text-dim italic opacity-50">Empty</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-[1px] h-10 bg-white/10"></div>

                    <div className="flex flex-col items-center">
                      <span className="text-[0.6rem] text-dim font-bold uppercase mb-2">Active Core</span>
                      <div className="flex items-center gap-3">
                        {currentLog?.cpu ? (
                          <motion.div layoutId={`p-${currentLog.cpu}`} className="w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10" style={{ backgroundColor: processes.find(p => p.id === currentLog.cpu)?.color, color: 'white' }}>
                            P{currentLog.cpu}
                          </motion.div>
                        ) : <div className="text-[0.65rem] text-dim font-bold opacity-30">IDLE</div>}
                        <Cpu size={16} className={currentLog?.cpu ? "text-success animate-spin-slow" : "text-dim opacity-30"} />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
          
          <AnimatePresence>
             {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                   <ResultTable results={result.results} avgTAT={result.avgTurnaroundTime} avgWT={result.avgWaitingTime} />
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
