import React, { useState } from 'react';
import '../styles/Form.css';
import Signup from '../auth/Signup';
import Login from '../auth/Login';

const Form = ({ setUser }) => {
  const [showLogin, setShowLogin] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeButton, setActiveButton] = useState('login');

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignUp(false);
    setActiveButton('login');
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setShowLogin(false);
    setActiveButton('signUp');
  };

  return (
    <div className='loginPage'>
      <div className='container'>
        <div className='logo'>
          <p>QUIZZIE</p>
        </div>
        <div className='buttons'>
          <button onClick={handleSignUpClick} className={activeButton === 'signUp' ? 'active' : ''}>Sign Up</button>
          <button onClick={handleLoginClick} className={activeButton === 'login' ? 'active' : ''}>Log In</button>
        </div>
        <div className='form'>
          {showSignUp && <Signup handleLoginClick={handleLoginClick} />}
          {showLogin && <Login setUser={setUser} />}
        </div>
      </div>
    </div>
  )
}

export default Form;