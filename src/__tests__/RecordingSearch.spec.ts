import { describe, expect, beforeAll, afterEach, it, afterAll, vi } from 'vitest';
import { server } from '../mocks/server';
import { recordingSearchResponse, recordingSearchResponse2Page } from "./data/recordingSearchResponse";
import RecordingSearch from "../components/recordings/RecordingSearch.vue";
import { mount, shallowMount, RouterLinkStub } from "@vue/test-utils"
import { render, screen, cleanup } from '@testing-library/vue'
import { useRouter } from 'vue-router'
import { createApp } from 'vue'
import router from "../router";

describe('recording search test',
  () => {
    afterEach(cleanup)
    beforeAll(() => server.listen());
    afterAll(() => server.close());

    it('fetch unit test', async() => {
      const response = await fetch('https://musicbrainz.org/ws/2/recording/?query=recording:残酷な天使のテーゼ&offset=0&limit=100&fmt=json');
      const data = await response.json();

      expect(data).toEqual(recordingSearchResponse) }
    ),
    
    it('RecordingSearch onClickHandler test', async() => {
      // const $route = {
      //   path: '/recordings',
      //   hash: '',
      //   query: {term: '残酷な天使のテーゼ'}
      // }

      // const wrapper = mount(RecordingSearch, {
      //   props: {
      //     query: {term: '残酷な天使のテーゼ'}
      //   }
      // })

      // const result = wrapper.vm
      // console.log(result)

      // expect(result).toEqual(recordingSearchResponse2Page)
    })
  }
)
