/**
 * Home controller
 *
 * @author Johan Andersson
 * @version 1.0
 */

'use strict'

require('dotenv').config()

const fetch = require('node-fetch')
const moment = require('moment')

// Date formats
const DateFormats = {
  short: 'MMM Do YY',
  long: 'MMMM Do YYYY, HH:mm:ss'
}

const homeController = {}

const apiUrl = 'https://gitlab.lnu.se/api/v4/projects/' + process.env.PROJECT_ID + '/issues?private_token=' + process.env.ACCESS_TOKEN

/**
 * Render the home page, with all issues
 *
 * @param {object} req the Express request object
 * @param {object} res the Express response object
 * @param {object} next the Express forward object
 */
homeController.index = async (req, res, next) => {
  try {
    const data = await fetch(apiUrl)

    const issues = await data.json()

    issues.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

    const viewData = { issues }

    res.render('home/index', viewData)
  } catch (err) {
    next(err)
  }
}

/**
 * Receive data from webhook
 *
 * @param {object} req the Express request object
 * @param {object} res the Express response object
 * @param {object} next the Express forward object
 */
homeController.receive = (req, res, next) => {
  try {
    const eventData = req.body
    res.sendStatus(200)
    let event = {}
    let data = {}

    // Control that token is correct = source is gitlab
    if (req.headers['x-gitlab-token'] === process.env.SECRET) {
      // Check if event is a new comment on an issue, create notification event to dispatch
      if (req.headers['x-gitlab-event'] === 'Note Hook' && req.body.object_attributes.noteable_type === 'Issue') {
        data = {
          id: eventData.issue.id,
          iid: eventData.issue.iid,
          title: eventData.issue.title,
          url: eventData.object_attributes.url,
          state: eventData.issue.state,
          labels: eventData.object_attributes.labels ? eventData.object_attributes.labels : null,
          createdAt: moment(eventData.object_attributes.created_at).format(DateFormats.long),
          updatedAt: moment(eventData.object_attributes.updated_at).format(DateFormats.long),
          author: eventData.user.name,
          authorUrl: 'https://gitlab.lnu.se/' + eventData.user.username,
          authorAvatar: eventData.user.avatar_url,
          description: eventData.object_attributes.note,
          comments: 0,
          upvotes: 0,
          downvotes: 0
        }
        event = { type: 'note', action: 'note', data }
        // Check if event is a new issue, create new issue event to dispatch
      } else if (req.headers['x-gitlab-event'] === 'Issue Hook') {
        data = {
          id: eventData.object_attributes.id,
          iid: eventData.object_attributes.iid,
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
      next(event)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = homeController
