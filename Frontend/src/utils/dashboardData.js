import axios from "axios";
import { QUIZ_API_END_POINT } from "./constant";

export const fetchDashboardData = async (setDashboardData, user) => {
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