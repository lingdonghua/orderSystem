import axios from 'axios'

const request = axios.create({
  baseURL:'/api',
  // baseURL:'http://localhost:8081',
// withCredentials:true,//允许session跨域
  setTimeout:10000
})
//请求和响应拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default request