from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base
from typing import TYPE_CHECKING
from like_track.model import UserTrack
if TYPE_CHECKING:
    from player.model import Track


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    track: Mapped[list["Track"]] = relationship(
        secondary="users_tracks",
        back_populates="user",
    )
