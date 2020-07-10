const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config/secret')

function grabToken(req, res) {
	res.json({ token: jsonwebtoken.sign({ user: 'johnnyappleseed' }, secret) })
}

module.exports = {
	grabToken,
	secret
}