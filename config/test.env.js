'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL: '"http://localhost:3000/v1"',
  SOCKET_URL: '"http://localhost:3000"'
})
