'use strict'

require('dotenv').config()

const fetch = require('node-fetch')

const homeController = {}

const apiUrl = 'https://gitlab.lnu.se/api/v4/projects/'+process.env.PROJECT_ID+'/issues?private_token='+process.env.ACCESS_TOKEN

homeController.index = async (req, res) => {

    try {
    const testFetch = await fetch(apiUrl)

    console.log(testFetch)

    } catch (err) {
        console.log(err)
    }

    const viewData = {}

    res.render('home/index')
}

module.exports = homeController