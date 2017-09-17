var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER: '"//localhost:8080/<%= projectName %>/api/"',
})
