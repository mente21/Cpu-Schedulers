import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const GanttChart = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '200px', 
        color: '#94a3b8', 
        fontStyle: 'italic',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '1rem',
        border: '1px dashed rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <BarChart3 size={48} style={{ opacity: 0.2 }} />
          <span>Simulation timeline will be rendered here...</span>
        </div>
      </div>
    );
  }

  const totalDuration = timeline[timeline.length - 1].end;
  
  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px' }} className="custom-scrollbar">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '0.8rem', 
          fontWeight: 900, 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: 'var(--primary, #00f2ff)' 
        }}>Process Execution Timeline</h4>
        
        <div style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
           <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'white' }}>
             Total Span: <span style={{ color: 'var(--primary, #00f2ff)' }}>{totalDuration}ms</span>
           </span>
        </div>
      </div>

      {/* Timeline Track Container - FORCED HORIZONTAL FLEX */}
      <div style={{ 
          position: 'relative', 
          paddingTop: '10px', 
          paddingBottom: '40px', 
          minWidth: '100%' 
      }}>
        <div style={{ 
            display: 'flex',              // CRITICAL: Forces Flexbox
            flexDirection: 'row',         // CRITICAL: Forces Horizontal Row
            flexWrap: 'nowrap',           // CRITICAL: Prevents Wrapping
            alignItems: 'center',
            height: '60px',
            minWidth: `${Math.max(100, totalDuration * 50)}px`,
            gap: '2px'
        }}>
          <AnimatePresence>
            {timeline.map((block, idx) => {
              const width = ((block.end - block.start) / totalDuration) * 100;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  style={{
                    width: `${width}%`,
                    height: '100%',
                    backgroundColor: block.id === 'IDLE' ? 'transparent' : block.color,
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    flexShrink: 0, // Prevent blocks from squishing
                    boxShadow: block.id === 'IDLE' ? 'none' : '0 4px 6px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Process ID */}
                  {block.id !== 'IDLE' && (
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 900, 
                      color: 'white', 
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      zIndex: 10
                    }}>P{block.id}</span>
                  )}

                  {/* Start Time Marker (Bottom Left) */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: '-30px', 
                    left: 0, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                  }}>
                    <div style={{ width: '1px', height: '10px', backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
                      {block.start}
                    </span>
                  </div>

                  {/* End Time Marker (Removed for last block as requested) */}
                  {/* We only show end marker if it creates a gap or is distinct, but simpliest is just NO end marker on the blocks, 
                      since the Start of Next = End of Current.
                      The user specifically hated the 'Total Span' (end time) in the last box. 
                  */}
                  
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {/* Baseline Line */}
        <div style={{ position: 'absolute', bottom: '30px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', zIndex: -1 }}></div>
      </div>
    </div>
  );
};

export default GanttChart;
