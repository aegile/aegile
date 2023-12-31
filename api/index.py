from flask import Flask
from flask_restx import Api, Resource

app = Flask(__name__)
api = Api(app)

@api.route('/api/test')
class NewYear(Resource):
    def get(self):
        return "<p>Happy New Year!</p>"

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"