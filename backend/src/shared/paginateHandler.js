/* --- @imports --- */
const ApiError = require('../error/apiError');

/* --- @code --- */
const paginate = (data) => {
	return async (req, res, next) => {
		try {
			const page = req.query.page;
			const limit = req.query.limit;

			// Get data from controller

			// Return the 'limit' of the data passed

		} catch (error) {
			console.error(error);
			return next(ApiError.internal('Something went wrong'))
		}
	}
}

/* --- @exports --- */
module.exports = paginate;

