"use strict;"

const PORT = 5000;

const BASE_URL = `http://127.0.0.1:${PORT}`;

async function getTextFromURL(url) {
    const urlObject = new URL(url);
    const hostName = urlObject.hostname
    const response = await axios.post(`${BASE_URL}/api/get-article-text`, {
        url,
        hostName
    });
    return response;
}

async function addWorksheet(worksheetTitle, worksheetText, numberOfQuestions, gradeLevel) {
    const response = await axios.post(`${BASE_URL}/api/add-worksheet`, {
        "title": worksheetTitle,
        "grade_level": gradeLevel,
        "worksheet_text": worksheetText,
        "question_count": numberOfQuestions
    });
    return response;
}

function test() {
    console.log("this is a test")
}

