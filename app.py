from tinydb import TinyDB, Query
from flask import Flask, request, abort, jsonify, render_template

db = TinyDB('db.json')

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():    
    tasks =  jsonify(db.all())
    return tasks

@app.route('/api/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    Task = Query()
    db.remove(Task.id == task_id)
    return "Deleting " + str(task_id)

@app.route('/api/add', methods=['POST'])
def add_task():
    if not request.json or not 'title' in request.json:
        abort(400)

    task_count = len(db.all()) + 1;

    task = {
        'id': task_count,
        'title': request.json['title'],
        'done': False
    }
    db.insert(task)
    return jsonify(task_count)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')