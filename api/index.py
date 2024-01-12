from backend.src.extensions import db
from backend.src import create_app

app = create_app()
with app.app_context():
    db.drop_all()
    print(">>> creating tables")
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)

# from flask import Flask

# app = Flask(__name__)


# @app.route("/api/python")
# def hello_world():
#     return "<p>Hello, World!</p>"
