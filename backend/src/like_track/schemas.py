from pydantic import BaseModel


class LikeTrackSchemas(BaseModel):
    tracks_id: str
    users_id: str

class GetTrackSchemas(BaseModel):
    users_id: str