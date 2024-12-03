import express from "express";
import { createQuiz, getDashboardData } from "../controllers/quiz.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";

const router = express.Router();

// Route to create a quiz
router.post("/create", isAuthenticated, createQuiz);

// Route to get dashboard data
router.post('/dashboard', isAuthenticated, getDashboardData);

export default router;
