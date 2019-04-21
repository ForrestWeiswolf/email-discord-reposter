const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('./secrets.js')
}

const app = express()
const port = process.env.PORT || 8080

app.listen(port, () => console.log('Server started on port ', port))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/', routes)

module.exports = app
