import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, Pause, RotateCcw, Trash2, Cpu, Activity, Clock, Layers, Terminal } from 'lucide-react';
import { simulate } from '../utils/schedulerEngine';
import GanttChart from './GanttChart';
import ResultTable from './ResultTable';
import './Simulator.css';

const COLORS = ['#00f2ff', '#7000ff', '#ff007a', '#00ff88', '#ffb800', '#ff4d4d', '#00d1ff', '#9d00ff'];

// --- SUB-COMPONENT: Data In (Inputs & Controls) ---
const ProcessInput = ({ algorithm, quantum, setQuantum, onAdd, onRun, onReset, isPlaying, hasResult }) => {
  const [arrival, setArrival] = useState('');
  const [burst, setBurst] = useState('');

  const handleAdd = () => {
    if (!arrival || !burst) return;
    onAdd(parseInt(arrival), parseInt(burst));
    setArrival('');
    setBurst('');
  };

  return (
    <div className="sim-card">
      <div className="sim-card-header">
        <Plus className="text-cyan-400" />
        <h3 className="sim-card-title">Process Injection</h3>
      </div>
      
      <div className="sim-input-group">
        <label className="sim-label">Arrival / Burst Time (ms)</label>
        <div className="flex gap-2">
          <input type="number" className="sim-input" value={arrival} onChange={e => setArrival(e.target.value)} placeholder="0" />
          <input type="number" className="sim-input" value={burst} onChange={e => setBurst(e.target.value)} placeholder="5" />
        </div>
      </div>

      {algorithm === 'RR' && (
        <div className="sim-input-group">
          <label className="sim-label">Time Quantum</label>
          <input type="number" className="sim-input" value={quantum} onChange={e => setQuantum(parseInt(e.target.value))} />
        </div>
      )}

      <button className="sim-btn-primary mt-4 mb-6" onClick={handleAdd}>Initialize Process</button>

      <div className="h-px bg-white/5 my-6"></div>

      <div className="flex justify-between items-center">
        <button className="sim-btn-icon" onClick={onReset} title="Reset Simulation"><RotateCcw size={18} /></button>
        <button className={`sim-btn-primary !w-auto !px-10 !py-3 ${isPlaying ? 'opacity-90' : ''}`} onClick={onRun}>
          <div className="flex items-center gap-2">
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isPlaying ? 'Pause' : hasResult ? 'Resume' : 'Run Kernel'}
          </div>
        </button>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: Data Out (Visualization & Logs) ---
const SimulationView = ({ timeline, currentLog, processes }) => {
  return (
    <div className="sim-card flex flex-col min-h-[500px]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="sim-card-title mb-1">Execution View</h3>
          <div className="text-[0.65rem] text-cyan-400 uppercase tracking-[0.2em] font-bold">● Active Stream</div>
        </div>
      </div>

      <GanttChart timeline={timeline} />
      
      <div className="mt-auto pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5">
        {/* Step-by-Step System Logs */}
        <div className="flex flex-col gap-4">
          <span className="sim-label !mb-0 text-[0.6rem] opacity-50 uppercase tracking-widest">System Log Trace</span>
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 font-mono text-xs h-[100px] flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Terminal size={30} /></div>
            <div className="text-cyan-400 font-bold mb-1">TIME T = {currentLog?.time || 0}ms</div>
            <div className="text-gray-300">{currentLog?.message || 'Ready. Click Run Kernel to start.'}</div>
          </div>
        </div>

        {/* Real-time Pipeline & CPU State */}
        <div className="flex flex-col gap-4">
          <span className="sim-label !mb-0 text-[0.6rem] opacity-50 uppercase tracking-widest">Pipeline State</span>
          <div className="flex justify-between items-center px-6 py-4 bg-white/[0.02] rounded-3xl border border-white/[0.04]">
            <div className="flex flex-col items-center">
              <span className="text-[0.5rem] text-dim font-bold uppercase mb-2">Queue</span>
              <div className="flex -space-x-2">
                {currentLog?.readyQueue?.map(pid => (
                  <motion.div key={pid} layoutId={`p-${pid}`} className="w-8 h-8 rounded-full border-2 border-[#111] flex items-center justify-center text-[0.6rem] font-black" style={{ backgroundColor: processes.find(p => p.id === pid)?.color }}>P{pid}</motion.div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center border-l border-white/10 pl-6">
              <span className="text-[0.5rem] text-dim font-bold uppercase mb-2">CPU Core</span>
              <div className="flex items-center gap-2">
                {currentLog?.cpu ? (
                  <motion.div layoutId={`p-${currentLog.cpu}`} className="w-9 h-9 rounded-xl flex items-center justify-center font-black" style={{ backgroundColor: processes.find(p => p.id === currentLog.cpu)?.color }}>P{currentLog.cpu}</motion.div>
                ) : <span className="text-[0.65rem] opacity-20">IDLE</span>}
                <Cpu size={14} className={currentLog?.cpu ? "text-success animate-spin-slow" : "opacity-20"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: Orchestrator ---
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

  const addProcess = (arrivalTime, burstTime) => {
    const nextId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([...processes, { id: nextId, arrivalTime, burstTime, color: COLORS[nextId % COLORS.length] }]);
    setResult(null);
  };

  const calculate = () => {
    const res = simulate(processes, algorithm === 'RR' ? quantum : Infinity, algorithm);
    setResult(res);
    setCurrentStep(0);
  };

  const togglePlay = () => {
    if (!result) calculate();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying && result && currentStep < result.log.length - 1) {
      timerRef.current = setTimeout(() => setCurrentStep(prev => prev + 1), 800);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStep, result]);

  const algoInfo = {
    RR: { title: "Round Robin", desc: "Fair distribution via time slices.", details: ["PREEMPTIVE", "TIME-SHARING"] },
    FCFS: { title: "FCFS", desc: "Standard arrival order execution.", details: ["NON-PREEMPTIVE", "SIMPLE"] },
    SJF: { title: "Shortest Job First", desc: "Throughput optimization via shortest cycle.", details: ["GREEEDY", "THROUGHPUT"] }
  }[algorithm];

  return (
    <div className="simulator-container">
      <div className="sim-bg-mesh" />
      
      {/* 1. Header Area */}
      <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="sim-header-section">
        <div className="sim-badge">● System Module</div>
        <h1 className="sim-page-title">{algoInfo.title}</h1>
        <p className="sim-page-desc">{algoInfo.desc}</p>
      </motion.section>

      {/* 2. Main Dashboard Layout */}
      <div className="sim-main-layout">
        <div className="flex flex-col gap-6">
          <ProcessInput 
            algorithm={algorithm} 
            quantum={quantum} setQuantum={setQuantum} 
            onAdd={addProcess} onRun={togglePlay} onReset={() => { setIsPlaying(false); setResult(null); setCurrentStep(0); }} 
            isPlaying={isPlaying} hasResult={!!result}
          />

          {/* Process Pool Table */}
          <div className="sim-card !p-0 overflow-hidden">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 flex items-center gap-2"><Layers size={14} /> Pool</h3>
                <span className="text-[0.6rem] bg-white/10 px-2 py-1 rounded text-dim font-bold">{processes.length} Active</span>
             </div>
             <div className="sim-table-container !border-0 !bg-transparent !rounded-none">
                <table className="sim-table">
                  <thead><tr><th>PID</th><th>Arr</th><th>Burst</th><th></th></tr></thead>
                  <tbody>
                    {processes.map(p => (
                      <tr key={p.id}>
                        <td><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }}></div> P{p.id}</div></td>
                        <td className="text-dim">{p.arrivalTime}</td>
                        <td className="text-dim">{p.burstTime}</td>
                        <td className="text-right"><button onClick={() => setProcesses(processes.filter(x => x.id !== p.id))} className="btn-delete"><Trash2 size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* 3. Output Visualization */}
        <div className="flex flex-col gap-6">
          <SimulationView 
            timeline={result?.timeline || []} 
            currentLog={result?.log[currentStep] || null} 
            processes={processes} 
          />
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ResultTable results={result.results} avgTAT={result.avgTurnaroundTime} avgWT={result.avgWaitingTime} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
