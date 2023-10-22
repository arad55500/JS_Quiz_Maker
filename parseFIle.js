const path = require('path');

function parseLine(line) {
    let parsedData;

    if (line.startsWith('openAnswer(')) {
        const matches = line.match(/openAnswer\((.*?),\s*(.*?)\)/);
        if (matches) {
            parsedData = {
                type: 'openAnswer',
                question: matches[1],
                response: matches[2]
            };
        }
    } else if (line.startsWith('multipleChoice2questions(')) {
        const matches = line.match(/multipleChoice2questions\((.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
        if (matches) {
            parsedData = {
                type: 'multipleChoice',
                question: matches[1],
                choices: [matches[2], matches[3]],
                response: matches[4]
            };
        }
    } else if (line.startsWith('multipleChoice3questions(')) {
        const matches = line.match(/multipleChoice3questions\((.*?),\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
        if (matches) {
            parsedData = {
                type: 'multipleChoice',
                question: matches[1],
                choices: [matches[2], matches[3], matches[4]],
                response: matches[5]
            };
        }
    } else if (line.startsWith('multipleChoice4questions(')) {
        const matches = line.match(/multipleChoice4questions\((.*?),\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?),\s*(.*?)\)/);
        if (matches) {
            parsedData = {
                type: 'multipleChoice',
                question: matches[1],
                choices: [matches[2], matches[3], matches[4], matches[5]],
                response: matches[6]
            };
        }
    }

    return parsedData;
}

const fs = require('fs');

function convertTextFile(inputFilePath) {
    const input = fs.readFileSync(inputFilePath, 'utf-8');
    const lines = input.split('\n');
    const outputData = [];

    lines.forEach(line => {
        const parsed = parseLine(line);
        if (parsed) {
            outputData.push(parsed);
        }
    });

    // Writing the outputData to output.json
    fs.writeFileSync('output.json', JSON.stringify(outputData, null, 2));

    return outputData;
}





module.exports = {
    convertTextFile,
    responses: this.responses
}


// Usage
// convertTextFile('path_to_input.txt', 'path_to_output.json');
