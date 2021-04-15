var mongoose 			  = require("mongoose"),
	// uniqueValidator		  = require("mongoose-unique-validator"),
	passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	// password: {
	// 	type: String,
	// 	required: true,
	// 	minlength: 8
	// }
	// email: String,
	// username: String,
	password: String
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("HouseEasyUser", userSchema);