import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      return import("../views/recordings/RecordingSearch.vue");
    }
  },

  {
    path: '/artists',
    name: 'ArtistSearch',
    component: () => {
      return import("../views/artists/ArtistSearch.vue");
    }
  },

  {
    path: '/recordings/:id',
    name: 'RecordingDetail',
    component: () => {
      return import("../views/recordings/RecordingDetail.vue");
    }
  },

  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: () => {
      return import("../views/artists/ArtistDetail.vue");
    }
  },
]

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // {
  //   path: '/recordings',
  //   name: 'recording_search',
  //   component: RecordingSearchView
  // },
  // {
  //   path: '/artists',
  //   name: 'artist_search',
  //   component: ArtistSearchView
  // },
  // {
  //   path: '/recording/:id',
  //   name: 'recording',
  //   component: RecordingView
  // },
  // {
  //   path: '/artist/:id',
  //   name: 'artist',
  //   component: ArtistView
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

export default router
