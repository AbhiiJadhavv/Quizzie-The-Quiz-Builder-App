import React, { useState } from 'react';
import '../styles/ShareQuizPopup.css';
import CrossCloseIcon2 from '../assets/CrossCloseIcon2.png';
import CrossCloseIcon from '../assets/CrossCloseIcon.png';
import TickIcon from '../assets/TickIcon.png';

function ShareQuizPopup({ setShowShareQuiz, sharingQuiz }) {
  const [showAnalysisLinkToast, setShowAnalysisLinkToast] = useState(false);
  const [hideCrossButton, setHideCrossButton] = useState(true);

  const openAnalysisLinkToast = () => {
    setShowAnalysisLinkToast(true);
    setHideCrossButton(false);
    setTimeout(() => {
      setShowAnalysisLinkToast(false);
      setHideCrossButton(true);
    }, 3000);
  };

  const closeAnalysisLinkToast = () => {
    setShowAnalysisLinkToast(false);
    setHideCrossButton(true);
  };

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/sharedquiz/${sharingQuiz._id}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        console.log("Link copied to clipboard");
        openAnalysisLinkToast();
      })
      .catch(() => {
        console.log("Failed to copy link");
      });
  }

  return (
    <div className='quizLinkSharePopupContainer'>
      <div className='quizLinkSharePopup'>
        <div className='quizlinkShareClose'>
          {hideCrossButton && (
            <button onClick={() => setShowShareQuiz(false)}><img src={CrossCloseIcon2} /></button>
          )}
          {showAnalysisLinkToast && (
            <div className='createShareLinkToast'>
              <img src={TickIcon} />
              <p>Link copied to Clipboard</p>
              <div><button onClick={closeAnalysisLinkToast}><img src={CrossCloseIcon} /></button></div>
            </div>
          )}
        </div>
        <div className='quizLinkShareInfo'>
          <p>Congrats your Quiz is<br />Published!</p>
          <input type="text" id="input" placeholder='your link is here' readOnly>{shareableLink}</input>
          <button onClick={handleShare}>Share</button>
        </div>
      </div>
    </div>
  )
}

export default ShareQuizPopup;