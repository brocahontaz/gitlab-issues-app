'use strict'

require('dotenv').config()

const express = require('express')
const hbs = require('express-hbs')
const path = require('path')

const app = express()

app.set('view engine', 'hbs')

app.engine('hbs', hbs.express4({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}))

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/homeRouter'))

app.listen(8080, () => console.log('Testing server at http://localhost:8080'))