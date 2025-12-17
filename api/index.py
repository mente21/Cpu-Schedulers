from flask import Flask, request, jsonify
from flask_cors import CORS
from round_robin import Process, round_robin_scheduler

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        
        # Extract data
        processes_data = data.get('processes', [])
        quantum = int(data.get('quantum', 2))
        
        # Validation
        if not processes_data:
            return jsonify({"error": "No processes provided"}), 400
            
        # Convert to Process objects
        # Expecting input format: [{"pid": "P1", "arrival": 0, "burst": 10}, ...]
        input_processes = []
        for p in processes_data:
            pid = p.get('pid')
            arrival = int(p.get('arrival', 0))
            burst = int(p.get('burst', 0))
            input_processes.append(Process(pid, arrival, burst))
            
        # Run Scheduler
        completed_processes, log, timeline = round_robin_scheduler(input_processes, quantum)
        
        # Format results for JSON response
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
        return jsonify({"error": str(e)}), 500

# Vercel serverless function handler
# The app instance is automatically used by Vercel's Python runtime
