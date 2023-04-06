import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeView from "../components/HomeView.vue";

describe(
  "HomeView.vueのテスト",
  () => {
    test(
      "表示内容テスト",
      () => {
        const wrapper = mount(HomeView);
        const actual = wrapper.get("p").text();
        const expected = "このサイトは、曲のクレジット情報を調べたり、人物名から関わった曲名を調べることができるサービスです。";
        expect(actual).toBe(expected);
      }
    )
  }
)
