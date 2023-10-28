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
const notifier = require('node-notifier');


const app = express();
const { app: electronApp, BrowserWindow } = electron;

const version = require('./package.json').version; // show version number

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

const storage_quiz_folder = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'my_quizzes/');  // Set the directory where uploaded files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-uploaded' + Date.now());  // Save with a unique name based on the current timestamp
    }
});

const upload = multer({ storage: storage });

const upload_quiz_folder = multer({ storage: storage_quiz_folder });

const ITEMS_PER_PAGE = 12;


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
    // Get page number from POST request body instead of query parameter
    const page = parseInt(req.body.page) || 1;

    fs.readdir(path.join(__dirname, 'my_quizzes'), (err, files) => {
        if (err) {
            return res.status(500).send('Server Error');
        }

        const start = (page - 1) * ITEMS_PER_PAGE;
        const paginatedFiles = files.slice(start, start + ITEMS_PER_PAGE);
        const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);

        res.render('myquizzes.ejs', {
            files: paginatedFiles,
            currentPage: page,
            totalPages: totalPages
        });
    });
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
    res.render('about.ejs', {
        version: version
    });
});

app.post('/quiz', (req, res) => {
    res.render('in-quiz.ejs');
});

app.post('/upload', upload.single('quizFile'), (req, res) => {
    if (req.file) {
        const quizData = convertTextFile(req.file.path); 
        console.log(quizData);
        res.render('in-quiz.ejs', { quizData });
    } else {
        res.status(400).send('No file uploaded.');
    }
});

app.get('/loadQuiz/:filename',upload.single('quizFile'), async (req, res) => {
    const filename = decodeURIComponent(req.params.filename);
    const filepath = path.join(__dirname, 'my_quizzes', filename); 
    
    try {
        const quizData = convertTextFile(filepath); // Process the file using convertTextFile
        
        // Render the in-quiz.ejs page and pass the quiz data to it
        res.render('in-quiz.ejs', { quizData: quizData });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading the quiz.');
    }
});

app.post('/upload-quiz', upload_quiz_folder.single('quizFile'), (req, res) => {
    if (req.file) {
        notifier.notify({
            title: 'JS Quiz Maker',
            message: 'Quiz uploaded successfully!',
            sound: true
          });
        res.redirect('/'); // Or whatever your route is to render the myquizzes.ejs page
    } else {
        res.status(400).send('No file uploaded or incorrect file format.');
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

app.post('/save-quiz', (req, res) => {
    const quizData = JSON.parse(req.body.quizData);

    // Transform the quizData into your desired syntax
    let transformedData = "/* Your desired syntax here, based on the structure of quizData */";

    // Send it back as a downloadable file
    res.setHeader('Content-Disposition', 'attachment; filename=quiz.txt');
    res.setHeader('Content-Type', 'text/plain');
    res.send(transformedData);
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
