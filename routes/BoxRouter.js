const Router = require('express')
const router = new Router()
const boxController = require('../controllers/BoxController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/', boxController.findFreeIntervalsForAllBoxes)
router.post('/createslot', checkRoleMiddleware(['admin']), boxController.createSlotForBox)

module.exports = router