import React, { useEffect, useState } from 'react';
import './style.css';
import YT from "../img/items/yt.png";
import Trash from "../img/items/trash.png";
const { REACT_APP_API_ENDPOINT } = process.env;
const Track = (props) => {
    const [imageData, setImageData] = useState(null);
    const openInNewTab = () => {
        window.open(props.data.url_track);
     };
    
    const deleteTrack = () => {
        props.delete(props.data.id);
    };
    
    useEffect(() => {
        const fetchImg = async () => {
            try {
              const response = await fetch(`${REACT_APP_API_ENDPOINT}/get_img/${props.data.name_img}`);
              const blob = await response.blob();
              setImageData(URL.createObjectURL(blob));
            } catch (error) {
            }
          };
        fetchImg();
    }, []);

    return (
        <div className='item'>
            <div className='item__label'>
                <img src={imageData} />
            </div>
            <div className='item__name'>
                <h1>{props.data.name_track}</h1>
            </div>
            <div className='item__icons'>
                <img src={YT} className='YT' onClick={openInNewTab}/>
                <img src={Trash} className='Trash' onClick={deleteTrack}/>
            </div>
        </div>
    );
};

export default Track;