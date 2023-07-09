require('dotenv').config({ path: './.env' });
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cron = require('node-cron');
const inprogressOrder = require('./utils/cronjob.utils');
const app = express();

// cors origin
app.use(cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(fileUpload({
    createParentPath: true,
    safeFileNames: false,
    preserveExtension: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cron job
cron.schedule('*/30 * * * * *', async () => {
    await inprogressOrder();
});


// router
app.use('/api', require('./routes'));
app.get('*', (req, res) => res.json({ status: 200, success: true, data: 'washing api' }));

module.exports = app;
