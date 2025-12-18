import React, { useState } from 'react';
import { Cpu, Code } from 'lucide-react';
import ProcessForm from './components/ProcessForm';
import SchedulerResults from './components/SchedulerResults';
import AboutSection from './components/AboutSection';
import { simulateRoundRobin } from './api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSimulate = async (processes, quantum) => {
    setLoading(true);
    setError(null);
    try {
      const result = await simulateRoundRobin(processes, quantum);
      setData(result);
    } catch (err) {
      const errorMessage = err.response 
        ? `Backend Error (${err.response.status}): ${err.response.data?.error || err.message}`
        : `Network Error: ${err.message}. Check if your Vercel logs show any build errors for the backend.`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'white', 
            padding: '1rem', 
            borderRadius: '1rem', 
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1rem'
        }}>
            <Cpu size={48} color="var(--primary)" />
        </div>
        <h1>Round Robin Scheduler</h1>
        <p style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>
            Operating Systems Scheduling Algorithm Visualizer
        </p>
      </header>



      <AboutSection />

      <ProcessForm onSimulate={handleSimulate} />

      {loading && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Calculating Schedule...</div>
          </div>
      )}
      
      {error && (
        <div className="card" style={{ 
            border: '1px solid #fca5a5', 
            backgroundColor: '#fef2f2', 
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {data && (
        <SchedulerResults 
          results={data.results} 
          log={data.log} 
          timeline={data.timeline} 
        />
      )}



      <footer className="credits" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--secondary)' }}>Developed by</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span className="gradient-text">Mentesnot (NSR/659/16)</span>
            <span style={{ color: 'var(--border-color)' }}>&</span>
            <span className="gradient-text">Biniyam (NSR/190/16)</span>
            <span style={{ color: 'var(--border-color)', margin: '0 0.5rem' }}>|</span>
            <Code xml:space="preserve" size={20} color="var(--primary)" />
        </div>
      </footer>
    </div>
  );
}

export default App;
