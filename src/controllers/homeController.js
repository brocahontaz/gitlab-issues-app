'use strict'

require('dotenv').config()

const fetch = require('node-fetch')
const moment = require('moment')

const DateFormats = {
  short: 'MMM Do YY',
  long: 'MMMM Do YYYY, HH:mm:ss'
}

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
    const eventData = req.body
    res.sendStatus(200)
    // console.log('test', JSON.stringify(data))
    // console.log('test2', data)
    // console.log('test3', req.body)
    // const json = JSON.parse(data)
    // console.log(req.headers)
    // console.log(data)
    console.log('kind', eventData.object_kind)
    console.log('type', eventData.event_type)
    let event = {}
    let data = {}

    if (req.headers['x-gitlab-token'] === process.env.SECRET) {
      if (req.headers['x-gitlab-event'] === 'Note Hook' && req.body.object_attributes.noteable_type === 'Issue') {
        data = {
          id: eventData.issue.id,
          title: eventData.issue.title,
          url: eventData.object_attributes.url,
          state: eventData.object_attributes.state,
          labels: eventData.object_attributes.labels ? eventData.object_attributes.labels : null,
          createdAt: moment(eventData.object_attributes.created_at).format(DateFormats.long),
          updatedAt: moment(eventData.object_attributes.updated_at).format(DateFormats.long),
          author: eventData.user.name,
          authorUrl: 'https://gitlab.lnu.se/' + eventData.user.name,
          authorAvatar: eventData.user.avatar_url,
          description: eventData.object_attributes.note,
          comments: 0,
          upvotes: 0,
          downvotes: 0
        }
        event = { type: 'note', action: 'note', data }
      } else if (req.headers['x-gitlab-event'] === 'Issue Hook') {
        data = {
          id: eventData.object_attributes.id,
          title: eventData.object_attributes.title,
          url: eventData.object_attributes.url,
          state: eventData.object_attributes.state,
          labels: eventData.object_attributes.labels ? eventData.object_attributes.labels : null,
          createdAt: moment(eventData.object_attributes.created_at).format(DateFormats.long),
          updatedAt: moment(eventData.object_attributes.updated_at).format(DateFormats.long),
          author: eventData.user.name,
          authorUrl: 'https://gitlab.lnu.se/' + eventData.user.name,
          authorAvatar: eventData.user.avatar_url,
          description: eventData.object_attributes.description,
          comments: 0,
          upvotes: 0,
          downvotes: 0
        }

        event = { type: 'issue', action: eventData.object_attributes.action, data }
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
