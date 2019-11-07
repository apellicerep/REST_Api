const express = require('express')
const router = express.Router()

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            res.status(500)
        }
    }
}

// router.get('/', asyncHandler(async (req,res)=>{

// }))

// router.post('/', asyncHandler(async (req,res)=>{

// }))

module.exports = router