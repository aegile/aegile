import logging
import sys
import uvicorn

from fastapi import FastAPI
from src.api.routers.users import router as users_router
from src.api.routers.auth import router as auth_router

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


app.include_router(auth_router)
app.include_router(users_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)
