import { errorMsg } from '@/utils/msgsettings.js'
const axios = require('axios')
const qs = require('qs')

const prodBaseURL = 'http://localhost:5000'

let axiosConfig = {
  timeout: 3000,
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
}

// set baseURL under production environment
if (process.env.NODE_ENV === 'production') {
  axiosConfig.baseURL = prodBaseURL
}

const instance = axios.create(axiosConfig)

// Add a request interceptor
instance.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config
  },
  function(error) {
    // Do something with request error
    errorMsg(error)
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log(response)
    return response
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    errorMsg(error)
    console.log(error)
    return Promise.reject(error)
  }
)

export default instance
