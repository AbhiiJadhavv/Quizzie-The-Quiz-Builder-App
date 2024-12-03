import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import ImpressionsIcon from '../assets/ImpressionsIcon.png';
import { QUIZ_API_END_POINT } from '../utils/constant';

function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState({
    totalQuizzes: 0,
    totalQuestions: 0,
    totalImpressions: 0,
    trendingQuizzes: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token for authentication
        const { data } = await axios.post(
          `${QUIZ_API_END_POINT}/dashboard`, // Use POST to send data in the body
          { userId: user._id }, // Pass user._id in the request body
          {
            headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
            withCredentials: true
          }
        );
        console.log('Dashboard data:', data); // Debug log for validation
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchDashboardData();
  }, [user._id]);  

  return (
    <div className='dashboard'>
      <div className='dashboardStats'>
        <div className='quizCreatedCon'>
          <div className='quizCreatedLine1'>
            <div className='quizCreatedData'>{dashboardData.totalQuizzes}</div>
            <div className='quizCreatedLine1P'>Quiz</div>
          </div>
          <div className='quizCreatedLine2'>Created</div>
        </div>
        <div className='questionsCreatedCon'>
          <div className='quizCreatedLine1'>
            <div className='questionsCreatedData'>{dashboardData.totalQuestions}</div>
            <div className='quizCreatedLine1P'>Questions</div>
          </div>
          <div className='quizCreatedLine2'>Created</div>
        </div>
        <div className='totalImpressionsCon'>
          <div className='quizCreatedLine1'>
            <div className='totalImpressionsData'>{dashboardData.totalImpressions}</div>
            <div className='quizCreatedLine1P'>Total</div>
          </div>
          <div className='quizCreatedLine2'>Impressions</div>
        </div>
      </div>
      <div className='trendingQuizs'>
        <div className='trendingQuizsName'>
          <p>Trending Quizzes</p>
        </div>
        <div className='trendingQuizsContainer'>
          {dashboardData.trendingQuizzes.map((quiz, index) => (
            <div className='trendingQuiz' key={index}>
              <div className='trendingQuizsLine1'>
                <div className='quizName'>{quiz.name}</div>
                <div className='trendingQuizsImpressionsCon'>
                  <div className='trendingQuizsImpressions'>{quiz.impressions}</div>
                  <div className='trendingQuizsImage'>
                    <img src={ImpressionsIcon} alt='Impressions Icon' />
                  </div>
                </div>
              </div>
              <div className='trendingQuizsLine2'>
                Created on: {new Date(quiz.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
