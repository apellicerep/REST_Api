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
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
            {
                model: User,
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt']
                }
            }
        ]
    }
    )
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

    if (Object.keys(req.body).length == 0) {
        req.body = { title: "", description: "", userId: -1 }
    };

    req.body.userId = req.currentUser.id //add userId from currentUser, we don't need to 

    try {
        course = await Course.create(req.body)
        res.status(201).location(`/api/courses/${course.id}`).end()

    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            error.message = error.errors.map(error => error.message)
            error.status = 400
            next(error)
        } else {
            throw error;
        }
    }
}))

//update course
router.put('/:id', authHandler, asyncHandler(async (req, res, next) => {
    let course;
    if (Object.keys(req.body).length == 0) {
        req.body = { title: "", description: "", userId: -1 }
    };
    try {
        //course = await Course.findByPk(req.params.id)//busco instancia del curso
        console.log(req.currentUser.id)
        course = await Course.findOne({
            where: { userId: req.currentUser.id, id: req.params.id }, //elimino solo el curso que le pertenece
        })
        if (course) {
            await course.update(req.body) //actualizo instancia en base de datos a través de su instancia.
            res.status(204).end()

        } else {
            res.status(403).end()
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            //course = await Course.build(req.body);//en este caso no necesito la instancia course, podria 
            //si por ejemplo tuviera default values en mi model i los quisiera passar.
            error.message = error.errors.map(error => error.message)
            error.status = 400
            console.log(error.message)
            next(error)
        } else {
            console.log(error)
            throw error;
        }
    }
}))

router.delete('/:id', authHandler, asyncHandler(async (req, res) => {
    const course = await Course.findOne({
        where: { userId: req.currentUser.id, id: req.params.id }
    })
    if (course) {
        await course.destroy()
        res.status(204).end()
    } else {
        res.status(403).end()
    }
}))

module.exports = router