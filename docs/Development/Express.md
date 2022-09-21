# Express

`Express` is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. 

When axios used 'POST' method to request mock data in `/static/mock`, it would throw a 404 error, indicating that the JSON file was not found. We, however, are able to do so using 'GET' method. It is a problem that the server can't response correctly, instead of an issue of axios. In our project, we build a simple web server with Express to deal with the 'POST' 404 error. **Note that the server will only work under development environment**. 

## Router

```shell
# Installation
npm i express morgan -D --legacy-peer-deps
```

> `morgan` is a HTTP request logger middleware for node.js. 

To follow the standard, CommonJS, we create a module named `dev.server.js` in `config/` as our Express configuration and startup file: 

```js
// config/dev.server.js

const path = require('path')
const logger = require('morgan')
const express = require('express')
const feedback_success = require('../static/mock/feedback_success.json')
const feedback_error = require('../static/mock/feedback_error.json')

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

  // express.static serves all static files
  router.use('/', express.static(path.resolve(__dirname, '../static')))

  // load the router module in the app
  app.use('/static', router)

  // start app
  app.listen(port)
}

module.exports = { run }
```

The above Express app configuration allows you to access any static resources in `/static` by 'GET' method, meanwhile specific resources such as `/mock/feedback_success.json` can also be gotten by 'POST'. 

## Port Setting

You are allowed to appoint your Express server port in `config/index.js`: 

```js
// config/index.js

const port = 8080
const devServerPort = 8081

module.exports = {
  dev: {
    // ...
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    devServerPort // Express web server port
    // ...
  }
  // ...
}
```

We also set global `process.env` variable `DEVSERVERPORT`, so that you can reference `devServerPort` anywhere in the project. 

```json
// build/webpack.dev.conf.js

//...
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      process.env.DEVSERVERPORT = config.dev.devServerPort // !!!
      // add port to devServer config
      devWebpackConfig.devServer.port = port
      // ...
```

## Usage

Import `dev.server.js` in `config/dev.env.js` and run the server: 

```js
// config/dev.env.js

const devServer = require('./dev.server')
const port = require('./index').dev.devServerPort

// ...

devServer.run(port)
```

For example, when sending 'POST' to `http://localhost:devServerPort/static/mock/feedback_success.json`, you will get the return `{ "res": "1", "msg": "反馈提交成功！" }`. 
