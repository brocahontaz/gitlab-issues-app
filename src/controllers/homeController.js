'use strict'

require('dotenv').config()

const fetch = require('node-fetch')

const homeController = {}

const apiUrl = 'https://gitlab.lnu.se/api/v4/projects/'+process.env.PROJECT_ID+'/issues?private_token='+process.env.ACCESS_TOKEN

homeController.index = async (req, res) => {

    try {
    const data = await fetch(apiUrl)

    const issues = await data.json()

    const viewData = { issues }

    res.render('home/index', viewData)

    console.log(await issues)

    } catch (err) {
        console.log(err)
    }

}

module.exports = homeController