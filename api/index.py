from werkzeug.security import generate_password_hash
from backend.src.extensions import db
from backend.src import create_app
from backend.src.models.user import User

app = create_app()
with app.app_context():
    db.drop_all()
    print(">>> creating tables")
    db.create_all()
    user = User(
        "Lex", "Xu", "z5555555@ad.unsw.edu.au", generate_password_hash("AlexXu123!")
    )
    db.session.add(user)
    db.session.commit()
    print(db.session.execute(db.select(User)).all())

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# from flask import Flask

# app = Flask(__name__)


# @app.route("/api/python")
# def hello_world():
#     return "<p>Hello, World!</p>"
