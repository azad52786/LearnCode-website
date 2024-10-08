const mongoose = require("mongoose");


// {
// 	"title": "Data Types in python" , 
// 	"timeDuration": "10 minutes" , 
// 	"description": "Learn python basic"
// }
const SubSectionSchema = new mongoose.Schema({
	title: { type: String },
	description : { type: String },
	hours : { type : String } , 
	minutes: { type: String },
	videoUrl: { type: String },
	watched : {
		type : Boolean , 
		default : false , 
	}
});

module.exports = mongoose.model("SubSection", SubSectionSchema);