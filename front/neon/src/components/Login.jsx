import React, { useState } from 'react';
const { REACT_APP_API_ENDPOINT } = process.env;
const Login = (props) => {
    const [err, setErr] = useState('');
    const [name, setName] = useState('');
    const [login, setLogin] = useState(true)

    const backMenu =() => {
        props.login_form(false);
        props.change_form();
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch(`${REACT_APP_API_ENDPOINT}/get_user/${name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.detail){
            setErr("User not found")
        }else{
            localStorage.setItem('username', data);
            props.GN(data);
            setErr("");
            setLogin(false);
        }
      });
  };


  const press = (e) => {
    if(e.key === "Enter"){
        handleSubmit(e);
    }
};

  return (
    <div className='register'>
        {login ?     <form className='form_box' type="submit" onSubmit={handleSubmit} onKeyDown={press}>
        <button onClick={backMenu} >Menu</button>
        <div className='input_box'>
            {
                err ? <div className='err'>{err}</div>: null
            }
            <input type='text' placeholder='UserName' onChange={(e) => setName(e.target.value)} value={name}/>
        </div>
        <button type="submit" className='sumbit'>Log in</button>
    </form> : 
        <div className='login_box'>
            <h2>Welcome</h2><br/>
            <h1>{name}</h1>
        </div>}
    </div>
  );
};

export default Login;
