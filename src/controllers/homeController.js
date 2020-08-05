'use strict'

require('dotenv').config()

const fetch = require('node-fetch')

const homeController = {}

const apiUrl = 'https://gitlab.example.com/api/v4//projects/'+process.env.PROJECT_ID+'/issues?private_token='+process.env.ACCESS_TOKEN

homeController.index = (req, res) => {

    const viewData = {}

    res.render('home/index')
}

module.exports = homeController