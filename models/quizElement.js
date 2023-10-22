const mongoose = require('mongoose');

// Define the schema for the QuizElement model
const quizElementSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: Number,
        enum: [1, 2],  // 1 for open answer, 2 for multiple choice
        required: true
    },
    // If it's an open answer question, the correct answer will be stored as a string
    openAnswer: {
        type: String,
        trim: true,
        required: function() { return this.type === 1; }
    },
    // If it's a multiple choice question, choices will be an array of options
    choices: {
        type: [{
            option: String,
            isCorrect: {
                type: Boolean,
                default: false
            }
        }],
        validate: {
            validator: function(v) {
                // Ensure there's at least one correct choice for multiple choice questions
                return this.type !== 2 || v.some(choice => choice.isCorrect);
            },
            message: 'Multiple choice questions must have at least one correct answer!'
        },
        required: function() { return this.type === 2; }
    }
});

// Create a model based on the schema
const QuizElement = mongoose.model('QuizElement', quizElementSchema);

module.exports = QuizElement;
