from src.extensions import db
from src import create_app

app = create_app()
with app.app_context():
    db.drop_all()
    print(">>> creating tables")
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
