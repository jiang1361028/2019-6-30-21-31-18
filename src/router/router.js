import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/ Home.vue'
Vue.use(VueRouter)

// 创建路由对象
var router = new VueRouter({
  routes: [{
    name: 'login',
    path: '/login',
    component: Login
  }]
})

export default router