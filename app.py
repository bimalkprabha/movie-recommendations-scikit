from flask import Flask,render_template,request
from flask.json import jsonify
from sqlalchemy import create_engine
import pandas as pd


app = Flask(__name__)

engine = create_engine('sqlite:///resources/data.db')

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello World!'


@app.route('/data')
def data():
    connection = engine.connect()
    df = pd.read_sql("SELECT * FROM info",connection)
    records = df.to_json(orient='records')
    return records

if __name__ == '__main__':
    app.run(debug=True)