/**
 * Home router
 *
 * @author Johan Andersson
 * @version 1.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

// Routes for index and receiving data from webhook
router.get('/', controller.index)
router.post('/', controller.receive)

module.exports = router
