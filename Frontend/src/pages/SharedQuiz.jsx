import React, { useEffect, useState } from 'react';
import '../styles/SharedQuiz.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QUIZ_API_END_POINT } from '../utils/constant';

const SharedQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`${QUIZ_API_END_POINT}/${quizId}`);
        setQuiz(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Quiz not found or an error occurred");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption) {
      setResponses(prevResponses => {
        const updatedResponses = [
          ...prevResponses,
          {
            questionId: quiz.questions[currentQuestionIndex]._id,
            selectedOptionId: selectedOption
          }
        ];

        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleSubmit(updatedResponses);  // Pass latest responses
        }

        return updatedResponses;  // Ensure state updates
      });

      setSelectedOption(null);
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const handleSubmit = async (finalResponses) => {
    console.log("Submitting responses:", finalResponses);  // Debug log

    if (!finalResponses || finalResponses.length === 0) {
      alert("No responses recorded. Please try again.");
      return;
    }

    try {
      await axios.post(`${QUIZ_API_END_POINT}/submit`, {
        quizId,
        answers: finalResponses
      });
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className='quizPage'>
      <div className='quizPageContainer'>
        <div className='quizPageDiv1'>
          <div className='quizPageQuestionNo'><p>{currentQuestionIndex + 1}/{quiz.questions.length}</p></div>
          <div className='quizPageTimer'><p>00:10s</p></div>
        </div>
        <div className='quizPageQuestion'>
          <p>{currentQuestion.question}</p>
        </div>
        <div className='quizPageOptions'>
          {currentQuestion.options.map(option => (
            <div
              key={option._id}
              onClick={() => handleOptionSelect(option._id)}
              className={`optionShared ${selectedOption === option._id ? 'activeOptionShared' : ''}`}
            >
              {currentQuestion.optionType === 'text' && <p>{option.text}</p>}
              {currentQuestion.optionType === 'imgUrl' && <img src={option.image} alt="option" />}
              {currentQuestion.optionType === 'textImg' && (
                <>
                  <p>{option.text}</p>
                  <div><img src={option.image} alt="option" /></div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className='quizPageButton'>
          <button onClick={handleNext}>
            {currentQuestionIndex === quiz.questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SharedQuiz;