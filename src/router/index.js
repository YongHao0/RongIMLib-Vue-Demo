import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Main from '@/components/Main'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/main/:id/:type',
      name: 'Chat',
      component: Main
    },
    {
      path: '/',
      name: 'Main',
      component: Main
    }
  ]
})
