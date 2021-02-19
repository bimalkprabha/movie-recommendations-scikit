from flask import Flask,render_template,request
from flask.json import jsonify
app = Flask(__name__)

from sqlalchemy import create_engine
import pandas as pd

# for pandas reqd_sql
engine = create_engine('sqlite:///resources/data.db')
# connection = engine.connect()

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