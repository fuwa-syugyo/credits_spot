import { describe, expect, test } from 'vitest';
import { mount } from "@vue/test-utils";
import { handlers } from "../handlers";
import RecordingSearch from "../components/recordings/RecordingSearch.vue";


describe('recording search test',
  () => {
    test(
      'response test',
      async () => {
        const wrapper = mount(RecordingSearch, {
          props: {
            term: 'Hello' // テストに適した検索テキストを指定する
          }
        });
        // await wrapper.vm.onClickHandler(1, "残酷な天使のテーゼ");
        const actual = wrapper
        const expected = handlers[0];
        expect(actual).toBe(expected);
      })
})
