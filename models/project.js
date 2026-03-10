const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
	name: String,
	desc: String,
	language: [String],
	date: Date,
});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
