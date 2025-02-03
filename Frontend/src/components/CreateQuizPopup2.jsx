import React, { useState } from 'react';
import '../styles/CreateQuizPopup2.css';
import PlusIcon from '../assets/PlusIcon.png';
import CrossCloseIcon from '../assets/CrossCloseIcon.png';
import OptionDeleteIcon from '../assets/OptionDeleteIcon.png';
import axios from "axios";
import { QUIZ_API_END_POINT } from '../utils/constant';
import { fetchDashboardData } from '../utils/dashboardData';

function CreateQuizPopup2({ setShowCreateQuiz, setShowCreateQuiz2, setShowShareQuiz, quizData, setQuizData, user, setSharingQuiz, setDashboardData }) {
    const [questions, setQuestions] = useState([
        { id: 1, text: '', optionType: 'text', options: [{ id: 1, text: '', image: '' }, { id: 2, text: '', image: '' }], correctOption: '', timer: 'off' }
    ]);
    const [activeQuestionId, setActiveQuestionId] = useState(1); // Tracks the active question
    const [errors, setErrors] = useState([]);

    const handleAddQuestion = () => {
        if (questions.length < 5) {
            setQuestions([
                ...questions,
                { id: questions.length + 1, text: '', optionType: 'text', options: [{ id: 1, text: '', image: '' }, { id: 2, text: '', image: '' }], correctOption: '', timer: 'off' }
            ]);
            setActiveQuestionId(questions.length + 1); // Automatically show the newly added question
        }
    };

    const handleDeleteQuestion = (id) => {
        const updatedQuestions = questions.filter(q => q.id !== id)
            .map((question, index) => ({ ...question, id: index + 1 }));
        setQuestions(updatedQuestions);

        // Adjust active question
        if (id === activeQuestionId) {
            setActiveQuestionId(updatedQuestions[0]?.id || null);
        } else if (id < activeQuestionId) {
            setActiveQuestionId(prev => prev - 1);
        }
    };

    const handleOptionTypeChange = (questionId, value) => {
        setQuestions(questions.map(q => q.id === questionId ? { ...q, optionType: value } : q));
    };

    const handleQuestionTextChange = (questionId, text) => {
        setQuestions(questions.map(q => q.id === questionId ? { ...q, text } : q));
    };

    const handleAddOption = (questionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId && q.options.length < 4) {
                return { ...q, options: [...q.options, { id: q.options.length + 1, text: '', image: '' }] };
            }
            return q;
        }));
    };

    const handleRemoveOption = (questionId, optionId) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const updatedOptions = q.options.filter(option => option.id !== optionId)
                    .map((option, index) => ({ ...option, id: index + 1 }));
                return { ...q, options: updatedOptions };
            }
            return q;
        }));
    };

    const handleTimerChange = (questionId, timer) => {
        setQuestions(
            questions.map((q) => (q.id === questionId ? { ...q, timer } : q))
        );
    };

    const validateQuiz = () => {
        const newErrors = [];

        questions.forEach((question, qIndex) => {
            if (!question.text.trim()) {
                newErrors.push(`Question ${qIndex + 1} must have a question text.`);
            }
            if (question.options.length < 2) {
                newErrors.push(`Question ${qIndex + 1} must have at least 2 options.`);
            }
            question.options.forEach((option, oIndex) => {
                if (question.optionType === 'text' && !option.text.trim()) {
                    newErrors.push(`Option ${oIndex + 1} in Question ${qIndex + 1} must have text.`);
                }
                if (question.optionType === 'imgUrl' && !option.image.trim()) {
                    newErrors.push(`Option ${oIndex + 1} in Question ${qIndex + 1} must have an image URL.`);
                }
                if (question.optionType === 'textImg' && (!option.text.trim() || !option.image.trim())) {
                    newErrors.push(`Option ${oIndex + 1} in Question ${qIndex + 1} must have both text and image URL.`);
                }
            });
            if (quizData.type === 'qna' && !question.correctOption) {
                newErrors.push(`Question ${qIndex + 1} must have a correct option selected.`);
            }
        });
        setErrors(newErrors);
        return newErrors.length === 0; // Return true if no errors
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();

        if (!validateQuiz()) {
            alert("Please fix the errors before creating the quiz.");
            return;
        }

        const formattedQuestions = questions.map((q) => {
            const formattedOptions = q.options.map((opt, index) => ({
                text: opt.text || '',
                image: opt.image || '',
                nature: quizData.type === 'qna' && index + 1 === q.correctOption ? 'correct' : 'incorrect',
            }));

            return {
                question: q.text,
                optionType: q.optionType || 'text',
                options: formattedOptions,
                timer: q.timer || 'off',
            };
        });

        const fullQuizData = {
            name: quizData.name,
            type: quizData.type,
            questions: formattedQuestions,
            user: user._id,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${QUIZ_API_END_POINT}/create`, fullQuizData, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.status === 201) {
                alert('Quiz created successfully!');
                setSharingQuiz(response.data.quiz);
                fetchDashboardData(setDashboardData);
            }
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Error creating quiz. Please try again.');
        } finally {
            setShowCreateQuiz2(false);
            setShowCreateQuiz(false);
            setShowShareQuiz(true);
        }
    };
    
    return (
        <div className='createQuizPopup2Container'>
            <div className='createQuizPopup2'>

                {/* Questions List */}
                <div className='addQuestionsCon'>
                    <div className='addQuestions'>
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className={`questionNo ${activeQuestionId === question.id ? 'active' : ''}`}
                                onClick={() => setActiveQuestionId(question.id)}
                            >
                                <span>{index + 1}</span>
                                {index > 0 && (
                                    <button className='deleteQuestionBtn' onClick={(e) => {
                                        e.stopPropagation(); // Prevent question selection
                                        handleDeleteQuestion(question.id);
                                    }}>
                                        <img src={CrossCloseIcon} alt='Delete question' />
                                    </button>
                                )}
                            </div>
                        ))}
                        {questions.length < 5 && (
                            <button className='addQuestionsBtn' onClick={handleAddQuestion}>
                                <img src={PlusIcon} alt='Add question' />
                            </button>
                        )}
                    </div>
                    <p>Max 5 questions</p>
                </div>

                {/* Question Input and Options */}
                {questions.map(question => (
                    activeQuestionId === question.id && (
                        <div key={question.id} className='questionContainer'>
                            <input
                                type="text"
                                className='createQuizQuestionInput'
                                placeholder={`${quizData.type === 'qna' ? 'QnA' : 'Poll'} Question`}
                                value={question.text}
                                onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                            />

                            <div className='optionTypeCon'>
                                <p>Option Type</p>
                                <div>
                                    <input type="radio" id="text" name={`optionType${question.id}`} value="text" checked={question.optionType === 'text'} onChange={(e) => handleOptionTypeChange(question.id, e.target.value)} />
                                    <label htmlFor="text">Text</label>
                                </div>
                                <div>
                                    <input type="radio" id="imgUrl" name={`optionType${question.id}`} value="imgUrl" checked={question.optionType === 'imgUrl'} onChange={(e) => handleOptionTypeChange(question.id, e.target.value)} />
                                    <label htmlFor="imgUrl">Image URL</label>
                                </div>
                                <div>
                                    <input type="radio" id="textImg" name={`optionType${question.id}`} value="textImg" checked={question.optionType === 'textImg'} onChange={(e) => handleOptionTypeChange(question.id, e.target.value)} />
                                    <label htmlFor="textImg">Text & Image URL</label>
                                </div>
                            </div>

                            <div className='quizOptionsCon'>
                                <div className='quizOptions'>
                                    {question.options.map(option => (
                                        <div key={option.id} className='option'>
                                            <input
                                                type="radio"
                                                name={`correctOption${question.id}`}
                                                checked={question.correctOption === option.id}
                                                onChange={() => setQuestions(questions.map(q => q.id === question.id ? { ...q, correctOption: option.id } : q))}
                                            />
                                            {question.optionType === 'text' && (
                                                <input
                                                    type="text"
                                                    value={option.text}
                                                    placeholder="Text"
                                                    className={`optionInput ${question.correctOption === option.id ? 'activeOption' : ''}`}
                                                    onChange={(e) => setQuestions(questions.map(q =>
                                                        q.id === question.id
                                                            ? {
                                                                ...q,
                                                                options: q.options.map(opt => opt.id === option.id ? { ...opt, text: e.target.value } : opt)
                                                            }
                                                            : q
                                                    ))}
                                                />
                                            )}
                                            {question.optionType === 'imgUrl' && (
                                                <input
                                                    type="text"
                                                    value={option.image}
                                                    placeholder="Image URL"
                                                    className={`optionInput ${question.correctOption === option.id ? 'activeOption' : ''}`}
                                                    onChange={(e) => setQuestions(questions.map(q =>
                                                        q.id === question.id
                                                            ? {
                                                                ...q,
                                                                options: q.options.map(opt => opt.id === option.id ? { ...opt, image: e.target.value } : opt)
                                                            }
                                                            : q
                                                    ))}
                                                />
                                            )}
                                            {question.optionType === 'textImg' && (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        placeholder="Text"
                                                        className={`optionInputText ${question.correctOption === option.id ? 'activeOption' : ''}`}
                                                        onChange={(e) => setQuestions(questions.map(q =>
                                                            q.id === question.id
                                                                ? {
                                                                    ...q,
                                                                    options: q.options.map(opt => opt.id === option.id ? { ...opt, text: e.target.value } : opt)
                                                                }
                                                                : q
                                                        ))}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option.image}
                                                        placeholder="Image URL"
                                                        className={`optionInputImage ${question.correctOption === option.id ? 'activeOption' : ''}`}
                                                        onChange={(e) => setQuestions(questions.map(q =>
                                                            q.id === question.id
                                                                ? {
                                                                    ...q,
                                                                    options: q.options.map(opt => opt.id === option.id ? { ...opt, image: e.target.value } : opt)
                                                                }
                                                                : q
                                                        ))}
                                                    />
                                                </>
                                            )}
                                            {option.id > 2 && (
                                                <button className='optionDeleteBtn' onClick={() => handleRemoveOption(question.id, option.id)}>
                                                    <img src={OptionDeleteIcon} alt='Delete option' />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {question.options.length < 4 && (
                                        <button className='addOptionBtn' onClick={() => handleAddOption(question.id)}>Add option</button>
                                    )}
                                </div>
                                <div className="errorMessagesCreateCon">
                                    {errors.map((error, index) => (
                                        <p key={index} className="errorText">{error}</p>
                                    ))}
                                </div>
                                <div className='timerContainer'>
                                    {quizData.type === 'qna' && (
                                        <>
                                            <p>Timer</p>
                                            <button
                                                className={question.timer === 'off' ? 'active' : ''}
                                                onClick={() => handleTimerChange(question.id, 'off')}
                                            >
                                                OFF
                                            </button>
                                            <button
                                                className={question.timer === '5sec' ? 'active' : ''}
                                                onClick={() => handleTimerChange(question.id, '5sec')}
                                            >
                                                5 sec
                                            </button>
                                            <button
                                                className={question.timer === '10sec' ? 'active' : ''}
                                                onClick={() => handleTimerChange(question.id, '10sec')}
                                            >
                                                10 sec
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                ))}

                <div className='popup2ButtonsCon'>
                    <button id='popup2CancelBtn' onClick={() => setShowCreateQuiz2(false)}>Cancel</button>
                    <button id='popup2CreateQuizBtn' onClick={handleCreateQuiz}>Create Quiz</button>
                </div>
            </div>
        </div>
    );
}

export default CreateQuizPopup2;
