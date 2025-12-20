
export const simulate = (processes, quantum = Infinity, algorithm = 'RR') => {
  // Deep copy and sort by arrival time
  let pool = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: -1,
    completionTime: 0,
    turnaroundTime: 0,
    waitingTime: 0,
    isStarted: false
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let readyQueue = [];
  let finishedProcesses = [];
  let timeline = [];
  let log = [];
  
  // Track active process for Gantt chart continuity
  let lastProcessId = null;

  while (pool.length > 0 || readyQueue.length > 0) {
    // 1. Move arrived processes to Ready Queue
    while (pool.length > 0 && pool[0].arrivalTime <= currentTime) {
      const p = pool.shift();
      readyQueue.push(p);
      log.push({ time: currentTime, message: `Process ${p.id} arrived.` });
    }

    // 2. Scheduler Logic (Selection)
    let currentProcess = null;

    if (readyQueue.length > 0) {
      // Sorting Strategy
      if (algorithm === 'SJF') {
        // NON-PREEMPTIVE SJF: Sort by Burst Time (Remaining Time at start is Burst Time)
        // We only resort the queue; we do NOT interrupt running processes in this model.
        readyQueue.sort((a, b) => {
          if (a.remainingTime !== b.remainingTime) return a.remainingTime - b.remainingTime;
          if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
          return a.id - b.id;
        });
      }
      // FCFS / RR: Queue order
      
      currentProcess = readyQueue[0]; 
    }

    // 3. Handling IDLE state
    if (!currentProcess) {
       if (pool.length > 0) {
         const nextArrival = pool[0].arrivalTime;
         timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival });
         currentTime = nextArrival;
         continue;
       } else {
         break; // Done
       }
    }

    // 4. Execution Step Calculation
    // Non-Preemptive Default: Run until completion
    let timeSlice = currentProcess.remainingTime; 
    let interruptReason = 'COMPLETE';

    // RR Logic Exception: Time Quantum
    if (algorithm === 'RR') {
       if (quantum < timeSlice) {
         timeSlice = quantum;
         interruptReason = 'QUANTUM';
       }
    }

    // 5. Execute
    if (!currentProcess.isStarted) {
      currentProcess.isStarted = true;
      currentProcess.startTime = currentTime;
    }
    
    if (lastProcessId !== currentProcess.id) {
       log.push({ 
         time: currentTime, 
         message: `Process ${currentProcess.id} started execution.`,
         cpu: currentProcess.id,
         readyQueue: readyQueue.map(p => p.id)
       });
    }

    // Add to timeline
    if (timeline.length > 0 && timeline[timeline.length-1].id === currentProcess.id) {
        timeline[timeline.length-1].end += timeSlice;
    } else {
        timeline.push({
            id: currentProcess.id,
            start: currentTime,
            end: currentTime + timeSlice, // Tentative end
            color: currentProcess.color
        });
    }

    // Advance Clock (Atomic Step)
    // We must advance time and check arrivals if we were actually stepping, 
    // but for non-preemptive logic we can just jump.
    // However, to capture correct "Arrival" logs in the timeline if we jump t=0 to t=5,
    // we should ideally loop. But for simplicity/standard log, jumping is fine.
    // We just need to ingest arrivals that happened *during* the jump before the next selection.
    
    currentTime += timeSlice;
    currentProcess.remainingTime -= timeSlice;
    lastProcessId = currentProcess.id;

    // 6. Post-Execution Cleanup
    
    // Remove current from queue
    readyQueue.shift(); 

    if (currentProcess.remainingTime <= 0) {
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        finishedProcesses.push(currentProcess);
        log.push({ time: currentTime, message: `Process ${currentProcess.id} finished.` });
        lastProcessId = null; 
    } else {
        // Process still alive (RR case)
        if (interruptReason === 'QUANTUM') {
             // In RR, new arrivals usually go to back of queue BEFORE the current process is re-added?
             // Or after? Standard RR puts returned process at the END.
             // We must check arrivals relative to the NEW currentTime before pushing back.
             
             // Move any newly arrived processes to readyQueue
             while (pool.length > 0 && pool[0].arrivalTime <= currentTime) {
                const p = pool.shift();
                readyQueue.push(p);
                log.push({ time: p.arrivalTime, message: `Process ${p.id} arrived.` });
             }
             
             readyQueue.push(currentProcess);
             log.push({ time: currentTime, message: `Process ${currentProcess.id} time slice expired.` });
        }
    }
    
    // Catch-up arrivals for Non-Preemptive cases where we jumped forward
    while (pool.length > 0 && pool[0].arrivalTime <= currentTime) {
      const p = pool.shift();
      readyQueue.push(p);
      log.push({ time: p.arrivalTime, message: `Process ${p.id} arrived.` });
    }
  }

  return {
    results: finishedProcesses.sort((a, b) => a.id - b.id),
    timeline,
    log,
    avgTurnaroundTime: finishedProcesses.reduce((acc, p) => acc + p.turnaroundTime, 0) / finishedProcesses.length || 0,
    avgWaitingTime: finishedProcesses.reduce((acc, p) => acc + p.waitingTime, 0) / finishedProcesses.length || 0
  };
};
