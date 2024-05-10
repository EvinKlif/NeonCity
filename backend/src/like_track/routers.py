from fastapi import APIRouter, Depends, UploadFile, File

from like_track.service import LikeTrack
from like_track.schemas import LikeTrackSchemas, GetTrackSchemas


like_track_router = APIRouter(tags=["like_track"])


@like_track_router.post('/add_like_track')
async def add_track(data: LikeTrackSchemas, menu: LikeTrack = Depends()):
    return await menu.add_like_track(data.users_id, data.tracks_id)


@like_track_router.get('/get/{user}')
async def get_all_tracks(user: str, menu: LikeTrack = Depends()):
    return await menu.get_all_tracks(user)


@like_track_router.delete('/delete')
async def delete_track(data: LikeTrackSchemas, menu: LikeTrack = Depends()):
    return await menu.delete_track(data.users_id, data.tracks_id)


@like_track_router.post('/get_like_track')
async def delete_track(data: LikeTrackSchemas, menu: LikeTrack = Depends()):
    return await menu.get_one_track(data.users_id, data.tracks_id)