const Router = require('express')
const router = new Router()

const recordController = require('../controllers/RecordController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', recordController.getAll)
router.get('/:recordId', recordController.getOne)
router.post('/', checkRoleMiddleware(['admin', 'mechanic']), recordController.getByDate)
router.post('/create', recordController.createRecord)
router.post('/createrecordfromapp', recordController.createRecordFromApp)
router.post('/:recordId/add-services', recordController.addServices)

module.exports = router