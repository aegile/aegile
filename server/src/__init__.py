from contextlib import asynccontextmanager

from fastapi import FastAPI

from .config import settings
from .database import sessionmanager
from .api.routers.users import router as users_router
from .api.routers.auth import router as auth_router
from .api.routers.courses import router as courses_router
from .api.routers.assignments import router as assignments_router
from .api.routers.tutorials import router as tutorials_router
from .api.routers.projects import router as projects_router
from .api.routers.deliverables import router as deliverables_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Function that handles startup and shutdown events.
    To understand more, read https://fastapi.tiangolo.com/advanced/events/
    """
    yield
    if sessionmanager._engine is not None:
        # Close the DB connection
        await sessionmanager.close()


def create_app():
    app = FastAPI(
        lifespan=lifespan,
        version=settings.VERSION,
        title="aegile",
        description="REST AOPI Backend for aegile task management services.",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )
    app.include_router(auth_router)
    app.include_router(users_router)
    app.include_router(courses_router)
    app.include_router(assignments_router)
    app.include_router(tutorials_router)
    app.include_router(projects_router)
    app.include_router(deliverables_router)

    return app


app = create_app()
