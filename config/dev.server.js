const path = require('path')
const logger = require('morgan')
const express = require('express')
const feedback_success = require('../static/mock/feedback_success.json')
const feedback_error = require('../static/mock/feedback_error.json')
const contacts_check_safe = require('../static/mock/contacts_check_safe.json')
const contacts_check_danger = require('../static/mock/contacts_check_danger.json')
const regions_search = require('../static/mock/regions_search.json')

function run(port) {
  const app = express()
  const router = express.Router()

  // every request gets logged
  router.use(logger())

  // POST method route
  router.post('/mock/feedback_success.json', function(req, res) {
    // send a JSON response
    res.json(feedback_success)
  })
  router.post('/mock/feedback_error.json', function(req, res) {
    res.json(feedback_error)
  })
  router.post('/mock/contacts_check_safe.json', function(req, res) {
    res.json(contacts_check_safe)
  })
  router.post('/mock/contacts_check_danger.json', function(req, res) {
    res.json(contacts_check_danger)
  })
  router.post('/mock/regions_search.json', function(req, res) {
    res.json(regions_search)
  })

  // express.static serves all static files
  router.use('/', express.static(path.resolve(__dirname, '../static')))

  // load the router module in the app
  app.use('/static', router)

  // start app
  app.listen(port)
}

module.exports = { run }
