import React, { useState } from 'react';
import '../styles/SignUp.css';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                navigate("/");
                console.log("Login Successful.");
                // toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            // setErrorMessage(error.response?.data?.message);
        }
    };

    return (
        <form className='signupForm' onSubmit={loginHandler}>
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
            <button type='submit' className='loginBtn'>Log In</button>
        </form>
    )
}

export default Login;