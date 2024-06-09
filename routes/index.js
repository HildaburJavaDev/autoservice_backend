const Router = require('express')
const router = new Router()

const boxRouter = require('./BoxRouter')
const userRouter = require('./UserRouter')
const serviceRouter = require('./ServiceRouter')
const recordRouter = require('./RecordRouter')

router.use('/boxes', boxRouter)
router.use('/user', userRouter)
router.use('/services', serviceRouter)
router.use('/records', recordRouter)
module.exports = router