import React, { useState } from 'react';
import '../styles/CreateQuizPopup.css';

function CreateQuizPopup({ setShowCreateQuiz, setShowCreateQuiz2, setQuizData }) {
  const [quizName, setQuizName] = useState('');
  const [activeButton, setActiveButton] = useState('');

  const handleQnaClick = () => {
    setActiveButton('qna');
  };

  const handlePollTypeClick = () => {
    setActiveButton('poll');
  };

  const handleContinue = () => {
    if (quizName && activeButton) {
      setQuizData({
        name: quizName,
        type: activeButton,
        questions: [], // Initialize an empty array for questions to be filled later
      });
      setShowCreateQuiz2(true);
    } else {
      alert('Please provide a quiz name and select a quiz type.');
    }
  };

  return (
    <div className='createQuizPopupContainer'>
      <div className='createQuizPopup'>
        <input
          type="text"
          id="input"
          placeholder='Quiz name'
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />
        <div className='createQuizTypeCon'>
          <p>Quiz Type</p>
          <button onClick={handleQnaClick} className={activeButton === 'qna' ? 'active' : ''}>Q & A</button>
          <button onClick={handlePollTypeClick} className={activeButton === 'poll' ? 'active' : ''}>Poll Type</button>
        </div>
        <div className='createQuizButtonsCon'>
          <button className='createQuizCancelBtn' onClick={() => setShowCreateQuiz(false)}>Cancel</button>
          <button className='createQuizContinueBtn' onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default CreateQuizPopup;
