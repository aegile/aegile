from src.extensions import db
from src import create_app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()

    app.run(debug=True, port=5000)
