# from werkzeug.security import generate_password_hash
# from backend.src.extensions import db
# from backend.src import create_app
# from backend.src.models.user import User

# app = create_app()
# with app.app_context():
#     db.drop_all()
#     print(">>> creating tables")
#     db.create_all()
#     user1 = User(
#         "Lex", "Xu", "z5555555@ad.unsw.edu.au", generate_password_hash("AlexXu123!")
#     )
#     user2 = User(
#         "Sam", "Yu", "z1555555@ad.unsw.edu.au", generate_password_hash("SamYu123!")
#     )
#     user3 = User(
#         "Philip",
#         "Tran",
#         "z2555555@ad.unsw.edu.au",
#         generate_password_hash("PhilipTran123!"),
#     )
#     user4 = User(
#         "Jordan",
#         "Shen",
#         "z3555555@ad.unsw.edu.au",
#         generate_password_hash("JordanShen123!"),
#     )
#     user5 = User(
#         "Vivian",
#         "Zhang",
#         "z4555555@ad.unsw.edu.au",
#         generate_password_hash("VivanZhang123!"),
#     )
#     db.session.add_all([user1, user2, user3, user4, user5])
#     db.session.commit()
#     print(db.session.execute(db.select(User)).all())

# if __name__ == "__main__":
#     app.run(debug=True, port=5000)

# # from flask import Flask

# # app = Flask(__name__)


# # @app.route("/api/python")
# # def hello_world():
# #     return "<p>Hello, World!</p>"

# ==============================================================================

# import logging
# import sys
# import uvicorn

# from fastapi import FastAPI
# from server.src.api.routers.users import router as users_router
# from server.src.api.routers.auth import router as auth_router
# from server.src.api.routers.courses import router as courses_router
# from server.src.api.routers.assignments import router as assignments_router
# from server.src.api.routers.tutorials import router as tutorials_router
# from server.src.api.routers.projects import router as projects_router
# from server.src.api.routers.deliverables import router as deliverables_router

# # from src.config import settings
# # from src.database import sessionmanager

# logging.basicConfig(
#     stream=sys.stdout, level=logging.INFO
# )  # if settings.debug_logs else logging.INFO)


# app = FastAPI(
#     # lifespan=lifespan,
#     # title=settings.project_name,
#     docs_url="/api/docs",
# )


# # @app.exception_handler(RequestValidationError)
# # async def validation_exception_handler(request, exc):
# #     print(exc)
# #     return PlainTextResponse("e", status_code=400)


# app.include_router(auth_router)
# app.include_router(users_router)
# app.include_router(courses_router)
# app.include_router(assignments_router)
# app.include_router(tutorials_router)
# app.include_router(projects_router)
# app.include_router(deliverables_router)


# @app.get("/api/hello")
# async def hello_world():
#     return {"message": "Hello World"}

# ==============================================================================

from fastapi import FastAPI

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


@app.get("/api/py/hello")
def hello_world():
    return {"message": "Hello World"}
