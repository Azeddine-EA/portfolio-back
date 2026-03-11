var express = require('express');
var router = express.Router();
const { checkBody } = require('../modules/checkBody');
const Project = require('../models/project');
require('../models/connection');


/* GET users listing. */
router.get('/read', function(req, res) {
  Project.find().then(projects=>{
		// console.log('allProjects', projects);
		res.json({result: true, projects: projects})
	})
});

router.post('/create', (req, res) => {
	// 1. Vérification des champs
	if (!checkBody(req.body, ['name', 'lastname', 'password', 'mail'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}


});

module.exports = router;
