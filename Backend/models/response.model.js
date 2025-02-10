import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            selectedOptionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Option',
                default: null
            },
            isCorrect: {
                type: Boolean,
                default: null  // For Q&A type, this can be calculated
            }
        }
    ]
}, { timestamps: true });

export const Response = mongoose.model('Response', responseSchema);
