import { createRouter, createWebHistory } from 'vue-router'

import MainView from '@/modules/main/views/MainView.vue'
import HomeView from '@/modules/main/components/HomeView.vue'

import clientesRouter from '@/modules/clientes/router/clientesRouter.js'
import funcionariosRouter from '@/modules/funcionarios/router/funcionariosRouter.js'


const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'Main',
      component: MainView,
      children: [
        {
          path: '/',
          name: 'Inicio',
          component: HomeView,
          meta: { title: 'Inicio' }
        },

        clientesRouter,
        funcionariosRouter
      ]
    }
  ]
})

export default router
