/* --- @imports --- */
const mongoose = require('mongoose');

/* --- @code --- */
const peopleSchema = new mongoose.Schema({
	name : {type : String, required : false},
	cpf_rg : {type : String, required : false},
	nis : {type : String, required : false},
	phone : {type : String, required : false},
	local: {type: String, required: false}
}, { strict: false });

/* --- @exports --- */
module.exports = mongoose.model('People', peopleSchema);


