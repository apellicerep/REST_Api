const express = require('express')
const router = express.Router()
const auth = require('basic-auth');
const User = require('../../models').User

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

router.get('/', asyncHandler((req, res) => {
    const credentials = auth(req);
    res.json({
        credenciales: credentials
    })

}))

router.post('/', asyncHandler(async (req, res, next) => {
    let user;
    try {
        user = await User.create(req.body);
        res.status(201).redirect("/")
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            user = await User.build(req.body);
            error.status = 400
            next(error)

        } else {
            //console.log(error)
            throw error;
        }
    }
}));


module.exports = router