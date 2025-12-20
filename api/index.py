from flask import Flask, request, jsonify
from flask_cors import CORS
from round_robin import Process, calculate_rr

app = Flask(__name__)
CORS(app)

class Process:
    def __init__(self, pid, arrival_time, burst_time):
        self.pid = pid
        self.arrival_time = arrival_time
        self.burst_time = burst_time
        self.remaining_time = burst_time
        self.completion_time = 0
        self.turnaround_time = 0
        self.waiting_time = 0

def round_robin_scheduler(processes, time_quantum):
    processes.sort(key=lambda x: x.arrival_time)
    ready_queue = collections.deque()
    current_time = 0
    completed_processes = []
    execution_log = []
    timeline_data = []
    
    added_to_queue = {p.pid: False for p in processes}
    
    def add_arrived_processes(current_time):
        for p in processes:
            if p.arrival_time <= current_time and not added_to_queue[p.pid]:
                ready_queue.append(p)
                added_to_queue[p.pid] = True

    add_arrived_processes(0)
    
    while len(completed_processes) < len(processes):
        if not ready_queue:
            next_arrival = float('inf')
            for p in processes:
                if not added_to_queue[p.pid]:
                    next_arrival = min(next_arrival, p.arrival_time)
            
            if next_arrival == float('inf'):
                break
                
            current_time = next_arrival
            add_arrived_processes(current_time)
            continue

        current_process = ready_queue.popleft()
        run_time = min(time_quantum, current_process.remaining_time)
        start_exec = current_time
        current_time += run_time
        current_process.remaining_time -= run_time
        
        execution_log.append(f"Time {start_exec:3d} - {current_time:3d}: Process {current_process.pid} runs")
        timeline_data.append({"pid": current_process.pid, "start": start_exec, "end": current_time})

        add_arrived_processes(current_time)
        
        if current_process.remaining_time > 0:
            ready_queue.append(current_process)
        else:
            current_process.completion_time = current_time
            current_process.turnaround_time = current_process.completion_time - current_process.arrival_time
            current_process.waiting_time = current_process.turnaround_time - current_process.burst_time
            completed_processes.append(current_process)
            execution_log.append(f"Time {current_time:3d}       : Process {current_process.pid} FINISHED")

    return completed_processes, execution_log, timeline_data

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route('/api/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        processes_data = data.get('processes', [])
        quantum = int(data.get('quantum', 2))
        
        if not processes_data:
            return jsonify({"error": "No processes provided"}), 400
            
        input_processes = []
        for p in processes_data:
            pid = p.get('pid')
            arrival = int(p.get('arrival', 0))
            burst = int(p.get('burst', 0))
            input_processes.append(Process(pid, arrival, burst))
            
        completed_processes, log, timeline = round_robin_scheduler(input_processes, quantum)
        
        results = []
        for p in completed_processes:
            results.append({
                "pid": p.pid,
                "arrival": p.arrival_time,
                "burst": p.burst_time,
                "completion": p.completion_time,
                "turnaround": p.turnaround_time,
                "waiting": p.waiting_time
            })
            
        return jsonify({
            "results": results,
            "log": log,
            "timeline": timeline
        })

    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

if __name__ == '__main__':
    app.run(debug=True)
