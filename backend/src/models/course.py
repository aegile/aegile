from src.extensions import db


class Course(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(8), nullable=False, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"<Course {self.code=} {self.name=}>"


class CourseOffering(db.Model):
    code = db.Column(db.String(8), db.ForeignKey("course.code"), primary_key=True)
    term = db.Column(db.String(4), primary_key=True)
