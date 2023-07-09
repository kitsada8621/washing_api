const moment = require('moment');

exports.internalServer = {
    statusCode: 500,
    success: false,
    data: "internal server",
    obj: null,
}

exports.remainingTime = (expiresDate) => {

    // check null or undefined
    if (!expiresDate) return null;

    const currentDate = moment();
    const expiryDate = moment(expiresDate);
    const duration = moment.duration(expiryDate.diff(currentDate));

    // const remainingHours = Math.floor(duration.asHours());
    // const remainingSeconds = Math.floor(duration.asSeconds()) % 60;
    const remainingMinutes = Math.floor(duration.asMinutes()) % 60;

    return remainingMinutes ?? null;
}