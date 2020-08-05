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

homeController.receive = async (req, res) => {
    try {
        const data = req.body
        //const json = JSON.parse(data)
        console.log(req.headers)
        console.log(data)

        if (req.headers['x-gitlab-token'] === process.env.SECRET) {
            console.log('secret works')
        }
    } catch (err) {
        console.log(err)
    }
    //console.log(req.body.json())
}

module.exports = homeController