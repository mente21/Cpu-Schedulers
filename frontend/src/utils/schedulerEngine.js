/**
 * Core Scheduling Engine
 * Simulates CPU scheduling algorithms (RR, FCFS, SJF)
 */
export const simulate = (processes, quantum = Infinity, algorithm = 'RR') => {
  // 1. Initialize simulation pool and tracking variables
  let pool = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime,
    startTime: -1,
    isStarted: false
  })).sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let readyQueue = [];
  let finishedProcesses = [];
  let timeline = [];
  let log = [];
  let lastProcessId = null;

  // 2. Main Simulation Loop (Discrete Event Simulation)
  while (pool.length > 0 || readyQueue.length > 0) {
    
    // STEP A: Arrival Handling
    // Move all processes that have "arrived" by currentTime into the Ready Queue
    while (pool.length > 0 && pool[0].arrivalTime <= currentTime) {
      const p = pool.shift();
      readyQueue.push(p);
      log.push({ time: currentTime, message: `P${p.id} joined the ready queue.` });
    }

    // STEP B: Idle Handling
    // If nothing is ready, jump the clock to the next arrival
    if (readyQueue.length === 0) {
      const nextArrival = pool[0].arrivalTime;
      timeline.push({ id: 'IDLE', start: currentTime, end: nextArrival });
      currentTime = nextArrival;
      continue;
    }

    // STEP C: Selection (Algorithm Logic)
    if (algorithm === 'SJF') {
      readyQueue.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
    }
    
    let currentProcess = readyQueue[0];

    // STEP D: Execution Calculation
    let timeSlice = currentProcess.remainingTime;
    if (algorithm === 'RR' && quantum < timeSlice) {
      timeSlice = quantum;
    }

    // Start tracking for first-time execution
    if (!currentProcess.isStarted) {
      currentProcess.isStarted = true;
      currentProcess.startTime = currentTime;
    }

    // Log CPU start
    if (lastProcessId !== currentProcess.id) {
      log.push({ 
        time: currentTime, 
        message: `P${currentProcess.id} started execution on Core.`,
        cpu: currentProcess.id,
        readyQueue: readyQueue.map(p => p.id)
      });
    }

    // Record usage in Gantt timeline
    timeline.push({
      id: currentProcess.id,
      start: currentTime,
      end: currentTime + timeSlice,
      color: currentProcess.color
    });

    // STEP E: Advance State
    currentTime += timeSlice;
    currentProcess.remainingTime -= timeSlice;
    lastProcessId = currentProcess.id;
    readyQueue.shift(); // Remove from front

    // STEP F: Completion or Re-queue
    if (currentProcess.remainingTime <= 0) {
      // Process Finished: Calculate Metrics
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      finishedProcesses.push(currentProcess);
      log.push({ time: currentTime, message: `P${currentProcess.id} completed task.` });
      lastProcessId = null;
    } else {
      // Process Interrupted (Round Robin): Move to back after new arrivals
      while (pool.length > 0 && pool[0].arrivalTime <= currentTime) {
        const p = pool.shift();
        readyQueue.push(p);
        log.push({ time: p.arrivalTime, message: `P${p.id} joined the ready queue.` });
      }
      readyQueue.push(currentProcess);
      log.push({ time: currentTime, message: `P${currentProcess.id} time slice expired.` });
    }
  }

  // 3. Return Final Simulation Payload
  return {
    results: finishedProcesses.sort((a, b) => a.id - b.id),
    timeline,
    log,
    avgTurnaroundTime: finishedProcesses.reduce((acc, p) => acc + p.turnaroundTime, 0) / finishedProcesses.length || 0,
    avgWaitingTime: finishedProcesses.reduce((acc, p) => acc + p.waitingTime, 0) / finishedProcesses.length || 0
  };
};
