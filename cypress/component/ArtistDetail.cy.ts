import { OptionsParam } from "../../cypress";
import ArtistDetail from "../../src/components/artists/ArtistDetail.vue";

describe("ArtistDetail tests", () => {
  it("Artist have 3 tables", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/53bfc28e-2c48-4776-8949-1953c78dd187?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_nakatayasutaka_relationship.json" }
    ).as("yasutakaRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=53bfc28e-2c48-4776-8949-1953c78dd187&offset=0&limit=100&fmt=json",
      { fixture: "mock_nakatayasutaka_recording_page1.json" }
    ).as("yasutakaRecording1PageRequest");
    cy.mount(ArtistDetail, {
      props: { id: "53bfc28e-2c48-4776-8949-1953c78dd187" },
    } as OptionsParam);
    cy.wait("@yasutakaRelationshipRequest");
    cy.wait("@yasutakaRecording1PageRequest");

    cy.get(".text-2xl").contains("中田ヤスタカ");
    cy.get("h1").contains("中田ヤスタカ");

    cy.get(":nth-child(2) > .text-lg").contains("作詞作曲した楽曲");
    cy.get(".songwriter-table > tbody > :nth-child(1) > .text-center").contains(
      "composer"
    );
    cy.get(
      ".songwriter-table > tbody > :nth-child(1) > :nth-child(2)"
    ).contains("1mm");

    //担当がcomposerが476件ちょうどか
    cy.get(".songwriter-table > tbody > tr > td")
      .filter(':contains("composer")')
      .should(($trs) => {
        expect($trs, "476 items").to.have.length(476);
      });

    //担当がlyricistが310件ちょうどか
    cy.get(".songwriter-table > tbody > tr > td")
      .filter(':contains("lyricist")')
      .should(($trs) => {
        expect($trs, "310 items").to.have.length(310);
      });

    cy.get(":nth-child(4) > .text-lg").contains("スタッフとして関わった楽曲");
    cy.get(".staff-table > tbody > :nth-child(2) > .text-center").contains(
      "arranger"
    );
    cy.get(".staff-table > tbody > :nth-child(2) > :nth-child(2)").contains(
      "5iVE YEARS MONSTER"
    );

    //担当がproducerが172件ちょうどか
    cy.get(".staff-table > tbody > tr > td")
      .filter(':contains("producer")')
      .should(($trs) => {
        expect($trs, "172 items").to.have.length(172);
      });

    cy.get(":nth-child(6) > .text-lg").contains(
      "アーティストとして関わった楽曲"
    );
    cy.get(".artist-table > tbody > :nth-child(1) > .px-4").contains(
      "一番歌 (Extend-mix)"
    );

    // アーティスト楽曲1ページ目が100件か
    cy.get(".artist-table > tbody > tr > td").should(($trs) => {
      expect($trs, "100 items").to.have.length(100);
    });
    cy.get("p").contains("105 件中 1 〜 100件");

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > :nth-child(7)');
    cy.get(":nth-child(2) > .paginate-buttons").contains("1");

    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=53bfc28e-2c48-4776-8949-1953c78dd187&offset=100&limit=100&fmt=json",
      { fixture: "mock_nakatayasutaka_recording_page2.json" }
    ).as("yasutakaRecording2PageRequest");
    cy.get(":nth-child(4) > .paginate-buttons").contains(">").click();
    cy.wait("@yasutakaRecording2PageRequest");

    // 以下、アーティスト楽曲のページを切り替えてもRelationshipsのデータに変化がないかテスト
    cy.get(".text-2xl").contains("中田ヤスタカ");

    cy.get(":nth-child(2) > .text-lg").contains("作詞作曲した楽曲");
    cy.get(".songwriter-table > tbody > :nth-child(1) > .text-center").contains(
      "composer"
    );
    cy.get(
      ".songwriter-table > tbody > :nth-child(1) > :nth-child(2)"
    ).contains("1mm");

    cy.get(".songwriter-table > tbody > tr > td")
      .filter(':contains("composer")')
      .should(($trs) => {
        expect($trs, "476 items").to.have.length(476);
      });

    cy.get(".songwriter-table > tbody > tr > td")
      .filter(':contains("lyricist")')
      .should(($trs) => {
        expect($trs, "310 items").to.have.length(310);
      });

    cy.get(":nth-child(4) > .text-lg").contains("スタッフとして関わった楽曲");
    cy.get(".staff-table > tbody > :nth-child(2) > .text-center").contains(
      "arranger"
    );
    cy.get(".staff-table > tbody > :nth-child(2) > :nth-child(2)").contains(
      "5iVE YEARS MONSTER"
    );

    cy.get(".staff-table > tbody > tr > td")
      .filter(':contains("producer")')
      .should(($trs) => {
        expect($trs, "172 items").to.have.length(172);
      });
    // ここまで1ページ目のテストと同じ

    cy.get(":nth-child(6) > .text-lg").contains(
      "アーティストとして関わった楽曲"
    );
    cy.get(".artist-table > tbody > :nth-child(1) > .px-4").contains(
      "透明 toumei"
    );

    // アーティスト楽曲2ページ目が5件か
    cy.get(".artist-table > tbody > tr > td").should(($trs) => {
      expect($trs, "5 items").to.have.length(5);
    });
    cy.get("p").contains("105 件中 101 〜 105件");

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > :nth-child(7)');
    cy.get(":nth-child(2) > .paginate-buttons").contains("1");
    cy.get(":nth-child(4) > .paginate-buttons").contains(">");
    cy.get(":nth-child(5) > .paginate-buttons").should("not.be");
  });

  it("Artist have songwriter and staff tables", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/779f1dee-35ca-4b75-8db5-9ae3ce3b16c8?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_otoha_relationship.json" }
    ).as("otohaRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=779f1dee-35ca-4b75-8db5-9ae3ce3b16c8&offset=0&limit=100&fmt=json",
      { fixture: "mock_otoha_recording.json" }
    ).as("otohaRecordingRequest");

    cy.mount(ArtistDetail, {
      props: { id: "779f1dee-35ca-4b75-8db5-9ae3ce3b16c8" },
    } as OptionsParam);
    cy.wait("@otohaRelationshipRequest");
    cy.wait("@otohaRecordingRequest");

    cy.get(".text-2xl").contains("音羽-otoha-");

    cy.get(":nth-child(2) > .text-lg").contains("作詞作曲した楽曲");
    cy.get(".songwriter-table > tbody > :nth-child(1) > .text-center").contains(
      "composer"
    );
    cy.get(
      ".songwriter-table > tbody > :nth-child(1) > :nth-child(2)"
    ).contains("ギターと孤独と蒼い惑星");

    cy.get(":nth-child(4) > .text-lg").contains("スタッフとして関わった楽曲");
    cy.get(".staff-table > tbody > :nth-child(1) > .text-center").contains(
      "guitar"
    );
    cy.get(".staff-table > tbody > :nth-child(1) > :nth-child(2)").contains(
      "【LIVE映像】「青春コンプレックス」/ ぼっち・ざ・ろっく！-SPECIAL STUDIO LIVE-"
    );

    //アーティスト楽曲の表が存在していないかどうか
    cy.get(".artist-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Artist have songwriter and artist tables", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/ae6c957d-c33e-4028-abdd-688bddec3be8?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_higuchiai_relationship.json" }
    ).as("higuchiaiRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=ae6c957d-c33e-4028-abdd-688bddec3be8&offset=0&limit=100&fmt=json",
      { fixture: "mock_higuchiai_recording.json" }
    ).as("higuchiaiRecordingRequest");
    cy.mount(ArtistDetail, {
      props: { id: "ae6c957d-c33e-4028-abdd-688bddec3be8" },
    } as OptionsParam);
    cy.wait("@higuchiaiRelationshipRequest");
    cy.wait("@higuchiaiRecordingRequest");

    cy.get(".text-2xl").contains("ヒグチアイ");

    cy.get(":nth-child(2) > .text-lg").contains("作詞作曲した楽曲");
    cy.get(".songwriter-table > tbody > :nth-child(1) > .text-center").contains(
      "composer"
    );
    cy.get(
      ".songwriter-table > tbody > :nth-child(1) > :nth-child(2)"
    ).contains("悪魔の子");

    cy.get(":nth-child(5) > .text-lg").contains(
      "アーティストとして関わった楽曲"
    );
    cy.get(".artist-table > tbody > :nth-child(1) > .px-4").contains(
      "妄想悩殺お手ガール"
    );

    // アーティスト楽曲が87件か
    cy.get(".artist-table > tbody > tr > td").should(($trs) => {
      expect($trs, "87 items").to.have.length(87);
    });
    cy.get("p").contains("87 件中 1 〜 87件");

    //スタッフ楽曲の表が存在していないかどうか
    cy.get(".staff-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Artist have staff and artist tables", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/6c0e22e8-e707-4b4b-b3e7-8c4135583aed?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_sorita_relationship.json" }
    ).as("soritaRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=6c0e22e8-e707-4b4b-b3e7-8c4135583aed&offset=0&limit=100&fmt=json",
      { fixture: "mock_sorita_recording.json" }
    ).as("soritaRecordingRequest");
    cy.mount(ArtistDetail, {
      props: { id: "6c0e22e8-e707-4b4b-b3e7-8c4135583aed" },
    } as OptionsParam);
    cy.wait("@soritaRelationshipRequest");
    cy.wait("@soritaRecordingRequest");

    cy.get(".text-2xl").contains("反田恭平");

    cy.get(":nth-child(3) > .text-lg").contains("スタッフとして関わった楽曲");
    cy.get(".staff-table > tbody > :nth-child(1) > .text-center").contains(
      "piano"
    );
    cy.get(".staff-table > tbody > :nth-child(1) > :nth-child(2)").contains(
      "Rhapsody on a Theme of Paganini, op. 43: 1. Introduction. Allegro vivace"
    );

    cy.get(":nth-child(5) > .text-lg").contains(
      "アーティストとして関わった楽曲"
    );
    cy.get(".artist-table > tbody > :nth-child(2) > .px-4").contains(
      "ワルツ第6番 変ニ長調 作品64-1 「小犬のワルツ」"
    );

    // アーティスト楽曲が87件か
    cy.get(".artist-table > tbody > tr > td").should(($trs) => {
      expect($trs, "31 items").to.have.length(31);
    });
    cy.get("p").contains("31 件中 1 〜 31件");

    //作詞作曲の楽曲の表が存在していないかどうか
    cy.get(".songwriter-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Artist have only songwriter table", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/02df3556-05b8-47a2-bfba-ef657fbcfca6?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_hinata_relationship.json" }
    ).as("hinataRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=02df3556-05b8-47a2-bfba-ef657fbcfca6&offset=0&limit=100&fmt=json",
      { fixture: "mock_hinata_recording.json" }
    ).as("hinataRecordingRequest");
    cy.mount(ArtistDetail, {
      props: { id: "02df3556-05b8-47a2-bfba-ef657fbcfca6" },
    } as OptionsParam);
    cy.wait("@hinataRelationshipRequest");
    cy.wait("@hinataRecordingRequest");

    cy.get(".text-2xl").contains("仰木日向");

    cy.get(":nth-child(2) > .text-lg").contains("作詞作曲した楽曲");
    cy.get(".songwriter-table > tbody > :nth-child(1) > .text-center").contains(
      "composer"
    );
    cy.get(
      ".songwriter-table > tbody > :nth-child(1) > :nth-child(2)"
    ).contains("彩花囃子（イロドリハナバヤシ）");

    //スタッフ楽曲の表が存在していないかどうか
    cy.get(".staff-table > tbody").should("not.be");

    //アーティスト楽曲の表が存在していないかどうか
    cy.get(".artist-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Artist have only staff table", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/6427deef-235d-4ddd-bc0a-4b40a25482e1?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_kawasaki_relationship.json" }
    ).as("kawasakiRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=6427deef-235d-4ddd-bc0a-4b40a25482e1&offset=0&limit=100&fmt=json",
      { fixture: "mock_kawasaki_recording.json" }
    ).as("kawasakiRecordingRequest");
    cy.mount(ArtistDetail, {
      props: { id: "6427deef-235d-4ddd-bc0a-4b40a25482e1" },
    } as OptionsParam);
    cy.wait("@kawasakiRelationshipRequest");
    cy.wait("@kawasakiRecordingRequest");

    cy.get(".text-2xl").contains("川崎亘一");

    cy.get(":nth-child(3) > .text-lg").contains("スタッフとして関わった楽曲");
    cy.get(".staff-table > tbody > :nth-child(1) > .text-center").contains(
      "guitar"
    );
    cy.get(".staff-table > tbody > :nth-child(1) > :nth-child(2)").contains(
      "Be mine!"
    );

    //作詞作曲の楽曲の表が存在していないかどうか
    cy.get(".songwriter-table > tbody").should("not.be");

    //アーティスト楽曲の表が存在していないかどうか
    cy.get(".artist-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Artist have only artist table", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/artist/b784fc16-3467-4a5f-91e1-a231d9ca34ab?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json",
      { fixture: "mock_aragaki_relationship.json" }
    ).as("aragakiRelationshipRequest");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording?artist=b784fc16-3467-4a5f-91e1-a231d9ca34ab&offset=0&limit=100&fmt=json",
      { fixture: "mock_aragaki_recording.json" }
    ).as("aragakiRecordingRequest");
    cy.mount(ArtistDetail, {
      props: { id: "b784fc16-3467-4a5f-91e1-a231d9ca34ab" },
    } as OptionsParam);
    cy.wait("@aragakiRelationshipRequest");
    cy.wait("@aragakiRecordingRequest");

    cy.get(".text-2xl").contains("新垣結衣");

    cy.get(".text-lg").contains("アーティストとして関わった楽曲");
    cy.get(".artist-table > tbody > :nth-child(1) > .px-4").contains(
      "あいたい"
    );

    // アーティスト楽曲が87件か
    cy.get(".artist-table > tbody > tr > td").should(($trs) => {
      expect($trs, "74 items").to.have.length(74);
    });
    cy.get("p").contains("74 件中 1 〜 74件");

    //作詞作曲の楽曲の表が存在していないかどうか
    cy.get(".songwriter-table > tbody").should("not.be");

    //スタッフ楽曲の表が存在していないかどうか
    cy.get(".staff-table > tbody").should("not.be");

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });
});
