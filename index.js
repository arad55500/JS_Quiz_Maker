const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const electron = require('electron');
const multer = require('multer');
const { convertTextFile } = require('./parseFIle.js');
const { responses } = require('./parseFIle.js');


const app = express();
const { app: electronApp, BrowserWindow } = electron;

try {
    mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB (QuizDB Database)');
}
catch (err) {
    console.log('Error connecting to MongoDB (QuizDB Database), check your connection and try again');
    console.log(err);
}
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Set the directory where uploaded files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Save with a unique name based on the current timestamp
    }
});

const upload = multer({ storage: storage });


const PORT = 3000;
const IP = 'localhost';

let mainWindow;

electronApp.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        title: 'LOADING...',
        autoHideMenuBar: true,
        useContentSize: true,
        resizable: false,
    });

    mainWindow.loadURL(`http://${IP}:${PORT}/`);
    mainWindow.focus();
});


app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.post('/', (req, res) => {
    res.render('index.ejs');
})

app.post('/myquizzes', (req, res) => {
    res.render('myquizzes.ejs');
});

app.post('/load', (req, res) => {
    res.render('load.ejs');
});

app.post('/discover', (req, res) => {
    res.render('discover.ejs');
});

app.post('/create', (req, res) => {
    res.render('create.ejs');
});

app.post('/about', (req, res) => {
    res.render('about.ejs');
});

app.post('/quiz', (req, res) => {
    res.render('in-quiz.ejs');
});

app.post('/upload', upload.single('quizFile'), (req, res) => {
    if (req.file) {
        const quizData = convertTextFile(req.file.path); 
        res.render('in-quiz.ejs', { quizData });
    } else {
        res.status(400).send('No file uploaded.');
    }
});


app.get('/in-quiz', (req, res) => {
    
})

app.post('/submit-quiz', (req, res) => {
    const userAnswers = req.body;

    // Read and parse the output.json file
    let quizData;
    try {
        const fileData = fs.readFileSync('./output.json', 'utf-8');
        quizData = JSON.parse(fileData);
    } catch (err) {
        return res.status(500).send('Error reading output.json: ' + err.message);
    }

    let correctCount = 0;
    
    quizData.forEach((quizItem, index) => {
        let userResponse;

        if (quizItem.type === "openAnswer") {
            userResponse = userAnswers[`openAnswer_${index}`];
        } else if (quizItem.type.startsWith("multipleChoice")) {
            userResponse = userAnswers[`question_${index}`];
        }

        if(userResponse === quizItem.response) {
            correctCount++;
        }
    });

    const totalQuestions = quizData.length;
    const percentageCorrect = (correctCount / totalQuestions) * 100;

    res.render('submit-quiz.ejs', {
        correctCount: correctCount,
        percentage: percentageCorrect.toFixed(2)
    });
});





// keep last

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});
