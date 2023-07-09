const axios = require('axios');
const lineToken = process.env.LINE_TOKEN ?? "";
console.log('lineToken', lineToken);

exports.LINE = axios.create({
    baseURL: 'https://notify-api.line.me/api/',
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${lineToken}`
    }
});