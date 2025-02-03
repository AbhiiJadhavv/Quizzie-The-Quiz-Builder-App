import React from 'react';
import '../styles/SharedQuiz.css';

const SharedQuiz = () => {
  return (
    <div className='quizPage'>
      <div className='quizPageContainer'>
        <div className='quizPageDiv1'>
          <div className='quizPageQuestionNo'><p>01/04</p></div>
          <div className='quizPageTimer'><p>00:10s</p></div>
        </div>
        <div className='quizPageQuestion'>
          <p>Your question text comes here, its a sample text.</p>
        </div>
        <div className='quizPageOptions'>
          <div>Option 1</div>
          <div>Option 2</div>
          <div>Option 3</div>
          <div>Option 4</div>
        </div>
        <div className='quizPageButton'>
          <button>NEXT</button>
        </div>
      </div>
    </div>
  )
}

export default SharedQuiz;