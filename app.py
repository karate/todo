from tinydb import TinyDB, Query
from flask import Flask, request, abort, jsonify, render_template
import json

db = TinyDB('db.json')

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = jsonify(db.all())
    return tasks


@app.route('/api/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Query()
    db.remove(task.id == task_id)
    return "Deleting " + str(task_id)


@app.route('/api/status/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    if not request.json or 'status' not in request.json:
        abort(400)

    status = json.loads(request.json['status'])
    task = Query()
    db.update({'done': status}, task.id == task_id)
    return jsonify(status)


@app.route('/api/add', methods=['POST'])
def add_task():
    if not request.json or 'title' not in request.json:
        abort(400)

    task_count = len(db.all()) + 1

    task = {
        'id': task_count,
        'title': request.json['title'],
        'done': False
    }
    db.insert(task)
    return jsonify(task_count)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

