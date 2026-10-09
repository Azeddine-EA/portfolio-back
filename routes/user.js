var express = require('express');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/user');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
	// 1. Vérification des champs
	if (!checkBody(req.body, ['name', 'pwd', 'email'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}

	// 2. Vérification format email
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	if (!regex.test(req.body.email)) {
		res.json({ result: false, error: 'Invalid email format' });
		return;
	}

	// 3. Vérification existence utilisateur
	User.findOne({ email: req.body.email }).then(data => {
		if (data === null) {
			const hash = bcrypt.hashSync(req.body.pwd, 10);

			const newUser = new User({
				email: req.body.email,
				name: req.body.name,
				pwd: hash,
				token: uid2(32),
			});

			// 4. Sauvegarde du User
			newUser
				.save()
				.then(newDoc => {
				})
				.catch(err => {
					// Erreur lors de la sauvegarde du user
					res.status(500).json({ result: false, error: 'User save failed' });
				});
		} else {
			// Utilisateur existe déjà
			res.json({ result: false, error: 'Email already exists' });
		}
	});
});


router.post('/signin', (req, res) => {
  // 	console.log('====================');
	// console.log('SIGNIN APPELÉ');
	// console.log('BODY :', req.body);
	// console.log('====================');

	// res.json({
	// 	result: true,
	// 	message: 'La route signin fonctionne'
	// });
  
	if (!checkBody(req.body, ['email', 'pwd'])) {
		return res.json({ result: false, error: 'Missing or empty fields' });
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user && bcrypt.compareSync(req.body.pwd, user.pwd)) {
			res.json({
				result: true,
				token: user.token,
				name: user.name,
				email: user.email,
			});
		} else {
			res.json({ result: false, error: 'User not found or wrong password' });
		}
	});
});



module.exports = router;