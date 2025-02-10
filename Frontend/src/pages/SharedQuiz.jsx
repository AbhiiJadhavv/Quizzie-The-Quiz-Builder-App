import React, { useEffect, useState } from 'react';
import '../styles/SharedQuiz.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { QUIZ_API_END_POINT } from '../utils/constant';
import TrophyImage from '../assets/TrophyImage.png';

const SharedQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [score, setScore] = useState(0);

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
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const selectedOptionData = currentQuestion.options.find(opt => opt._id === selectedOption);
        const isCorrect = selectedOptionData?.nature === 'correct'; // Check correctness

        const updatedResponses = [
          ...prevResponses,
          {
            questionId: currentQuestion._id,
            selectedOptionId: selectedOption,
            isCorrect: isCorrect // Store correctness
          }
        ];

        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleSubmit(updatedResponses);  // Pass latest responses
        }

        return updatedResponses;
      });

      setSelectedOption(null);
    } else {
      alert("Please select an option before proceeding.");
    }
  };

  const handleSubmit = async (finalResponses) => {
    console.log("Submitting responses:", finalResponses);

    if (!finalResponses || finalResponses.length === 0) {
      alert("No responses recorded. Please try again.");
      return;
    }

    const correctAnswers = finalResponses.filter(response => response.isCorrect).length;
    setScore(correctAnswers);

    try {
      await axios.post(`${QUIZ_API_END_POINT}/submit`, {
        quizId,
        answers: finalResponses
      });
      console.log("Quiz submitted successfully!");
      setShowCongrats(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz");
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className='quizPage'>
      {
        !showCongrats ? (
          <div className='quizPageContainer'>
            <div className='quizPageDiv1'>
              <div className='quizPageQuestionNo'><p>0{currentQuestionIndex + 1}/0{quiz.questions.length}</p></div>
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
        ) : (
          <div className='quizPageContainer2'>
            <p className='quizPagePara'>Congrats Quiz Is Completed</p>
            <img src={TrophyImage} alt='Trophy Image' />
            <div><p className='quizPagePara'>Your Score is&nbsp;</p><p className='quizPageScore'> 0{score}/0{quiz.questions.length}</p></div>
          </div>
        )
      }
    </div>
  )
}

export default SharedQuiz;