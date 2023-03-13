import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../components/HomeView.vue'

const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/recordings',
    name: 'RecordingSearch',
    component: () => {
      return import("../components/recordings/RecordingSearch.vue");
    }
  },

  {
    path: '/artists',
    name: 'ArtistSearch',
    component: () => {
      return import("../components/artists/ArtistSearch.vue");
    }
  },

  {
    path: '/recordings/:id',
    name: 'RecordingDetail',
    component: () => {
      return import("../components/recordings/RecordingDetail.vue");
    }
  },

  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: () => {
      return import("../components/artists/ArtistDetail.vue");
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

export default router
