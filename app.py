import json
import flask
from flask import Flask,request,jsonify,render_template,request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todolist.db'
app.config.setdefault('SQLALCHEMY_TRACK_MODIFICATIONS',True)

db = SQLAlchemy(app)
migrate = Migrate(app,db)

class Record(db.Model):
    id = db.Column(db.Integer,primary_key = True)
    event = db.Column(db.String(120),nullable = True)
    importance = db.Column(db.Integer,nullable = True)
    completed = db.Column(db.String(5),nullable = True)

@app.route('/',methods = ['GET'])
def index():
    return render_template('index.html',title = 'Todo List')

@app.route('/record',methods=['POST'])
def add_record():
    req_data = request.form
    record = Record(event = req_data['event'],importance = req_data['importance'],completed = req_data['completed'])
    db.session.add(record)
    db.session.commit()
    return "Creat Successfully",200
    
    
    

@app.route('/record',methods=['GET'])
def get_records():
    records = Record.query.all()
    records_data = [
        {
            'id':record.id,
            'event':record.event,
            'importance':record.importance,
            'completed':record.completed,
        }
        for record in records
    ]
    return jsonify(records_data),200
    
@app.route('/record/<int:record_id>',methods = ['GET'])
def get_record(record_id):
    record = (
        Record.query.filter_by(id = record_id).first()
    )
    #print(type(record))
    record_data = {
        'id' : record.id,
        'event' : record.event,
        'importance' : record.importance,
        'completed':record.completed,
    }
    
    return jsonify(record_data),200

@app.route('/record/<int:record_id>',methods = ['PUT'])
def edit_record(record_id):
    req_data = request.form
    record = Record.query.filter_by(id = record_id).first()
    if 'event' in list(req_data):
        record.event = req_data['event']
    if 'importance' in list(req_data):
        record.importance = req_data['importance']
    if 'completed' in list(req_data):
        record.completed = req_data['completed']
    db.session.add(record)
    db.session.commit()
    return 'Edit Succeeded',200


    

@app.route('/record/<int:record_id>',methods = ['DELETE'])
def delete_record(record_id):
    record = Record.query.filter_by(id=record_id).first()
    db.session.delete(record)
    db.session.commit()
    return 'Delete Succeeded', 200