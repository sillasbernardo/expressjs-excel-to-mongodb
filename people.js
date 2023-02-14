const mongoose = require('mongoose');
const { Schema } = mongoose;
const peopleSchema = new Schema({
	id_number : {type : String, required : false},
	record_number : {type : String, required : false},
	name : {type : String, required : false},
	cpf_rg : {type : String, required : false},
	nis : {type : String, required : false},
	phone : {type : String, required : false},
	neighborhood: {type: String, required: false}
})

module.exports = mongoose.model('People', peopleSchema);