"use strict;"

const PORT = 5000;

const BASE_URL = `http://127.0.0.1:${PORT}`;

async function getTextFromURL(url) {
    const response = await axios.post(`${BASE_URL}/api/get-article-text`, {
        url
    });
    return response;
}

function test() {
    console.log("this is a test")
}

