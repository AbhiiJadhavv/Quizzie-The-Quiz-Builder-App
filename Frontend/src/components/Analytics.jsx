import React, { useState } from 'react';
import '../styles/Analytics.css';
import EditIcon from '../assets/EditIcon.png';
import DeleteIcon from '../assets/DeleteIcon.png';
import ShareIcon from '../assets/ShareIcon.png';
import TickIcon from '../assets/TickIcon.png';
import CrossCloseIcon from '../assets/CrossCloseIcon.png';
import DeleteQuizPopup from '../components/DeleteQuizPopup';

function Analytics({ setActiveTab }) {
  const [showDeleteQuizPopup, setShowDeleteQuizPopup] = useState(false);
  const [showAnalysisLinkToast, setShowAnalysisLinkToast] = useState(false);

  const openDeleteQuizPopup = () => {
    setShowDeleteQuizPopup(true);
  };

  const closeDeleteQuizPopup = () => {
    setShowDeleteQuizPopup(false);
  };

  const openAnalysisLinkToast = () => {
    setShowAnalysisLinkToast(true);
    setTimeout(() => {
      setShowAnalysisLinkToast(false);
    }, 3000);
  };

  const closeAnalysisLinkToast = () => {
    setShowAnalysisLinkToast(false);
  };

  return (
    <div className='analytics'>
      <div className='quizAnalysisCon'>
        <p>Quiz Analysis</p>
      </div>
      <div className='quizAnalysisDiv'>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created on</th>
              <th>Impression</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>01 Sep, 2023</td>
              <td>345</td>
              <td>
                <button><img src={EditIcon}/></button>
                <button onClick={openDeleteQuizPopup}><img src={DeleteIcon}/></button>
                <button onClick={openAnalysisLinkToast}><img src={ShareIcon}/></button>
              </td>
              <td><button onClick={() => setActiveTab('questionAnalysis')}><u>Question Wise Analysis</u></button></td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>01 Sep, 2023</td>
              <td>345</td>
              <td>
                <button><img src={EditIcon}/></button>
                <button><img src={DeleteIcon}/></button>
                <button><img src={ShareIcon}/></button>
              </td>
              <td><button onClick={() => setActiveTab('questionAnalysis')}><u>Question Wise Analysis</u></button></td>
            </tr>
          </tbody>
        </table>
      </div>
      {showDeleteQuizPopup && (
        <DeleteQuizPopup closeDeletePopup={closeDeleteQuizPopup} />
      )}
      {showAnalysisLinkToast && (
        <div className='analysisLinkToast'>
          <img src={TickIcon}/>
          <p>Link copied to Clipboard</p>
          <div><button onClick={closeAnalysisLinkToast}><img src={CrossCloseIcon}/></button></div>
        </div>
      )}
    </div>
  )
}

export default Analytics;