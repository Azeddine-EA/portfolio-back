const mongoose = require('mongoose');

const technologySchema = mongoose.Schema({
		socials: [{
    name: String,
    img: String,
    link: String
  }],
		languages: [{
    name: String,
    img: String
  }],
});

const technology = mongoose.model('technologies', technologySchema);

module.exports = technology;
