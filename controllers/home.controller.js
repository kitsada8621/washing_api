const { internalServer } = require("../utils")

exports.index = async (req, res) => {
    try {
        return res.json({
            status: 200,
            success: true,
            data: "washing api"
        })
    } catch (e) {
        return res.status(500).json(internalServer);
    }
}