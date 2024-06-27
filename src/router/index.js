import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import CityWeather from '../views/CityWeather.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/city/:cityName',
      name: 'CityWeather',
      component: CityWeather,
      props: true
    }
  ]
})

export default router
