import Vue from 'vue'
import App from './App.vue'

import router from '@/router/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  var token = localStorage.getItem('heima_manager_token')
  if(token || to.path === '/login'){
    next()
  }else if(!token && to.path !=='/login'){
    next({
      name: 'login'
    })
  }
  
})
new Vue({

  router,
  render: h => h(App)
}).$mount('#app')
