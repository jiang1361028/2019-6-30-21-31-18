import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/index.vue'
Vue.use(VueRouter)

// 创建路由对象
var router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/home',
      component: Home,
      redirect: {
        name: 'Welcome'
      },
      children: [
        {
          name: 'Welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'Users',
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})

export default router
