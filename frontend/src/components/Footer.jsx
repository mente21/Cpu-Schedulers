import React from 'react';
import { Github, Heart, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-white/40 font-mono text-xs uppercase tracking-widest">
            <Code2 size={14} />
            <span>Process Scheduling Simulation Engine v2.0</span>
          </div>
          
          <div className="h-px w-24 bg-white/10"></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', maxWidth: 720 }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700' }}>About</p>
            <p style={{ color: '#cbd5e1', textAlign: 'center', margin: 0 }}>
              Schedulix — an interactive CPU scheduling simulator for visualizing and comparing scheduling
              algorithms such as Round Robin, FCFS, and SJF. Use the simulator to experiment with time
              quantum, arrival times, and priorities to understand scheduler behaviour and performance.
            </p>

            <div className="h-px w-24 bg-white/10 my-4"></div>

            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
              <strong style={{ color: '#ffffff' }}>Source:</strong>{' '}
              <a href="https://github.com/mente21/Cpu-Schedulers" target="_blank" rel="noopener noreferrer" style={{ color: '#7dd3fc', textDecoration: 'underline' }}>
                github.com/mente21/Cpu-Schedulers
              </a>
            </p>

            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '6px' }}>
              <span style={{ color: '#ffffff' }}>&copy; {new Date().getFullYear()} Schedulix</span>
              {' '}• Licensed under MIT
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
