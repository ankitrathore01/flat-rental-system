var mongoose 			  = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose")

var propertySchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	review: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	listingType: String,
	beds: String,
	baths: String,
	size: String,
	rent: String,
	deposit: String,
	date: Date,
	days: String,
	address:{
		line1: String,
		line2: String,
		city: String,
		state: String,
		zip: String,
	},
	role: String,
	details:{
		fName: String,
		mName: String,
		lName: String,
		email: String,
		phone: String,
		preference: String,
	},
	info: String,
	image: String
});
propertySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Property", propertySchema);