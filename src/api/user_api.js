import axios from 'axios'
import { type } from 'os'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么?手动传递token
  // 1.获取token
  var token = localStorage.getItem('heima_manager_token')
  // 2.必须在请求头中使用 Authorization 字段提供 token 令牌
  config.headers['Authorization'] = token
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 实现用户登录
export const login = (data) => {
  return axios({
    method: 'post',
    url: 'login',
    data
  })
}

// 获取用户数据列表
export const getUserList = (pa) => {
  return axios({
    url: 'users',
    params: pa
  })
}
// 添加新用户
export const addUser = (data) => {
  console.log(data)
  return axios({
    method: 'post',
    url: 'users',
    data
  })
}
// 修改用户状态
export const updateUserState = (uid, type) => {
  return axios({
    method: 'put',
    url: `users/${uid}/state/${type}`

  })
}
// 删除用户
export const delUser = (id) => {
  return axios({
    method: 'delete',
    url: `users/${id}`
  })
}
