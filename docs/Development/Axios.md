# Axios

During the development process, Axios needs to be further encapsulated to facilitate its use in the project, which tends to reduce code duplication. 

## Encapsulation

In order to avoid polluting the global Axios and affect other requests when one request modified, we use `src/utils/requests.js` to create a new instance of axios with a custom config. You can switch different base URLs according to different environments. And all JSON mocks used by Axios in development environment have been put in `static/mock/*.json` for the purpose of keeping web's original file structure, which allows you to access them by `http://localhost:8080/static/mock/*.json`. 

When using Axios to Get data and load it in Element UI components, we import `request.js` and create function `loadData()` in Vue methods, then call this method in the hook function `mounted()`: 

```vue
<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      tableData: [],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      request.get('/to/mock/file.json').then((response) => {
        this.tableData = response.data
      })
    },
  },
}
</script>
```

## URL-Encoding

By default, axios serializes JavaScript objects to `JSON`. To send data in the `application/x-www-form-urlencoded` format instead, we config `transformRequest` in `request.js` and use the [`qs`](https://github.com/ljharb/qs) library to encode our data. Make sure that `transformRequest` is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE', so you wouldn't worry about the 'GET' request polluted. 

```shell
# install library
npm i qs@6.5.3 -S --legacy-peer-deps
```

```js
// request.js
const qs = require('qs')
const instance = axios.create({
  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [
    function(data, headers) {
      // Do whatever you want to transform the data
      headers['content-type'] = 'application/x-www-form-urlencoded'
      data = qs.stringify(data)
      return data
    },
  ],
})
```

## Cross-domain

A cross-domain problem happened when a client requests data from the server. Since direct cross-domain access using axios is not feasible, we need to configure the proxy. 

> A proxy server requests data from another server, and then the server returns the requested data to the proxy server, and the proxy server returns the data to the client. 

In the `proxyTable` field in the `index.js` file under the config folder, add the following rule:

```js
// config/index.js

const port = 8080
const devServerPort = 8081

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/': {
        target: `http://localhost:${devServerPort}/static/mock`,
        changeOrigin: true, // override the origin of the host header
        pathRewrite: {
          '^/': '', // replace the request address in the target
        },
      },
    },
    // ...
  }
  // ...
}
```

Now axios will replace the beginning symbol `/` to `http://localhost:${devServerPort}/static/mock` in the request address. Make sure that we cancel baseURL configuration under development environment to avoid proxyTable being overridden. 

```js
// src/utils/request.js

const prodBaseURL = 'http://localhost:5000'

let axiosConfig = {
  timeout: 3000,
  // ...
}

// set baseURL under production environment
if (process.env.NODE_ENV === 'production') {
  axiosConfig.baseURL = prodBaseURL
}

const instance = axios.create(axiosConfig)

// ...
```
