const { internalServer, remainingTime } = require("../utils");
const db = require('../models');
const { Op } = require('sequelize');
const validation = require('../validations/provider.validation');

exports.showAll = async (req, res) => {
    try {

        let { error } = await validation.showAll(req.body);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed Content',
                obj: error.details[0].message
            });
        }

        let { count, rows } = await db.Washer.findAndCountAll({
            where: {
                name: { [Op.like]: `%${req.body.search}%` }
            },
            include: {
                model: db.Order,
                as: 'orders',
                required: false,
                where: { status: 3 },
                order: [['orders.createdAt', 'DESC']]
            },
            skip: req.body.skip,
            limit: req.body.limit,
            order: [['updatedAt', 'desc']]
        });

        // remaining time
        let washers = await rows.map(row => {

            let obj = { ...row.toJSON() };

            // add remaining time
            obj.expiresDate = (row.orders.length && !row.status) ? row.orders[0].expiresIn : null;
            obj.remainingTimeMinute = (row.orders.length && !row.status) > 0 ? remainingTime(row.orders[0].expiresIn) : null;

            // remove field
            delete obj.orders;

            return obj;
        });

        return res.json({
            status: 200,
            success: true,
            data: 'Success',
            total: count,
            obj: washers,

        });
    } catch (e) {
        console.log('err show device: ', e);
        return req.status(500).json(internalServer);
    }
}

exports.details = async (req, res) => {
    try {

        let { error } = await validation.details(req.params);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed Content',
                obj: error.details[0].message
            });
        }

        let washer = await db.Washer.findByPk(req.params.id, {
            include: {
                model: db.Order,
                as: 'orders',
                where: { status: 3 },
                required: false,
                order: [['orders.createdAt', 'DESC']]
            }
        });
        if (!washer) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'washer not found',
                obj: null
            });
        }

        let obj = {
            ...washer.toJSON(),
            expiresDate: (washer.orders.length && !washer.status) ? washer.orders[0].expiresIn : null,
            remainingTimeMinute: (washer.orders.length && !washer.status) > 0 ? remainingTime(washer.orders[0].expiresIn) : null
        };

        // remove field
        delete obj.orders;

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully',
            obj: obj,
        });

    } catch (e) {
        console.log('err: ', e);
        return res.json(internalServer);
    }
}