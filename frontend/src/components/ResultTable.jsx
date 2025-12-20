import React from 'react';
import './Simulator.css'; // Ensure we have access to shared styles

const ResultTable = ({ results, avgTAT, avgWT }) => {
  return (
    <div className="sim-card flex flex-col gap-6">
      <div className="sim-card-header !mb-0 !pb-4 border-b border-white/5">
        <h3 className="sim-card-title">Simulation Metrics</h3>
      </div>
      
      <div className="sim-table-container">
        <table className="sim-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Completion</th>
              <th>Turnaround</th>
              <th>Waiting</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td className="font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }}></div>
                    <span style={{ color: r.color }}>P{r.id}</span>
                </td>
                <td>{r.arrivalTime}</td>
                <td>{r.burstTime}</td>
                <td>{r.completionTime}</td>
                <td>{r.turnaroundTime}</td>
                <td>{r.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="p-5 rounded-2xl bg-[rgba(0,242,255,0.05)] border border-[rgba(0,242,255,0.2)] flex flex-col justify-center">
          <div className="text-[0.65rem] text-[rgba(0,242,255,0.8)] uppercase font-bold tracking-widest mb-2">Avg. Turnaround Time</div>
          <div className="text-3xl font-black text-[#00f2ff] drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">{avgTAT.toFixed(2)} ms</div>
        </div>
        <div className="p-5 rounded-2xl bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.2)] flex flex-col justify-center">
          <div className="text-[0.65rem] text-[rgba(112,0,255,0.8)] uppercase font-bold tracking-widest mb-2">Avg. Waiting Time</div>
          <div className="text-3xl font-black text-[#7000ff] drop-shadow-[0_0_10px_rgba(112,0,255,0.3)]">{avgWT.toFixed(2)} ms</div>
        </div>
      </div>
    </div>
  );
};

export default ResultTable;
