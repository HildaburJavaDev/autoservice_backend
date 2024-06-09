// const { BoxesWorkingTime, Records } = require('../models/models');
const sequelize = require('../db');
const APIErrors = require('../errors/APIErrors');
const { BoxesWorkingTime } = require('../models/models');

class BoxController {
    async findFreeIntervalsForAllBoxes(req, res, next) {
      try {
        const query = `
            SELECT
                b.box_number,
                b.working_hours_from AS box_working_hours_from,
                b.working_hours_to AS box_working_hours_to,
                COALESCE(
                    LEAST(r.start_time, b.working_hours_to),
                    b.working_hours_to
                ) AS closed_interval_start,
                COALESCE(
                    GREATEST(r.end_time, b.working_hours_from),
                    b.working_hours_from
                ) AS closed_interval_end,
                "user"."firstname",
                "user"."phoneNumber"
            FROM
                "boxes_working_time" b
            LEFT JOIN
                "records" r ON "b"."box_number" = "r"."box_number" AND "r"."date" = CURRENT_DATE
            LEFT JOIN
                "user_services" us ON "r"."id" = "us"."recordId"
            LEFT JOIN
                "user" ON "user"."id" = "us"."userId"
            ORDER BY
                "b"."box_number", "closed_interval_start";
        `;

        const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        return res.json(results)
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
  }
  async createSlotForBox(req, res, next) {
    try {
      const {box_number, date, working_hours_from, working_hours_to} = req.body
      if (isNaN(Date.parse(date))) {
        throw new Error('Неверный формат даты');
    }
    return res.json(await BoxesWorkingTime.create({box_number, date, working_hours_from, working_hours_to}))
    } catch (error) {
      next(APIErrors.badRequest(error.message))
    }
  }
}

module.exports = new BoxController(); // Экспортируем экземпляр класса контроллера для использования в других модулях
