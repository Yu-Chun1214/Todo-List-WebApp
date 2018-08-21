import json
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
    deadline = db.Column(db.String(120),nullable = True)

@app.route('/',methods = ['GET'])
def index():
    return render_template('index.html',title = 'Todo List')

@app.route('/record',methods=['POST'])
def add_record():
    Event = request.form['event']
    record = Record(event = Event,deadline = '2/30')
    db.session.add(record)
    db.session.commit()
    return Event,200
    
    # return render_template('index.html',title = 'Todo List')
