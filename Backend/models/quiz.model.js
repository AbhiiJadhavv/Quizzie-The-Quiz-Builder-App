import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['qna', 'poll'],
        required: true
    },
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            optionType: {
                type: String,
                enum: ['text', 'imgUrl', 'textImg'],
                default: 'text'
            },
            options: [{
                text: {
                    type: String
                },
                image: {
                    type: String
                },
                nature: {
                    type: String,
                    enum: ['correct', 'incorrect'],
                    default: 'incorrect'  // Only for Q&A type quizzes
                },
                pollCount: {
                    type: Number,
                    default: 0  // To track poll responses
                }
            }],
            timer: {
                type: String,
                enum: ['off', '5sec', '10sec'],
                default: 'off'
            }
        }
    ],
    responsesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);