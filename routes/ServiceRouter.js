const Router = require('express')
const router = new Router()

const servicesController = require('../controllers/ServicesController')

router.get('/', servicesController.getAllServices)

module.exports = router