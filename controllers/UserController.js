const APIErrors = require("../errors/APIErrors")
const jwt = require('jsonwebtoken')
const { User } = require("../models/models")


const generateJwt = (id, role) => {
	return jwt.sign(
		{ id, role },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}

class UserController {
    async sign(req, res, next) {
        try {
            console.log(req.query)
            const {phoneNumber, firstname} = req.query
            let candidate = await User.findOne({where: {phoneNumber}})
            if (!candidate) {
                candidate = await User.create({
                    firstname: firstname,
                    phoneNumber: phoneNumber
                })
            }
            else {
                if (candidate.firstname != firstname) {
                    return next(APIErrors.badRequest("Ошибка авторизации"))
                }
            }
            return res.json(candidate)
        } catch (error) {
            next(APIErrors.body("Ошибка регистрации"))
        }
        
    }

    async signin(req, res, next) {
        try {
            console.log(req.query)
            const {phoneNumber, firstname} = req.body
            let candidate = await User.findOne({where: {phoneNumber}})
            if (!candidate) {
                candidate = await User.create({
                    firstname: firstname,
                    phoneNumber: phoneNumber
                })
            }
            else {
                if (candidate.firstname != firstname) {
                    return next(APIErrors.badRequest("Ошибка авторизации"))
                }
            }
            return res.json(candidate)
        } catch (error) {
            next(APIErrors.body("Ошибка регистрации"))
        }
        
    }

    async registerEmployee(req, res, next) {
        try {
            const {phoneNumber, firstname, role} = req.body
            const existingUser = await User.findOne({ where: { phoneNumber, firstname } });
            if (existingUser) {
                throw new Error("Пользователь с такими данными уже зарегистрирован");
            } 
            return res.json(await User.create({phoneNumber, firstname, role}))
        } catch (error) {
            return next(APIErrors.badRequest("Ошибка регистрации: " + error.message))
        }
    }


    async getProfile(req, res, next) {
        try {
            return res.json(await User.findOne({where: {id: req.query.id},
                attributes: { exclude: ['role'] }}))
        } catch (error) {
            return next(APIErrors.badRequest("Ошибка: " + error.message))
        }
    }

    async updateProfile(req, res, next) {
        try {
            console.log("here")
            console.log(req.query)
            const updatedUser = await User.update(
                {
                    firstname: req.query.name,
                    phoneNumber: req.query.phone,
                    mark: req.query.brand,
                    model: req.query.model
                },
                { where: { id: req.query.id } }
            );
            return res.json(updatedUser);
        } catch (error) {
            return next(APIErrors.internalQuery("Ошибка: " + error.message));
        }
    }
    
}

module.exports = new UserController()