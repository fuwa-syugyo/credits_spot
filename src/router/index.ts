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
    },
  },
    {
    path: '/recordings/filter',
    name: 'RecordingSearchFilter',
    component: () => {
      return import("../components/recordings/RecordingSearchFilter.vue");
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
    },
    props: (routes) => {
      const idStr = String(routes.params.id);
      return {
        id: idStr
      };
    }
  },

  {
    path: '/recordings/work/:id',
    name: 'RecordingInWork',
    component: () => {
      return import("../components/recordings/RecordingInWork.vue");
    },
    props: (routes) => {
      const idStr = String(routes.params.id);
      return {
        id: idStr
      };
    }
  },

  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: () => {
      return import("../components/artists/ArtistDetail.vue");
    },
    props: (routes) => {
      const idStr = String(routes.params.id);
      return {
        id: idStr
      };
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})

export default router
