from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from player.service import Player

player_router = APIRouter(tags=["player"])


@player_router.post('/upload_tracks')
async def add_track(menu: Player = Depends(), file: UploadFile = File(...)):
    return await menu.upload_tracks_list(file)


@player_router.get('/start_player')
async def thread_start_player(background_tasks: BackgroundTasks, menu: Player = Depends()):
    return background_tasks.add_task(menu.thread_start_player())


@player_router.get('/get_track/{track}')
async def get_track(track: str, menu: Player = Depends()):
    return menu.get_track(track)


@player_router.get('/info_data')
async def get_data(menu: Player = Depends()):
    return menu.response_data()

@player_router.get('/get_img/{name_img}')
async def get_img(name_img: str, menu: Player = Depends()):
    return menu.get_image(name_img)

