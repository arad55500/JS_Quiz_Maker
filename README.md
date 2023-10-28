# JavaScript Quiz Maker (JS_Quiz_Maker)

JS_Quiz_Maker is a cross-platform desktop application built with Electron, Node.js, and Express that allows you to create and manage JavaScript quizzes effortlessly. Whether you're a teacher, a developer, or simply want to challenge your JavaScript knowledge, this app makes quiz creation and sharing a breeze.

## Current Features

- Design quizzes using a text file and view them within our custom graphical user interface (GUI).
- Automatically submit quiz scores and provide immediate feedback to the user.
- Detailed scoring and feedback after completing a quiz.
- Share quizzes by transferring text files and importing them into the application when running it elsewhere.
- Create and edit JavaScript quizzes with a user-friendly interface.
- Add multiple-choice questions with customizable options.
- Add multiple-choice questions with customizable options.
- Allow app to be compiled w/o dependencies through one executable.

## Installation: One Command

Run the following command in your terminal:
   ```bash
   git clone https://github.com/arad55500/JS_Quiz_Maker.git
   cd JS_Quiz_Maker
   ./launch.sh
   ```

## Installation: Development Environment

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/arad55500/JS_Quiz_Maker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd JS_Quiz_Maker
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

To run JS_Quiz_Maker, use the following command:

```bash
npm start
```

## Creating a Quiz

1. Create a new Text File
2. Follow the guide for creating quizzes via text file.
3. Add questions and customize options.
4. Save your quiz.

## Text File Syntax

You must follow the correct syntax in order for the quiz to output correctly.

### Creating an open answer question
```bash
openAnswer(question, response)
```

Example:
```bash
openAnswer(What is the capital of France?, Paris)
```

### Creating an multiple choice question with 2 choices
```bash
multipleChoice2questions(question, choice1, choice2, response)
```

Example:
```bash
multipleChoice2questions(Which of these is a fruit?, Apple, Car, Apple)
```

### Creating an multiple choice question with 3 choices
```bash
multipleChoice3questions(question, choice1, choice2, choice3, response)
```

Example:
```bash
multipleChoice3questions(Which languages are used in web development?, Python, JavaScript, Ruby, JavaScript)
```

### Creating an multiple choice question with 4 choices
```bash
multipleChoice4questions(question, choice1, choice2, choice3, choice4, response)
```

Example:
```bash
multipleChoice4questions(What's the largest planet in our solar system?, Earth, Mars, Jupiter, Venus, Jupiter)
```

## Saving the text file
Call your text file any name, but make sure to add the .txt extension at the end when saved.


## Taking a Quiz

1. Launch the application.
2. Click on "Load Quiz"
3. Select a quiz via inputting a file.
4. Answer the questions and submit your quiz.
5. View your score and feedback.

## Contributing

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code is well-documented.
4. Test thoroughly.
5. Create a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

We would like to thank the following libraries and frameworks for making this project possible:

- Electron: https://www.electronjs.org/
- Node.js: https://nodejs.org/
- Express: https://expressjs.com/
- Other open-source contributors and projects.

## Thank you

Enjoy using JS_Quiz_Maker! Happy quizzing!
