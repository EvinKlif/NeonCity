import React, { useState } from 'react';
const { REACT_APP_API_ENDPOINT } = process.env;
const Register = (props) => {
    const [err, setErr] = useState('');
    const [name, setName] = useState('');

    const backMenu =() => {
        props.register_form(false);
        props.change_form();
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name){
            setErr('Enter your name')
        }else{
        fetch(`${REACT_APP_API_ENDPOINT}/add_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": name
            })
            })
            .then(res => res.json())
            .then(data => {
                if(data.detail){
                    setErr(data.detail);
                }else{
                    backMenu();
                }
            })
            .catch = (error) => {
            };
    }};

    const press = (e) => {
        if(e.key === "Enter"){
            handleSubmit(e);
        }
    };

    return (
        <div className='register'>
            <form className='form_box' onSubmit={handleSubmit} onKeyDown={press}>
                <button onClick={backMenu} >Menu</button>
                <div className='input_box'>
                    {
                        err ? <div className='err'>{err}</div>: null
                    }
                    <input type='text' placeholder='UserName' onChange={(e) => setName(e.target.value)} value={name}/>
                </div>
                <button type="submit" className='sumbit'>Register</button>
            </form>
        </div>
    );
};

export default Register;