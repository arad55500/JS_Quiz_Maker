const QuizElement = require('./models/quizElement');  // Make sure to provide the correct path to your model

// Create functions

const createOpenAnswerElement = async (question, answer) => {
    const element = new QuizElement({
        question: question,
        type: 1,
        openAnswer: answer
    });
    return await element.save();
};

const createMultipleChoiceElement = async (question, choices) => {
    const element = new QuizElement({
        question: question,
        type: 2,
        choices: choices
    });
    return await element.save();
};

// Read functions

const getOpenAnswerElement = async (id) => {
    return await QuizElement.findOne({ _id: id, type: 1 });
};

const getMultipleChoiceElement = async (id) => {
    return await QuizElement.findOne({ _id: id, type: 2 });
};

// Update functions

const updateOpenAnswerElement = async (id, newQuestion, newAnswer) => {
    return await QuizElement.findOneAndUpdate({ _id: id, type: 1 }, { question: newQuestion, openAnswer: newAnswer });
};

const updateMultipleChoiceElement = async (id, newQuestion, newChoices) => {
    return await QuizElement.findOneAndUpdate({ _id: id, type: 2 }, { question: newQuestion, choices: newChoices });
};

// Delete functions

const deleteOpenAnswerElement = async (id) => {
    return await QuizElement.findOneAndDelete({ _id: id, type: 1 });
};

const deleteMultipleChoiceElement = async (id) => {
    return await QuizElement.findOneAndDelete({ _id: id, type: 2 });
};

module.exports = {
    createOpenAnswerElement,
    createMultipleChoiceElement,
    getOpenAnswerElement,
    getMultipleChoiceElement,
    updateOpenAnswerElement,
    updateMultipleChoiceElement,
    deleteOpenAnswerElement,
    deleteMultipleChoiceElement
};

