import React, { useEffect, useState } from "react";
import Like from "../img/items/like.png";
import NotLike from "../img/items/not_like.png";
const { REACT_APP_API_ENDPOINT } = process.env;

const LikeSound = (props) => {
  const [likesound, setLikeSound] = useState(false);
  const add_like_track = async () => {
    
    fetch(`${REACT_APP_API_ENDPOINT}/add_like_track`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "tracks_id": localStorage.getItem('track_name'),
            "users_id": localStorage.getItem('username')
        })
        })
};

const delete_like_track = async () => {
    
  fetch(`${REACT_APP_API_ENDPOINT}/delete`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "tracks_id": localStorage.getItem('track_name'),
          "users_id": localStorage.getItem('username')
      })
      })
};

  const addLike = () => {
    if(!likesound){
      setLikeSound(true);
      add_like_track();
    }else{
      setLikeSound(false);
      delete_like_track();
    };
     
  };


  useEffect(() =>{
    const add_like_track = async () => {
      setLikeSound(false);
      const user = localStorage.getItem('username');
      try{
        fetch(`${REACT_APP_API_ENDPOINT}/get_like_track`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "tracks_id": localStorage.getItem('track_name'),
            "users_id": localStorage.getItem('username')
        })
        })
        .then(response => response.json())
        .then(data => {
          if(data === localStorage.getItem('track_name')){
            setLikeSound(true);
          }
        })
      }catch{

      }
  };
    add_like_track();
  },[props.name, props.globalName, props.delLike]);

  return (
    <div>
      { localStorage.getItem('username')?
          <div className="like" onClick={addLike}>
          {
            likesound?<img src={Like} className="like__img" />:<img src={NotLike} className="like__img" />
          }
      </div> :
        <img src={NotLike} className="like__img" />
      }
    </div>
  );
};
export default LikeSound;
