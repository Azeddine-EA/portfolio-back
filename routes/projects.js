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
	if (!checkBody(req.body, ['name', 'desc', 'language', 'startDate','endDate'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}

	Project.findOne({name:req.body.name}).then(project=>{
		if(project===null){

			const languages = req.body.language.split(' ').map(lang => lang.trim()).filter(Boolean);

			// transformer les dates en Date
		const startDate = new Date(req.body.startDate);
		const endDate = new Date(req.body.endDate);

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return res.status(400).json({ result: false, error: 'Invalid date format' });
		}

		// vérifier que la date de fin est après la date de début
		if (endDate < startDate) {
			return res.status(400).json({ result: false, error: 'End date must be after start date' });
		}

			const newProject = new Project({

				name:req.body.name,
				desc:req.body.desc,
				language:languages,
				startDate: startDate,
				endDate: endDate
			});
			newProject.save().then(newPro=>{
				res.json({result:true, project:newPro});
			})
			.catch(err => {
					// Erreur lors de la sauvegarde du user
					console.error(err);
					res.status(500).json({ result: false, error: 'Porject save failed ' });
				});
		} else{
			res.json({ result: false, error: 'Project Name already exists' });

		}
	})

});

module.exports = router;
