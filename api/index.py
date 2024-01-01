from flask import Flask, Response
from flask_restx import Api, Resource
from .models.user import User
from .extensions import db

app = Flask(__name__)
api = Api(app)

@api.route('/api/test')
class NewYear(Resource):
    def get(self):
        user = db.session.scalars(db.select(User)).one()
        return Response(f"<h1>User: {user.email}</h1>", mimetype='text/html')

@app.route("/api/python")
def hello_world():
    with app.app_context():
        db.session.add(User("John", "Doe", "john@email.com", "JohnDoe123!"))
        db.session.commit()
        user = db.session.scalars(db.select(User)).one()
        return f"<ph1>Hello {user.first_name}!</h1>"