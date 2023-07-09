const { internalServer } = require("../utils");
const db = require('../models');
const { Op } = require('sequelize');
const validation = require('../validations/order.validation');
const moment = require('moment');


exports.create = async (req, res) => {
    try {

        const { error } = await validation.createOrder(req.body);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }


        // check device exist
        let washer = await db.Washer.findByPk(req.body.washerId);
        if (!washer) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'washer not found',
                obj: null,
            });
        }

        // check service rate
        if (req.body.amount < washer.serviceRate) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: 'The service fee is invalid according to the conditions.',
                obj: null
            });
        }

        // Check the status of the washing machine.
        if (!washer.status) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: 'The washing machine is busy.',
                obj: null
            });
        }

        // update washer
        await washer.update({ status: false });

        // update order
        let limitTime = process.env.WASHING_EXPIRE ?? 1;
        let order = await db.Order.create({
            washerId: washer.id,
            amount: req.body.amount ?? 0,
            expiresIn: moment().add(limitTime, 'minutes'),
            status: 3
        });

        // handle error create
        if (!order) {
            return res.status(500).json({
                status: 500,
                success: false,
                data: 'Failed crate order',
                obj: null
            });
        }

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully created order',
            obj: null,
        });

    } catch (e) {
        console.log('err', e);
        return res.status(500).json(internalServer);
    }
}