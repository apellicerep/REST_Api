const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const User = require('../../models').User
const authHandler = require('../.././auth.js').authenticateUser



/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

router.get('/', authHandler, asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    res.status(200).json({
        name: user.firstName,
        email: user.emailAddress
    })
}))


router.post('/', asyncHandler(async (req, res, next) => {
    let user;
    //controlling if they sent and empty object
    if (Object.keys(req.body).length < 3) {
        throw new Error("Not Enough Parameters");
    }
    try {
        const { password } = req.body
        if (!(password === null || password === "")) {
            req.body.password = bcryptjs.hashSync(password)
        }
        user = await User.create(req.body);
        res.status(201).location('/').end()
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}));


module.exports = router