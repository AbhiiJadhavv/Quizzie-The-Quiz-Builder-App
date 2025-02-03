import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../styles/HomePage.css';
import { USER_API_END_POINT } from '../utils/constant';
import axios from "axios";
import Dashboard from '../components/Dashboard';
import Analytics from '../components/Analytics';
import CreateQuizPopup from '../components/CreateQuizPopup';
import QuestionAnalysis from '../components/QuestionAnalysis';
import CreateQuizPopup2 from '../components/CreateQuizPopup2';
import ShareQuizPopup from '../components/ShareQuizPopup';

const HomePage = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateQuiz, setShowCreateQuiz] = useState(false);
    const [showCreateQuiz2, setShowCreateQuiz2] = useState(false);
    const [showShareQuiz, setShowShareQuiz] = useState(false);
    const [sharingQuiz, setSharingQuiz] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalQuizzes: 0,
        totalQuestions: 0,
        totalImpressions: 0,
        trendingQuizzes: []
    });
    const [quizdata, setQuizData] = useState({
        name: '',
        type: '',
        questions: [],
    });

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setIsLoading(false);
            } else {
                navigate("/form");
            }
        }
    }, [user, navigate]);

    if (isLoading) {
        return <div className="loading">
            <div className="dott"></div>
            <span className="textt">
                Loading....
            </span>
        </div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard user={user} dashboardData={dashboardData} setDashboardData={setDashboardData} />;
            case 'analytics':
                return <Analytics user={user} setActiveTab={setActiveTab} />;
            case 'questionAnalysis':
                return <QuestionAnalysis user={user} />;
            default:
                return <Dashboard user={user} dashboardData={dashboardData} setDashboardData={setDashboardData} />;
        }
    }

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });

            if (res.data.success) {
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate("/form");
                // toast.success(res.data.message);
                console.log("Logged out successfully.");
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message);
        }
    }

    return (
        <div className='homePage'>
            <div className='homePageSidebar'>
                <div className='homePageLogoContainer'>
                    <p>QUIZZIE</p>
                </div>
                <div className='homePageButtonsContainer'>
                    <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
                    <button onClick={() => setActiveTab('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>Analytics</button>
                    <button onClick={() => setShowCreateQuiz(true)}>Create Quiz</button>
                </div>
                <div className='logoutButtonContainer'>
                    <button onClick={handleLogout}>LOGOUT</button>
                </div>
            </div>
            {renderContent()}
            {showCreateQuiz && (
                <CreateQuizPopup setShowCreateQuiz={setShowCreateQuiz} setShowCreateQuiz2={setShowCreateQuiz2} setQuizData={setQuizData} />
            )}
            {showCreateQuiz2 && (
                <CreateQuizPopup2 setShowCreateQuiz2={setShowCreateQuiz2} setShowCreateQuiz={setShowCreateQuiz} setShowShareQuiz={setShowShareQuiz} quizData={quizdata} setQuizData={setQuizData} user={user} setSharingQuiz={setSharingQuiz} setDashboardData={setDashboardData} />
            )}
            {showShareQuiz && (
                <ShareQuizPopup setShowShareQuiz={setShowShareQuiz} sharingQuiz={sharingQuiz} />
            )}
        </div>
    )
}

export default HomePage;