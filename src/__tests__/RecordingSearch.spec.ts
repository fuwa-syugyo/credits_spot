import { describe, expect, beforeAll, afterEach, it, afterAll } from 'vitest';
import { server } from '../mocks/server';
import { recordingSearchResponse } from "./data/recordingSearchResponse";
import RecordingSearch from "../components/recordings/RecordingSearch.vue";
import { mount } from "@vue/test-utils"
import { render, screen, cleanup } from '@testing-library/vue'

describe('recording search test',
  () => {
    afterEach(cleanup)
    beforeAll(() => server.listen());
    afterAll(() => server.close());

    it('fetch unit test', async() => {
      const response = await fetch('https://musicbrainz.org/ws/2/recording/?query=recording:残酷な天使のテーゼ&offset=0&limit=100&fmt=json');
      const data = await response.json();

      expect(data).toEqual(recordingSearchResponse) }
    )
  }
)
