/* --- @imports --- */
const ApiError = require('./apiError');

/* --- @code --- */
const apiErrorHandler = (err, req, res, next) => {
	if (err instanceof ApiError){
		res.status(err.code).json(err.message);
	}
}

/* --- @exports --- */
module.exports = apiErrorHandler;