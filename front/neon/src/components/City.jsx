import { useMemo,  React, forwardRef, useState, useEffect  } from 'react';
import './style.css'
import City_Bg from "../img/city.png"
import City_1 from "../img/city1.png"
import City_2 from "../img/city2.png"
import City_3 from "../img/city3.png"
import Visualizer from './Visualizer';
import up from "../img/items/up.png";
import down from "../img/items/down.png";

const City = (props) => {
    const root = useMemo(() => document.querySelector(":root"));
    

    const pH = (e) =>{
        const x = (e.clientX - window.innerWidth / 2) / 100;
        const y = (e.clientY - window.innerHeight / 2) / 100;
        root.style.setProperty("--posX", -x);
        root.style.setProperty("--posY", -y);
    }
        
      
    const handleWheel = (event) => {
    if(event.deltaY <= 0){
      props.pagePlanet();
    }else{
        props.pageStorage();
        props.setAddorDel(true);
    }
  };


    return (
        <div className="section" ref={props.refCity} onWheel={handleWheel}>
            <div className='up__box_box'>
                <div className='up__box' onClick={props.pagePlanet}>
                    <img src={up} />
                </div>
            </div>
        <div className='parallax__container' onMouseMove={pH} >
            <div className='parallax__bg' >
                <img className='parallax__img' src={City_Bg}/>
                <img className='parallax__img1' src={City_1}/>
                <img className='parallax__img2' src={City_2}/>
                <img className='parallax__img3' src={City_3}/>
                <Visualizer globalName={props.globalName} delLike={props.delLike}/>        
                <div className='box__down_city'>
                    <div className='down_city' onClick={props.pageStorage}>
                        <img src={down} />
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default forwardRef(City);