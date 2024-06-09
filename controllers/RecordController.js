const { where } = require("sequelize")
const APIErrors = require("../errors/APIErrors")
const { Records, UserServices, Services, sequelize, User } = require("../models/models");
const { query } = require("../db");

class RecordController {
    async getAll(req, res, next) {
        try {
            const query = `
    SELECT 
        r.id, 
        date, 
        start_time, 
        end_time, 
        total_price, 
        box_number, 
        u.firstname, 
        u."phoneNumber",
        (SELECT string_agg(s.title, ',') 
         FROM user_services us 
         JOIN services s ON s.id = us."serviceId"
         WHERE us."recordId" = r.id) AS service_ids
    FROM 
        records r
    JOIN 
        "user" u ON u.id = r.user_id
    ORDER BY 2 DESC, 3 DESC;
`;

const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
return res.json(results)
        } catch (error) {
            console.log(error.message)
            next(APIErrors.internalQuery('Bad request'))
        }
    }

    async getOne(req, res, next) {
        try {
            const query = `
    SELECT 
        r.id, 
        date, 
        start_time, 
        end_time, 
        total_price, 
        box_number, 
        u.firstname, 
        u."phoneNumber",
        (SELECT string_agg(s.title, ',') 
         FROM user_services us 
         JOIN services s ON s.id = us."serviceId"
         WHERE us."recordId" = r.id) AS service_ids
    FROM 
        records r
    JOIN 
        "user" u ON u.id = r.user_id
    WHERE r.id = ${req.params.recordId}
`;

const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
return res.json(results)
        } catch (error) {
            console.log(error.message)
            next(APIErrors.internalQuery('Bad request'))
        }
    }

    async getByDate(req, res, next) {
        try {
            const {date} = req.body
            if (isNaN(Date.parse(date))) {
                throw new Error('Неверный формат даты');
            }
            const query = `
                    SELECT 
                        r.id, 
                        date, 
                        start_time, 
                        end_time, 
                        total_price, 
                        box_number, 
                        u.firstname, 
                        u."phoneNumber",
                        (SELECT string_agg(s.title, ',') 
                        FROM user_services us 
                        JOIN services s ON s.id = us."serviceId"
                        WHERE us."recordId" = r.id) AS service_ids
                    FROM 
                        records r
                    JOIN 
                        "user" u ON u.id = r.user_id
                    WHERE date = ${date}
                `;
    const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    return res.json(results)
        } catch (error) {
            next(APIErrors.badRequest(error.message))
        }
    }

    async createRecordFromApp(req, res, next) {
        try {
            console.log(req.query)
            return res.json(await Records.create({ 
                date: req.query.date, 
                start_time: req.query.start_time, 
                end_time: req.query.start_time, 
                user_id: req.query.id,
                comment: req.query.comment
            }))
        } catch (error) {
            return res.json(next(APIErrors.badRequest(error.message)))
        }
    }

    async createRecord(req, res, next) {
        try {
            console.log("req.body = " + req.body)
            const { id_services, date, start_time, user_id } = req.body;
            let price = 0, duration = 0;
            let services = [];
            for (const id_service of id_services) {
                const service = await Services.findByPk(id_service);
                price += service.price;
                duration += service.duration;
                services.push(service);
            }
            const startTime = new Date(date + ' ' + start_time);
            const endTime = new Date(startTime.getTime() + duration * 60000);
            const record = await Records.create({
                date,
                start_time,
                end_time: endTime.toTimeString().slice(0, 8),
                total_price: price,
                box_number: 0,
                user_id
            });
            console.log()
            for (const service of services) {
                await UserServices.create({
                    userId: user_id,
                    serviceId: service.id,
                    recordId: record.id
                })
            }
            return res.status(201).json({ message: 'Запись успешно создана' });
        } catch (error) {
            console.log(error)
            return next(APIErrors.badRequest('Ошибка при создании записи'));
        }
    }

    async addServices(req, res, next) {
        try {
            const {user_id} = await Records.findOne({where: {id: req.params.recordId}})
            const {services} = req.body
            for (let serviceId of services) {
                const query = `
                    INSERT INTO user_services  (\"userId\", \"serviceId\", \"recordId\") 
                    VALUES (${user_id}, ${serviceId}, ${req.params.recordId})
                `;
                await sequelize.query(query, { type: sequelize.QueryTypes.INSERT });
            }
            console.log("here")
            const query = `
            SELECT SUM(s.price) AS total_sum FROM user_services us
            JOIN services s ON us."serviceId" = s.id
            WHERE us."recordId" = ${req.params.recordId}
            `
            const total_sum = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
            console.log(total_sum[0].total_sum)
            const updateQuery = `UPDATE Records SET total_price = ${total_sum[0].total_sum} WHERE id = ${req.params.recordId}`
            await sequelize.query(updateQuery, {type: sequelize.QueryTypes.UPDATE})
            return res.json({total_sum})
        } catch (error) {
            console.log(error.message)
            return next(APIErrors.badRequest('Ошибка'));
        }
    }
}

module.exports = new RecordController