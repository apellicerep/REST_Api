const express = require('express')
const router = express.Router()
const auth = require('basic-auth');
const User = require('../../models').User

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            res.status(500).end()
        }
    }
}

router.get('/', asyncHandler((req, res) => {
    const credentials = auth(req);
    res.json({
        credenciales: credentials
    })

}))

router.post('/', asyncHandler(async (req, res) => {
    let user;
    console.log(req.body)

    try {
        user = await User.create(req.body);
        res.status(201).redirect("/")
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            user = await User.build(req.body);
            console.log(error.errors)
            res.status(500).end()
        } else {
            console.log(error)
            throw error;
        }
    }
}));


module.exports = router