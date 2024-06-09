const APIErrors = require("../errors/APIErrors")
const { Services } = require("../models/models")

class ServicesController {
    async getAllServices(req, res, next) {
        try {
            return res.json(await Services.findAll())
        } catch (error) {
            next(APIErrors.internalQuery("Ошибка получения данных с сервера"))
        }
    }
}

module.exports = new ServicesController()