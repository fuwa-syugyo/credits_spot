import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import NotFound from '../components/NotFound.vue'

export const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { title: 'Music Credit Search' }
  },

  {
    path: '/recordings',
    name: 'RecordingSearch',
    component: () => {
      return import("../components/recordings/RecordingSearch.vue");
    },
    meta: { title: '楽曲検索結果'}
  },
    {
    path: '/recordings/filter',
    name: 'RecordingSearchFilter',
    component: () => {
      return import("../components/recordings/RecordingSearchFilter.vue");
    },
    meta: { title: '楽曲絞り込み結果'}
  },

  {
    path: '/artists',
    name: 'ArtistSearch',
    component: () => {
      return import("../components/artists/ArtistSearch.vue");
    },
    meta: { title: '人物検索結果'}
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
    },
    meta: { title: '楽曲情報詳細'}
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
    },
    meta: { title: '曲群表示'}
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
    },
    meta: { title: '人物情報詳細'}
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'エラー'}
  },
]

const DEFAULT_TITLE = 'Simple Music Credit'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings
})
router.afterEach((to) => {
  document.title = to.meta.title as string || DEFAULT_TITLE
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', '曲に関わった人から楽曲を調べたい人向けの検索サイトです。すぐにSpotifyで気になる曲を聴くことができます。');
  }
})

export default router
