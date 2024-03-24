import logging
import sys
import uvicorn

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse
from src.api.routers.users import router as users_router
from src.api.routers.auth import router as auth_router
from src.api.routers.courses import router as courses_router
from src.api.routers.assignments import router as assignments_router

# from src.config import settings
# from src.database import sessionmanager

logging.basicConfig(
    stream=sys.stdout, level=logging.INFO
)  # if settings.debug_logs else logging.INFO)


app = FastAPI(
    # lifespan=lifespan,
    # title=settings.project_name,
    docs_url="/api/docs",
)


# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):
#     print(exc)
#     return PlainTextResponse("e", status_code=400)


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(assignments_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)
