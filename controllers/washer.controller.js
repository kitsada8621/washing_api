const db = require('../models');
const { internalServer } = require('../utils');
const validation = require('../validations/washer.validation');
const { Op } = require('sequelize');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

exports.showAll = async (req, res) => {
    try {

        const { error } = await validation.showAll(req.body);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        const { count, rows } = await db.Washer.findAndCountAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${req.body.search}%` } },
                ]
            },
            offset: req.body.skip,
            limit: req.body.limit,
            order: [['updatedAt', 'desc']]
        });

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully',
            total: count,
            obj: rows
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}

exports.details = async (req, res) => {
    try {

        const { error } = await validation.details(req.params);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        const washer = await db.Washer.findByPk(req.params.id);
        if (!washer) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'Not found washer',
                obj: null,
            });
        }

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully',
            obj: washer
        });

    } catch (e) {
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}

exports.create = async (req, res) => {
    try {

        const { error } = await validation.create(req.body);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        // upload image
        let [image, err] = await uploadImage(req.files);
        if (err) {
            return res.status(400).json({
                status: 400,
                success: false,
                data: err,
                obj: null,
            });
        }

        // create device
        let washer = await db.Washer.create({ ...req.body, image: image });
        if (!washer) {
            return res.status(500).json({
                status: 500,
                success: false,
                data: 'Failed to create washer info'
            });
        }

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully created washer info',
            obj: washer
        });

    } catch (e) {
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}

exports.edit = async (req, res) => {
    try {
        const { error } = await validation.details(req.params);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        const washer = await db.Washer.findByPk(req.params.id);
        if (!washer) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'washer not found',
                obj: null,
            });
        }

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully',
            obj: washer
        });
    } catch (e) {
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}

exports.update = async (req, res) => {
    try {

        const { error } = await validation.update({ ...req.body, ...req.params });
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        // check device
        var washer = await db.Washer.findByPk(req.params.id);
        if (!washer) {

            return res.status(404).json({
                status: 404,
                success: false,
                data: 'washer not found',
                obj: null,
            });
        }

        // body update
        let payload = { ...req.body, image: washer.image ?? "" };

        // delete old image
        if (!!req.body.deleteImage) {
            let filePath = `public/images/${req.body.deleteImage}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            payload.image = "";
        }

        // change image
        if (!!req.files) {
            let [image, err] = await uploadImage(req.files);
            if (err) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    data: err,
                    obj: null,
                });
            }

            // new image
            payload.image = image;
        }

        // update device
        await washer.update(payload);

        return res.json({
            status: 200,
            success: true,
            data: 'Successfully updated washer',
            obj: washer
        });

    } catch (e) {
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}

exports.delete = async (req, res) => {
    try {
        const { error } = await validation.details(req.params);
        if (error) {
            return res.status(422).json({
                status: 422,
                success: false,
                data: 'Unprocessed content',
                obj: error.details[0].message
            });
        }

        let washer = await db.Washer.findByPk(req.params.id);
        if (!washer) {
            return res.status(404).json({
                status: 404,
                success: false,
                data: 'washer not found',
                obj: null,
            });
        }

        // delete image
        if (!!washer.image) {

            let filePath = `./public/images/${washer.image}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        // delete device
        await washer.destroy();

        return res.json({
            status: 204,
            success: true,
            data: 'Successfully deleted washer',
            obj: null,
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({ ...internalServer, obj: e.message });
    }
}


const uploadImage = async (files) => {
    try {

        if (!files) {
            return [null, "Invalid image"];
        }

        // check type type
        const allowsType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        if (!allowsType.includes(files.image.mimetype)) {
            return [null, "This type of file is not allowed to be uploaded."];
        }


        // original file
        let file = files.image;
        await file.mv(path.join(__dirname, '../public/images', file.name));

        // file 
        let originalImage = 'public/images/' + file.name;

        //resize image
        let time = new Date().getTime();
        let renameImage = `${time}_${file.name}`;

        let image = await Jimp.read(originalImage);

        //resize image
        image.resize(512, Jimp.AUTO).quality(100)

        // Save the resized image to the output path
        await image.writeAsync(`public/images/${renameImage}`);


        // remove original image
        if (fs.existsSync(originalImage)) {
            fs.unlinkSync(originalImage);
        }

        return [renameImage, null];
    } catch (e) {
        console.log(e);
        return [null, e.message];
    }
}