'use strict'

require('dotenv').config()

const fetch = require('node-fetch')

const homeController = {}

const apiUrl = 'https://gitlab.lnu.se/api/v4/projects/' + process.env.PROJECT_ID + '/issues?private_token=' + process.env.ACCESS_TOKEN

homeController.index = async (req, res) => {
  try {
    const data = await fetch(apiUrl)

    const issues = await data.json()

    const viewData = { issues }

    res.render('home/index', viewData)

    // console.log(await issues)
  } catch (err) {
    console.log(err)
  }
}

homeController.receive = (req, res, next) => {
  try {
    const data = req.body
    res.sendStatus(200)
    // console.log('test', JSON.stringify(data))
    // console.log('test2', data)
    // console.log('test3', req.body)
    // const json = JSON.parse(data)
    // console.log(req.headers)
    // console.log(data)
    console.log('kind', data.object_kind)
    console.log('type', data.event_type)
    let event = {}
    let eventData = {}

    if (req.headers['x-gitlab-token'] === process.env.SECRET) {
      if (req.headers['x-gitlab-event'] === 'Note Hook' && req.body.object_attributes.noteable_type === 'Issue') {
        event = { type: 'note', eventData }
      } else if (req.headers['x-gitlab-event'] === 'Issue Hook') {
        eventData = {
          title: data.object_attributes.title,
          createdAt: data.object_attributes.created_at,
          updatedAt: data.object_attributes.updated_at

        }

        event = { type: 'issue', eventData }
      }
      // console.log('secret works')
      // const event = 'event'
      next(event)
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
  // console.log(req.body.json())
}

module.exports = homeController
