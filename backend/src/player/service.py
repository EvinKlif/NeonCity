import asyncio
import os
import subprocess
import threading
import time
import requests
import youtube_dl
import yt_dlp
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

    # def download_tracks(self, url):
    #     yt = YouTube(url)
    #     stream = yt.streams.filter(only_audio=True).order_by("abr").desc().first()
    #     out_file = stream.download(output_path='../music')
    #     base, ext = os.path.splitext(out_file)
    #     new_file = base + '.mp3'
    #     os.rename(out_file, new_file)
    #     return yt.title


    def download_audio(self, yt_url):
        try:
            ydl_opts = {
                'format': 'bestaudio/best',  # Choose the best audio quality
                'outtmpl': '../music/%(title)s.%(ext)s',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',  # Set preferred audio quality
                }],
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([yt_url])

        except:
            pass


    async def upload_tracks_list(self, file):
        contents = file.file.read()
        for url in contents.decode('utf-8').split(' '):
            try:
                self.download_audio(url)
                name = self.downloadImg(url)
                self.song = self.track(name_track=name, name_img=name, url_track=url)
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
                rf.close()

    def thread_start_player(self):
        asyncio.create_task(self.start_player())

    def get_track(self, track):
        return FileResponse(path=f'../music/{track}.mp3', media_type="audio/mpeg")

    def response_data(self):
        seconds = int(time.time() - variables.start_time)
        data = [{"seconds": seconds, "name": variables.name, "duration": int(variables.duration)}]
        return data


    def get_image(self, name_img):
        return FileResponse(f'../image_tracks/{name_img}.jpg', media_type="image/jpeg")

