const express = require('express')
const router = express.Router()
const { User, Course } = require('../../models')
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

//get all courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
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
router.post('/', authHandler, asyncHandler(async (req, res, next) => {
    let course;
    try {
        course = await Course.create(req.body)
        const resCourse = course.toJSON().id
        res.status(201).location(`/api/courses/${course.id}`).end()

    } catch (error) {
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
router.put('/:id', authHandler, asyncHandler(async (req, res) => {
    let course;
    try {
        course = await Course.findByPk(req.params.id)//busco instancia del curso
        if (course) {
            if (course.userId === req.currentUser.id) {
                await course.update(req.body) //actualizo instancia en base de datos a través de su instancia.
                res.status(204).end()
            } else {
                res.status(403).end()
            }
        } else {
            res.status(404).json({ error: "NotFound" })
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            //course = await Course.build(req.body);//en este caso no necesito la instancia course, podria 
            //si por ejemplo tuviera default values en mi model i los quisiera passar.
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}))

router.delete('/:id', authHandler, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id)
    if (course) {
        if (course.userId === req.currentUser.id) { //compruebo que solo pueda eliminar sus cursos.
            await course.destroy()
            res.status(204).end()
        } else {
            res.status(403).end()
        }
    }
    else {
        res.status(404).json({ error: "NotFound" })
    }
}))

module.exports = router