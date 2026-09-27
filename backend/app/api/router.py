"""Central API router — aggregates all sub-routers."""

from fastapi import APIRouter

from app.api.surveys import router as surveys_router
from app.api.detections import router as detections_router
from app.api.predictions import router as predictions_router
from app.api.maps import router as maps_router

api_router = APIRouter()

api_router.include_router(surveys_router, prefix="/surveys", tags=["Surveys"])
api_router.include_router(detections_router, prefix="/detections", tags=["Detections"])
api_router.include_router(predictions_router, prefix="/predictions", tags=["Predictions"])
api_router.include_router(maps_router, prefix="/maps", tags=["Maps"])
