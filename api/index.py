from flask import Flask
from flask_restx import Api, Resource

app = Flask(__name__)
api = Api(app)

@api.route('/api/test')
class NewYear(Resource):
    def get(self):
        return Response("<h1>Happy New Year!</h1>", mimetype='text/html')

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"