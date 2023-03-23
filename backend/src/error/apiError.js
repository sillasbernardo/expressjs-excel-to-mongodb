/* --- @code --- */
class ApiError {
	constructor (code, message) {
		this.code = code;
		this.message = message;
	}

	static notFound(msg) {
		return new ApiError(404, msg)
	}

	static unauthorized(msg) {
		return new ApiError(401, msg)
	}

	static forbidden(msg) {
		return new ApiError(403, msg)
	}

	static badRequest(msg) {
		return new ApiError(400, msg)
	}

	static internal(msg) {
		return new ApiError(500, msg)
	}
}

/* --- @exports --- */
module.exports = ApiError;