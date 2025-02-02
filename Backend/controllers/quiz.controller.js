import { Quiz } from '../models/quiz.model.js';
import { Response } from '../models/response.model.js';

export const createQuiz = async (req, res) => {
    try {
        const { user, name, type, questions } = req.body;

        if (!user || !name || !type || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid input data.' });
        }

        const transformedQuestions = questions.map((q) => {
            if (!q.question || !q.options || !Array.isArray(q.options)) {
                throw new Error('Invalid question data.');
            }

            const transformedOptions = q.options.map((opt) => {
                const isTextValid = q.optionType === 'text' && opt.text?.trim();
                const isImgValid = q.optionType === 'imgUrl' && opt.image?.trim();
                const isTextImgValid = q.optionType === 'textImg' && opt.text?.trim() && opt.image?.trim();

                if (!isTextValid && !isImgValid && !isTextImgValid) {
                    throw new Error(`Invalid option data for question: ${q.question}`);
                }

                return {
                    text: opt.text || '',
                    image: opt.image || '',
                    nature: opt.nature || (type === 'qna' ? 'incorrect' : undefined),
                    pollCount: type === 'poll' ? opt.pollCount || 0 : undefined,
                };
            });

            return {
                question: q.question,
                optionType: q.optionType || 'text',
                options: transformedOptions,
                timer: q.timer || 'off',
            };
        });

        const newQuiz = new Quiz({
            user,
            name,
            type,
            questions: transformedQuestions,
        });

        const savedQuiz = await newQuiz.save();
        res.status(201).json({ quiz: savedQuiz });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(400).json({ error: error.message });
    }
};


export const getDashboardData = async (req, res) => {
    try {
      const { userId } = req.body; // Extract userId from the request body
  
      // Total quizzes created by the user
      const totalQuizzes = await Quiz.countDocuments({ user: userId });

      const quizzes = await Quiz.find({ user: userId }).select("name type questions");
      const totalQuestions = quizzes.reduce((acc, quiz) => acc + quiz.questions.length, 0);
  
      // Total questions created by the user
      // const totalQuestionsResult = await Quiz.aggregate([
      //   { $match: { user: userId } },
      //   { $project: { questionCount: { $size: '$questions' } } },
      //   { $group: { _id: null, totalQuestions: { $sum: '$questionCount' } } }
      // ]);
      // const totalQuestions = totalQuestionsResult[0]?.totalQuestions || 0;
  
      // Total impressions (responses to user's questions)
      const totalImpressionsResult = await Response.aggregate([
        { $match: { quiz: { $in: await Quiz.find({ user: userId }).select('_id') } } },
        { $unwind: '$answers' },
        { $count: 'totalImpressions' }
      ]);
      const totalImpressions = totalImpressionsResult[0]?.totalImpressions || 0;
  
      // Top 12 trending quizzes based on impressions
      const trendingQuizzes = await Quiz.aggregate([
        { $match: { user: userId } },
        {
          $lookup: {
            from: 'responses',
            localField: '_id',
            foreignField: 'quiz',
            as: 'responses'
          }
        },
        {
          $addFields: {
            impressions: { $size: { $reduce: { input: '$responses.answers', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } } }
          }
        },
        { $sort: { impressions: -1 } },
        { $limit: 12 },
        {
          $project: {
            name: 1,
            createdAt: 1,
            impressions: 1
          }
        }
      ]);
  
      res.status(200).json({
        totalQuizzes,
        totalQuestions,
        totalImpressions,
        trendingQuizzes
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  };
  