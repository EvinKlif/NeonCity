from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from users.model import User
    from player.model import Track

class UserTrack(Base):
    __tablename__ = "users_tracks"

    id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, index=True)

    tracks_id: Mapped[int] = mapped_column(
        ForeignKey("tracks.id", ondelete="CASCADE"),
        primary_key=True
    )

    users_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )
    __table_args__ = (
        UniqueConstraint('tracks_id', 'users_id', name='unique_users_tracks'),
    )