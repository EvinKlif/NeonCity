import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Stor from "../img/storage.jpg";
import './style.css';
import Track from './Track';
import up from "../img/items/up.png"
import tg from "../img/items/tg.png"
import git from "../img/items/git.png"
import wp from "../img/items/wp.png"

const { REACT_APP_API_ENDPOINT } = process.env;
const Storage = (props) => {
    const [track, setTracks] = useState(null);

    const deleteTrack = (id) => {
        setTracks(track.filter((p) => p.id !== id));
        delete_like_track(id);
      };
    
    const openInNewTab = (url) => {
        window.open(url, "_blank", "noreferrer");
     };


    const delete_like_track = async (id) => {
    
        fetch(`${REACT_APP_API_ENDPOINT}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "tracks_id": track.filter((p) => p.id === id)[0].name_track,
                "users_id": localStorage.getItem('username')
            })
            })
            .then(data => {
                props.setDelLike(track);
            })
            .catch = (error) => {
            };
      };

    const handleWheel = (event) => {
        if(event.deltaY <= 0){
          props.pageCity();
          props.setAddorDel(false);
        }
      };
    

    
    useEffect(() => {
        const add_like_track = async () => {
            const user = localStorage.getItem('username');
                try {
                    const response = await fetch(`${REACT_APP_API_ENDPOINT}/get/${user}`);
                    const jsonData = await response.json();
                    setTracks(jsonData);
                  } catch (error) {
                    console.error('Error fetching data:', error);
                  }
                };

        add_like_track();
    }, [props.globalName, props.addOrDel]);


    
    return (
        <div className='stor' ref={props.refStorage} onWheel={handleWheel}>
            <img src={Stor} className='stor__img' />
            <div className='box__stor'>
                <div className='stor__box' onClick={props.pageCity}>
                    <img src={up} />
                </div>
            </div>
            <div className='box'>
                <div className='todo_list'>                    
                        <div className='todo_list_item'>
                        {(Array.isArray(track))? 
                            track.map ((data) => 
                                <Track delete={deleteTrack} key={data.id} data={data} />
                            ) 
                            : 
                            <div className='store__text'>
                            <p>
                            If you want to like your favorite tracks <br /> 
                            please <span className="color-span">register</span>  or <span className="color-span">log in</span> to your account
                            </p>
                            </div >
                        }
                        </div>
                </div>        
            </div>
            <div className='footer'>
            <h2>My contacts</h2>
                <div className='footer__links'>
                <Link target={"_blank"} to="https://wa.me/qr/USWFXD4TDBJRL1"><img src={wp}/></Link>
                <Link target={"_blank"} to="https://t.me/EvinKlif"><img src={tg}/></Link>
                <Link target={"_blank"} to="https://github.com/EvinKlif"><img src={git}/></Link>
                </div>
            </div>
        </div>
    );
};

export default Storage;