from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.middleware.cors import CORSMiddleware
from like_track.routers import like_track_router
from users.routers import user_router
from player.routers import player_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(player_router)

app.include_router(user_router)

app.include_router(like_track_router)







