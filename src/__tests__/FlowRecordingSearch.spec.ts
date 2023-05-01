import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'

import { describe, expect, beforeAll, afterEach, it, afterAll, vi, beforeEach } from 'vitest';
import { server } from '../mocks/server';
import { nextTick, createApp } from 'vue'
import { mount } from '@vue/test-utils'
import { useRouter, useRoute, createRouter, createWebHistory, Router } from 'vue-router'
import   routes    from "../router"
import { routeSettings } from "../router"

import SearchForm from '../components/SearchForm.vue'
import RecordingSearch from '../components/recordings/RecordingSearch.vue'
import RecordingDetail from '../components/recordings/RecordingDetail.vue'

let router: Router;
const clonedRoutes = routeSettings.map(route => Object.assign({}, route));

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes: clonedRoutes
  })
  router.push('/')
  await router.isReady()
  console.log(router)
});

describe('楽曲の検索', () => {
  it('曲名入力', async() => {
    const searchFormWrapper = mount(SearchForm, {
      global: {
        plugins: [router],
      }
    })

    const recordingSearchWrapper = mount(RecordingSearch, {
      global: {
        plugins: [router],
      }
    })

    const radioButtons = searchFormWrapper.findAll('input[type="radio"]');
    const input = searchFormWrapper.get('[placeholder="検索"]').element;

    await radioButtons[0].trigger('click');
    await userEvent.type(input, '残酷な天使のテーゼ');
    await searchFormWrapper.findComponent({ name: 'SearchForm' }).trigger('submit')

    console.log('???!!' + router)
    //ここでfetchのモックテスト？
  //   await fetch('https://musicbrainz.org/ws/2/recording/?query=recording:残酷な天使のテーゼ&offset=0&limit=100&fmt=json').then((res) =>
  //   res.json()
  // );
  console.log('???' + useRoute())

    await nextTick()
    expect(recordingSearchWrapper.text()).toContain("河井英里") //ここで「河井英里が表示されていない」というエラー

    // const { getByText } = render(RecordingSearch);
    // const recordingSearchWrapper = wrapper.findComponent(RecordingSearch)
    // expect(recordingSearchWrapper.exists()).toBe(true)

    // expect(searchInput).getByText('残酷な天使のテーゼ');
  });
});
