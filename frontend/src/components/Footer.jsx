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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Developed by</span>
            <span style={{ fontWeight: 'bold', color: '#00f2ff', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', textShadow: '0 0 10px rgba(0, 242, 255, 0.6)' }}>Mentesnot Debele (NSR/659/16)</span>
            <span style={{ fontWeight: 'bold', color: '#00f2ff', fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', textShadow: '0 0 10px rgba(0, 242, 255, 0.6)' }}>Biniyam Taye (NSR/190/16)</span>
            <p className="text-xs text-gray-600 uppercase tracking-widest" style={{ marginTop: '5px' }}>
              AMU 16 Batch 2018 E.C.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
