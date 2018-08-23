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
    importance = db.Column(db.String(120),nullable = True)

@app.route('/',methods = ['GET'])
def index():
    return render_template('index.html',title = 'Todo List')

@app.route('/record',methods=['POST'])
def add_record():
    Event = request.form['event']
    record = Record(event = Event,importance = '2/30')
    db.session.add(record)
    db.session.commit()
    return render_template('index.html',title = 'Todo List'),200
    
    
@app.route('/record',methods=['GET'])
def get_records():
    records = Record.query.all()
    records_data = [
        {
            'id':record.id,
            'event':record.event,
            'importance':record.importance,
        }
        for record in records
    ]
    return jsonify(records_data),200
    
@app.route('/record/<int:record_id>',methods = ['GET'])
def get_record(record_id):
    record = (
        Record.query.filter_by(id = record_id).first()
    )
    record_data = {
        'id' : record.id,
        'event' : record.event,
        'importance' : record.importance,
    }
    return jsonify(record_data),200