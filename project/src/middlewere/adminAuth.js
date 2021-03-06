const jwt = require('jsonwebtoken')
const Admin= require('../models/admin/admin')

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'thisismynewadmin');
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!admin) {
            throw new Error()
        }
        
        req.token=token
        req.admin = admin
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = adminAuth