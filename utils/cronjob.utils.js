const db = require('../models');
const moment = require('moment');
const { LINE } = require('./http.utils');
const FormData = require('form-data');

module.exports = async () => {
    try {

        // get order
        const orders = await db.Order.findAll({
            include: {
                model: db.Washer,
                as: 'washer',
                required: false,
            },
            where: { status: 3 } // inprogress
        });

        // handle order
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];

            // check expires
            if (!order.expiresIn) {
                console.log('!expiresIn is null or empty');
                continue;
            }

            const currentDate = moment().startOf('minute');
            const expiresIn = moment(order.expiresIn).startOf('minute');
            const rollbackDate = expiresIn.clone().subtract(1, 'minute');

            console.log('currentDate >= rollbackDate', currentDate >= rollbackDate);
            // warning send to line
            if (currentDate >= rollbackDate && !order.hasNotify) {
                await sendToLine(order); // send to line
            }

            // update status
            console.log('currentDate >= expiresIn: ', currentDate >= expiresIn);
            if (currentDate >= expiresIn) {
                await updateWasher(order); // update status washer
            }

        }

    } catch (e) {
        console.log('err: ', e);
        return [null, e.message];
    }
};

const sendToLine = async (data) => {
    try {

        // message
        const washer = data.washer.name ?? "";
        const message = `เครื่องซักผ้า ${washer} จะเสร็จภายในอิก 1 นาที`;

        // payload
        const formData = new FormData();
        formData.append('message', message);

        // send to line
        const callback = await LINE.post('/notify', formData)
            .then(async (res) => {
                // stamp 
                await db.Order.update({ hasNotify: true }, { where: { id: data.id } });
                // callback
                return [res, null];
            }).catch(err => {
                console.log('err send line: ', err);
                return [null, err];
            });

        return callback;
    } catch (e) {
        console.log('err: ', e);
        return [null, e.message];
    }
};

const updateWasher = async (data) => {
    try {

        if (!data) {
            return [null, "invalid argument"];
        }

        // update order
        await db.Order.update({ status: 1 }, { where: { id: data.id } });

        // update washer
        await db.Washer.update({ status: true }, { where: { id: data.washerId } });

        return ["Successfully", null];

    } catch (e) {
        console.log('err: ', e);
        return [null, e.message];
    }
};