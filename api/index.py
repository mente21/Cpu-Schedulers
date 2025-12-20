from flask import Flask, request, jsonify
from flask_cors import CORS
from round_robin import Process, calculate_rr

app = Flask(__name__)
CORS(app)

@app.route('/api/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        procs = [Process(p['pid'], int(p['arrival']), int(p['burst'])) for p in data.get('processes', [])]
        completed, log, timeline = calculate_rr(procs, int(data.get('quantum', 2)))
        return jsonify({
            "results": [vars(p) for p in completed],
            "log": log,
            "timeline": timeline
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/health')
def health(): return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
