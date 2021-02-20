from flask import Flask,render_template,request
from flask.json import jsonify
from sqlalchemy import create_engine
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


app = Flask(__name__)

engine = create_engine('sqlite:///resources/data.db')

from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/data')
def data():
    connection = engine.connect()
    df = pd.read_sql("SELECT * FROM info",connection)
    records = df.to_json(orient='records')
    return records


@app.route('/ml/<movie_name>')
def ml(movie_name="Harry Potter and the Half-Blood Prince"):
    connection = engine.connect()
    df = pd.read_sql("SELECT * FROM info",connection)
    features = ['keywords', 'cast', 'genres', 'director']

    for feature in features:
        df[feature] = df[feature].fillna('')
    def combined_features(row):
        return row['keywords']+" "+row['cast']+" "+row['genres']+" "+row['director']
    df["combined_features"] = df.apply(combined_features, axis =1)
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(df["combined_features"])
    # print("Count Matrix:", count_matrix.toarray())
    cosine_sim = cosine_similarity(count_matrix)
    records = df.to_json(orient='records')
    movie_user_likes = movie_name

    def get_index_from_title(title):
        value = df.index[df['title'] == title].tolist()
        return value[0]
    movie_index = get_index_from_title(movie_user_likes)
    similar_movies = list(enumerate(cosine_sim[movie_index]))
# similar_movies
    sorted_similar_movies = sorted(similar_movies, key=lambda x:x[1], reverse=True)
# sorted_similar_movies
    recommnedations =[]
    def get_title_from_index(index):
        recommnedations.append(df[df.index == index]["title"].values[0])
    for movie in sorted_similar_movies:
        get_title_from_index(movie[0])
    # print(recommnedations[0:15])
    return jsonify(recommnedations[1:15])

if __name__ == '__main__':
    app.run(debug=True)