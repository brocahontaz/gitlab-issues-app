/**
 * Main starting point of application
 *
 * @author Johan Andersson
 * @version 1.0
 */

'use strict'

require('dotenv').config()

const http = require('http')
const express = require('express')
const socket = require('socket.io')
const hbs = require('express-hbs')
const path = require('path')
const moment = require('moment')
const logger = require('morgan')

// Set up server with http, express and socket.io
const app = express()
const server = http.createServer(app)
const io = socket.listen(server)

// Date formats
const DateFormats = {
  short: 'MMM Do YY',
  long: 'MMMM Do YYYY, HH:mm:ss'
}

// Register formatDate helper for hbs
hbs.registerHelper('formatDate', function (datetime, format) {
  if (moment) {
    format = DateFormats[format] || format
    // console.log('datum', datetime)
    return moment(datetime).format(format)
  } else {
    return datetime
  }
})

// Register cleanLink helper for hbs
hbs.registerHelper('cleanLink', function (link) {
  return link.slice(0, -2)
})

// Set up logger
app.use(logger('dev'))

// Set up view engine
app.set('view engine', 'hbs')

// Configure view engine
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))

// Configure views path
app.set('views', path.join(__dirname, 'views'))

// Set up body usage
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Set up static path
app.use('/', express.static(path.join(__dirname, 'public')))

// Set up routes
app.use('/', require('./routes/homeRouter'))

// Set up socket middleware
app.use((event, req, res, next) => {
  io.emit('event', event)
})

// Handle errors
app.use((err, req, res, next) => {
  if (err.statusCode === 403) {
    err.message = 'Resource forbidden!'
  } else if (err.statusCode === 404) {
    err.message = 'Resource not found!'
  } else if (err.statusCode === 500) {
    err.message = 'Internal server error!'
  }
  res.status(err.statusCode || 500).render('errors/error', { err })
})

// Connection to socket successful
io.on('connection', (socket) => {
  console.log('connected on socket!')
})

// Test server
server.listen(process.env.PORT, () => console.log('Testing server at http://localhost:' + process.env.PORT, 'NODE_ENV is set to: ' + process.env.NODE_ENV))
