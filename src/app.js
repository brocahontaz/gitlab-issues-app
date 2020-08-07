'use strict'

require('dotenv').config()

const http = require('http')
const express = require('express')
const socket = require('socket.io')
const hbs = require('express-hbs')
const path = require('path')
const moment = require('moment')
const logger = require('morgan')

const app = express()
const server = http.createServer(app)
const io = socket.listen(server)

const DateFormats = {
  short: 'MMM Do YY',
  long: 'MMMM Do YYYY, HH:mm:ss'
}

hbs.registerHelper('formatDate', function (datetime, format) {
  if (moment) {
    format = DateFormats[format] || format
    // console.log('datum', datetime)
    return moment(datetime).format(format)
  } else {
    return datetime
  }
})

hbs.registerHelper('cleanLink', function (link) {
  return link.slice(0, -2)
})

app.use(logger('dev'))

app.set('view engine', 'hbs')

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/homeRouter'))

app.use((event, req, res, next) => {
  // console.log('post')
  io.emit('event', event)
})

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

io.on('connection', (socket) => {
  console.log('connected on socket!')
})

server.listen(8080, () => console.log('Testing server at http://localhost:8080'))
