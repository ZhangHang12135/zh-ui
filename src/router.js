import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/affix',
      name: 'affix',
      component: () => import('_c/affix')
    }
  ]
})
