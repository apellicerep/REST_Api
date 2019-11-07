const express = require('express')
const router = express.Router()
const { User, Course } = require('../../models')

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

//get all courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
            }
        ]
    })
    if (courses) {
        res.status(200).json({
            courses: courses
        })
    } else {
        res.status(404).json({ error: "NotFound" })
    }
}))


//get course
router.get('/:id', asyncHandler(async (req, res) => {
    console.log(req.params.id)
    const courseId = await Course.findByPk(
        req.params.id, {
        include: {
            model: User
        }
    })
    if (courseId) {
        res.status(200).json({
            courseId: courseId
        })

    } else {
        res.status(404).json({ error: "NotFound" })
    }

}))

//create course
router.post('/', asyncHandler(async (req, res, next) => {
    let course;
    try {
        course = await Course.create(req.body)
        console.log(course.toJSON())
        const resCourse = course.toJSON().id
        res.location(`/api/course/${resCourse}`) //preguntar
        res.status(201).end()

    } catch (error) {
        //console.log(error)
        if (error.name === "SequelizeValidationError") {
            book = await Course.build(req.body);
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}))

//update course
router.put('/:id', asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id)
        console.log(course.toJSON())
        if (course) {
            await course.update(req.body) //guardo instancia en base de datos
            res.status(204).end()
        } else {
            res.status(404).json({ error: "NotFound" })
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            course = await Course.build(req.body);
            console.log(error.errors)
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}))

router.delete('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id)
    if (course) {
        await course.destroy()
        res.status(204).end()
    } else {
        res.status(404).json({ error: "NotFound" })
    }
}))

module.exports = router