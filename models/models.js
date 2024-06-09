const { DataTypes } = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	firstname: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    mark: {type: DataTypes.STRING},
    model: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'user', validate: {
        isIn: [['admin', 'user', 'mechanic']]
    }}
}, {
	timestamps: false,
	freezeTableName: true
})

const Records = sequelize.define('records', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: {type: DataTypes.DATEONLY, allowNull: false},
    start_time: {type: DataTypes.TIME, allowNull: false},
    end_time: {type: DataTypes.TIME, allowNull: false},
    total_price: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    box_number: {type: DataTypes.INTEGER},
    user_id: {type: DataTypes.INTEGER},
    comment: {type: DataTypes.TEXT}
}, {
	timestamps: false,
	freezeTableName: true
})

const Services = sequelize.define('services', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    duration: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
}, {
	timestamps: false,
	freezeTableName: true
})

const BoxesWorkingTime = sequelize.define('boxes_working_time', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    box_number: {type: DataTypes.INTEGER, allowNull: false},
    date: {type: DataTypes.DATE, allowNull: false},
    working_hours_from: {type: DataTypes.TIME, allowNull: false},
    working_hours_to: {type: DataTypes.TIME, allowNull: false},
    available: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
}, {
	timestamps: false,
	freezeTableName: true
})

const UserServices = sequelize.define('user_services', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, {
	timestamps: false,
	freezeTableName: true
})

UserServices.belongsTo(User);
UserServices.belongsTo(Services);
UserServices.belongsTo(Records);

module.exports = {
    UserServices,
    BoxesWorkingTime,
    Services,
    Records,
    User,
    sequelize
}