import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/affix',
      name: 'affix',
      component: () => import('@/views/affixPage')
    },
    {
      path: '/alert',
      name: 'alert',
      component: () => import('@/views/alertPage')
    },
    {
      path: '/anchor',
      name: 'anchor',
      component: () => import('@/views/anchorPage')
    }
  ]
})
