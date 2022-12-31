"use strict;"

const PORT = 5000;

const BASE_URL = `http://127.0.0.1:${PORT}`;

async function getTextFromURL(url) {
    const response = await axios({
        url: `${BASE_URL}/api/text`,
        data: url,
        method: "POST",
    });
}