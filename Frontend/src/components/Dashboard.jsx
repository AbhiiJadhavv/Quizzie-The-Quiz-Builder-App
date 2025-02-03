import React, { useEffect } from 'react';
import '../styles/Dashboard.css';
import ImpressionsIcon from '../assets/ImpressionsIcon.png';
import { fetchDashboardData } from '../utils/dashboardData';

function Dashboard({ user, dashboardData, setDashboardData }) {

  useEffect(() => {
    fetchDashboardData(setDashboardData, user);
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
