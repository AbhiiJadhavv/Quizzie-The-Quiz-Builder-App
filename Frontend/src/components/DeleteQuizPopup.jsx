import React from 'react';
import '../styles/DeleteQuizPopup.css';

function DeleteQuizPopup({ closeDeletePopup }) {
  return (
    <div className='deleteQuizPopupCon'>
      <div className='deleteQuizPopup'>
        <div className='areYouConfirm'><p>Are you confirm you<br/>want to delete ?</p></div>
        <div className='confirmDeleteCon'>
          <button className='confirmDeleteButton'>Confirm Delete</button>
          <button className='cancelDeleteButton' onClick={closeDeletePopup}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteQuizPopup;