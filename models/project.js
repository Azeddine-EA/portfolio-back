const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	name: String,
	img: String,
	desc: String,
	language: [String],
	startDate: Date,
	endDate: Date
});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
