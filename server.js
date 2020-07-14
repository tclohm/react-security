const express = require('express')
const cors = require('cors')
const jwt = require('express-jwt')
const cookieParser = require('cookie-parser')
const { grabToken, secret } = require('./middleware/restricted')
const csrf = require('csurf')

const app = express()

const csrfProtection = csrf({ cookie: true })

app.use(cors())

app.get('/jwt', (req, res) => {
	const token = grabToken(req, res)
	// http -- means the cookie cannot be read using JS but can 
	// still be sent back to the server in HTTP requests
	// XSS (cross site scripting) attack could use document.cookie
	// to get a list of stored cookies and their values
	res.cookie('token', token, { httpOnly: true })
	res.json({ token })
})

app.use(cookieParser())
app.use(csrfProtection)

app.get('/csrf-token', (req, res) => {
	res.json({ csrfToken: req.csrfToken() })
})

app.use(
	jwt({ 
		secret: secret, 
		getToken: req => req.cookies.token, 
		algorithms: ['HS256'] 
	})
)

const foods = [
	{ id: 1, item: 'ginger tofu' },
	{ id: 2, item: 'ahi tuna sushi' },
	{ id: 3, item: 'caramelized shallot pasta' }
]

app.get('/foods', (req, res) => res.json(foods))

app.post('/foods', (req, res) => {
	foods.push({ id: foods.length + 1, item: 'new food' })
	res.json({ message: 'Food created!' })
})

module.exports = app;