import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import NotFound from '../components/NotFound.vue'
import Caution from '../components/Caution.vue'

export const routeSettings: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'CreditsSpot',
      desc: '曲に関わった人から音源を調べたい人向けの検索サイトです。すぐにSpotifyで気になる曲を聴くことができます。',
    },
  },

  {
    path: '/recordings',
    name: 'RecordingSearch',
    component: () => {
      return import('../components/recordings/RecordingSearch.vue')
    },
    meta: { title: '音源検索結果', desc: '音源検索結果表示画面です。' },
  },
  {
    path: '/recordings/filter',
    name: 'RecordingSearchFilter',
    component: () => {
      return import('../components/recordings/RecordingSearchFilter.vue')
    },
    meta: {
      title: '音源絞り込み結果',
      desc: '音源検索結果の絞り込み結果画面です。',
    },
  },

  {
    path: '/artists',
    name: 'ArtistSearch',
    component: () => {
      return import('../components/artists/ArtistSearch.vue')
    },
    meta: { title: '人物検索結果', desc: '人物検索結果表示画面です。' },
  },

  {
    path: '/recordings/:id',
    name: 'RecordingDetail',
    component: () => {
      return import('../components/recordings/RecordingDetail.vue')
    },
    props: (routes) => {
      const idStr = String(routes.params.id)
      return {
        id: idStr,
      }
    },
    meta: {
      title: '音源情報詳細',
      desc: '音源情報表示画面です。Spotifyで聴くことができる音源については、リンクがあります。',
    },
  },

  {
    path: '/recordings/work/:id',
    name: 'RecordingInWork',
    component: () => {
      return import('../components/recordings/RecordingInWork.vue')
    },
    props: (routes) => {
      const idStr = String(routes.params.id)
      return {
        id: idStr,
      }
    },
    meta: {
      title: '曲群表示',
      desc: 'カバー曲やインストゥルメンタル音源なども含めて表示します。',
    },
  },

  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: () => {
      return import('../components/artists/ArtistDetail.vue')
    },
    props: (routes) => {
      const idStr = String(routes.params.id)
      return {
        id: idStr,
      }
    },
    meta: { title: '人物情報詳細', desc: '人物情報表示画面です。' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'エラー', desc: 'エラー画面です。' },
  },
  {
    path: '/caution',
    name: 'Caution',
    component: Caution,
    meta: { title: 'ご利用上の注意', desc: 'ご利用上の注意です。' },
  },
]
const DEFAULT_TITLE = 'CreditsSpot'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeSettings,
})
router.afterEach((to) => {
  document.title = (to.meta.title as string) || DEFAULT_TITLE
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', (to.meta.desc as string) || '')
  }
})

export default router
