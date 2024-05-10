from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from typing import TYPE_CHECKING
from like_track.model import UserTrack

if TYPE_CHECKING:
    from users.model import User


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, index=True)
    name_track: Mapped[str] = mapped_column(unique=True, nullable=False)
    name_img: Mapped[str] = mapped_column(unique=True, nullable=False)
    url_track: Mapped[str] = mapped_column(unique=True, nullable=False)
    user: Mapped[list["User"]] = relationship(
        secondary="users_tracks",
        back_populates="track",
    )
