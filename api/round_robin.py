from collections import deque  
class Process:
    def __init__(self, pid, arrival, burst):
        self.pid, self.arrival, self.burst = pid, arrival, burst
        self.remaining, self.completion, self.turnaround, self.waiting = burst, 0, 0, 0

def calculate_rr(processes, quantum):
    processes.sort(key=lambda x: x.arrival)
    queue, time, completed, log, timeline = deque(), 0, [], [], []
    

    def add_arrived():
        for p in [p for p in processes if p.arrival <= time ]:
            queue.append(p)
          

    add_arrived()
    while len(completed) < len(processes):
        if not queue:
            time = min(p.arrival for p in processes)
            add_arrived()
            continue

        p = queue.popleft()
        run = min(quantum, p.remaining)
        log.append(f"Time {time}-{time + run}: {p.pid}")
        timeline.append({"pid": p.pid, "start": time, "end": time + run})
        
        time += run
        p.remaining -= run
        add_arrived()
        
        if p.remaining > 0: queue.append(p)
        else:
            p.completion = time
            p.turnaround = p.completion - p.arrival
            p.waiting = p.turnaround - p.burst
            completed.append(p)
            log.append(f"Time {time}: {p.pid} FINISHED")

    return completed, log, timeline
