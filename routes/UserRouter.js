const Router = require('express')
const router = new Router()

const userController = require('../controllers/UserController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/sign', userController.sign)
router.post('/sign', userController.signin)
router.post('/create', checkRoleMiddleware(['admin']), userController.registerEmployee)
router.get('/profile', userController.getProfile)
router.post('/profile', userController.updateProfile)

module.exports = router 