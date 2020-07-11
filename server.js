const express = require('express')
const cors = require('cors')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const { grabToken, secret } = require('./middleware/restricted')
const app = express()

app.use(cors())

app.get('/jwt', (req, res) => {
	res.json({ token: jsonwebtoken.sign({ user: 'john'}, secret )})
})

app.use(jwt({ secret: secret }))

const foods = [
	{ id: 1, item: 'ginger tofu' },
	{ id: 2, item: 'ahi tuna sushi' },
	{ id: 3, item: 'caramelized shallot pasta' }
]

app.get('/foods', (req, res) => {
	res.json(foods)
})

module.exports = app;