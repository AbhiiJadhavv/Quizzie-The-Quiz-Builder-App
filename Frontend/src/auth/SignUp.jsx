import React, { useState } from 'react';
import '../styles/SignUp.css';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';

const Signup = ({ handleLoginClick }) => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials:true,
            });
            if(res.data.success){
                handleLoginClick();
                console.log("Registration Successful.");
                // toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            // setErrorMessage(error.response.data.message);
        }
    }

    return (
        <form className='signupForm' onSubmit={signupHandler}>
            <div>
                <div className='signupLabel'><p>Name</p></div>
                <div className='signupInput'>
                    <input
                        type='text'
                        value={input.name}
                        name='name'
                        onChange={changeEventHandler}
                    />
                </div>
            </div>
            <div>
                <div className='signupLabel'><p>Email</p></div>
                <div className='signupInput'>
                    <input
                        type='email'
                        value={input.email}
                        name='email'
                        onChange={changeEventHandler}
                    />
                </div>
            </div>
            <div>
                <div className='signupLabel'><p>Password</p></div>
                <div className='signupInput'>
                    <input
                        type='password'
                        value={input.password}
                        name='password'
                        onChange={changeEventHandler}
                    />
                </div>
            </div>
            <div>
                <div className='signupLabel'><p>Confirm Password</p></div>
                <div className='signupInput'>
                    <input
                        type='password'
                        value={input.confirmPassword}
                        name='confirmPassword'
                        onChange={changeEventHandler}
                    />
                </div>
            </div>
            <button type='submit'>Sign-Up</button>
        </form>
    )
}

export default Signup;