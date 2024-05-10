import { React, useState } from "react";
import Space from "../video/planet.mp4";
import "./style.css";
import LikeSound from "./LikeSound";
import Register from "./Register";
import Login from "./Login";
import down from "../img/items/down.png"

const Planet = (props) => {
  const [form, setForm] = useState(true);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const change_form = () => {
    setForm(!form)
  };
  
  const login_form = () => {
    change_form();
    setLogin(true);
  };

  const register_form = () => {
    change_form();
    setRegister(true);
  };
  
  const handleWheel = (event) => {
    if(event.deltaY >= 0){
      props.pageCity()
    }
  };

  return (
    <div className="mainVideo" onWheel={handleWheel} ref={props.refPlanet}>
      <video src={Space} autoPlay muted loop />
      <div className="effect"></div>
      <div className="header">
        <h1>NeonCity</h1>
      </div>
      <div className="content">
        <h2>Welcome</h2>
        <span> to </span>
        <h1>NeonCity</h1>
        <p>
        If you want to like your favorite tracks <br /> 
        please <span className="color-span">register</span>  or <span className="color-span">log in</span> to your account <br/>
        Just listen to music, scroll down
        </p>
      </div>
      {form ? <div className="button_content">
        <button onClick={register_form}>Register</button>
        <button onClick={login_form}>Logi in </button>
      </div> : null}
      {register ? <Register change_form={change_form} register_form={setRegister}/> : null}
      {login ? <Login GN={props.GN} change_form={change_form} login_form={setLogin}/> : null}
      <div className='down__box' onClick={props.pageCity}>
          <img src={down} />
      </div>
    </div>
  );
};

export default Planet;
