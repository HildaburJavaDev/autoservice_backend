const { Sequelize } = require('sequelize')


// конструируем объект для соединения с БД. Все данные берутся с файла .env окружения
module.exports = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT
	}
)