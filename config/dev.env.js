'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const devServer = require('./dev.server')
const port = require('./index').dev.devServerPort

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
})

devServer.run(port)
