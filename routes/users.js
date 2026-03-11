var express = require('express');
var router = express.Router();
require('../models/connection');

// Routes utilisateur :
// POST /signup -> crée un utilisateur (mot de passe hashé) + wishlist par défaut, renvoie un token
// POST /signin -> authentifie l'utilisateur et renvoie son token
const { checkBody } = require('../modules/checkBody');
const User = require('../models/user');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.get('/alluser', (req, res) => {
	// 1. Vérification des champs
	User.find().then(users=>{
		res.json({ result: true, users: users });
	})
	});
router.post('/signup', (req, res) => {
	// 1. Vérification des champs
	if (!checkBody(req.body, ['name', 'email', 'pwd'])) {
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
	User.findOne({ mail: req.body.mail }).then(user => {
		if (user === null) {
			const hash = bcrypt.hashSync(req.body.pwd, 10);

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: hash,
				token: uid2(32),
			});

			// 4. Sauvegarde du User
			newUser
				.save()
				.then(newDoc => {
					res.json({ result: true, user: newDoc });
				})
				.catch(err => {
					// Erreur lors de la sauvegarde du user
					res.status(500).json({ result: false, error: 'User save failed' });
				});
		} else {
			// Utilisateur existe déjà
			res.json({ result: false, error: 'User already exists' });
		}
	});
});

router.post('/signin', (req, res) => {
	if (!checkBody(req.body, ['mail', 'password'])) {
		return res.json({ result: false, error: 'Missing or empty fields' });
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user && bcrypt.compareSync(req.body.password, user.password)) {
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
