const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs');
const User = require('../../models').User
const auth = require('basic-auth')
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
    res.json({
        name: user.firstName,
        email: emailAddress
    })
}))


router.post('/', asyncHandler(async (req, res, next) => {
    let user;
    console.log(req.body)
    try {
        const { password } = req.body
        if (!(password === 'null' || password === "")) {
            req.body.password = bcryptjs.hashSync(password)
        }
        user = await User.create(req.body);
        res.status(201).redirect("/")
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            error.status = 400
            next(error)
        } else {
            console.log(error)
            throw error;
        }
    }
}));


module.exports = router