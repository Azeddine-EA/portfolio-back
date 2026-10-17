var express = require('express');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/user');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');





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