from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session, joinedload

from like_track.model import UserTrack as UT
from database import get_session
from player.model import Track
from users.model import User


class LikeTrack:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.db: Session = session
        self.like_track = UT

    async def add_like_track(self, user, track):
        try:
            user_id = await self.db.execute(select(User).filter(User.username == user))
            track_id = await self.db.execute(select(Track).filter(Track.name_track == track))
            self.data = self.like_track(tracks_id=track_id.unique().scalars().first().id,
                                        users_id=user_id.unique().scalars().first().id)
            self.db.add(self.data)
            await self.db.commit()
            return self.data
        except:
            raise HTTPException(status_code=404, detail="user or track not found")

    async def get_all_tracks(self, user):
        try:
            user_id = await self.db.execute(select(User).filter(User.username == user).options(joinedload(User.track)))
            return list(user_id.unique().scalars())[0].track
        except:
            raise HTTPException(status_code=404, detail="tracks not found")

    async def get_one_track(self, user, track):
        try:
            user_id = await self.db.execute(select(User).filter(User.username == user))
            track_id = await self.db.execute(select(Track).filter(Track.name_track == track))
            result_user_id = user_id.unique().scalars().first().id
            result_track_id = track_id.unique().scalars().first().id
            association_record = await self.db.execute(
                select(self.like_track).where(self.like_track.users_id == result_user_id, self.like_track.tracks_id
                                              == result_track_id)
            )
            association = association_record.unique().scalars().first()
            if association:
                return track
        except:
            raise HTTPException(status_code=404, detail="track not found")

    async def delete_track(self, user, track):
        try:
            user_id = await self.db.execute(select(User).filter(User.username == user))
            track_id = await self.db.execute(select(Track).filter(Track.name_track == track))
            result_user_id = user_id.unique().scalars().first().id
            result_track_id = track_id.unique().scalars().first().id
            association_record = await self.db.execute(
                select(self.like_track).where(self.like_track.users_id == result_user_id, self.like_track.tracks_id
                                              == result_track_id)
            )
            association = association_record.scalars().first()

            if association:
                # Delete the association record
                await self.db.delete(association)
                await self.db.commit()
                return "delete"

        except:
            raise HTTPException(status_code=404, detail="track not delete")

