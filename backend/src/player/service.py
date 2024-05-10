import asyncio
import os
import threading
import time
import requests
from fastapi import Depends
from pytube import YouTube
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from starlette.responses import FileResponse

from database import get_session
from player.model import Track
from player.config import Variables
import audioread


variables = Variables()


class Player:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.db: Session = session
        self.track = Track

    def downloadImg(self, url):
        try:
            yt = YouTube(url)
            thumbnail_url = yt.thumbnail_url
            thumbnail_filename = fr'../image_tracks/{yt.title}.jpg'
            response = requests.get(thumbnail_url)
            with open(thumbnail_filename, 'wb') as f:
                f.write(response.content)
            return yt.title
        except:
            pass

    def download_tracks(self, url):
        try:
            yt = YouTube(url)
            stream = yt.streams.filter(only_audio=True).order_by("abr").desc().first()
            out_file = stream.download(output_path='../music')
            base, ext = os.path.splitext(out_file)
            new_file = base + '.mp3'
            os.rename(out_file, new_file)
            return yt.title
        except:
            pass

    async def upload_tracks_list(self, file):
        contents = file.file.read()
        for url in contents.decode('utf-8').split(' '):
            try:
                name = self.download_tracks(url)
                self.song = self.track(name_track=name, name_img=name, url_track=url)
                self.downloadImg(url)
                self.db.add(self.song)
                await self.db.commit()
                await self.db.refresh(self.song)
            except:
                pass

    async def start_player(self):
        result = await self.db.execute(select(Track).order_by())
        datas = result.scalars().all()
        while True:
            for data in datas:
                with audioread.audio_open(f'../music/{data.name_track}.mp3') as rf:
                    track_duration = rf.duration
                    print(data.name_track)
                variables.name = data.name_track
                variables.duration = track_duration
                variables.start_time = time.time()
                await asyncio.sleep(track_duration)


    def get_track(self, track):
        return FileResponse(path=f'../music/{track}.mp3', media_type="audio/mpeg")

    def response_data(self):
        seconds = int(time.time() - variables.start_time)
        data = [{"seconds": seconds, "name": variables.name, "duration": int(variables.duration)}]
        return data


    def get_image(self, name_img):
        return FileResponse(f'../image_tracks/{name_img}.jpg', media_type="image/jpeg")

