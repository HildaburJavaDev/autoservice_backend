const jwt = require('jsonwebtoken')
// проверяем роль пользователя
module.exports = function (allowedRoles) {
	return async function (req, res, next) {
		if (req.method === "OPTIONS") {
			next()
		}
		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) return res.status(401).json({ message: "Не авторизован" })
			const decoded = jwt.verify(token, process.env.SECRET_KEY)
			console.log(decoded)
			if (!allowedRoles.includes(decoded.role)) return res.status(403).json({ message: "Нет доступа" })
			req.user = decoded;
			next()
		} catch (e) {
			console.log(e)
			res.status(401).json({ message: "Не авторизован" })
		}
	};
}
