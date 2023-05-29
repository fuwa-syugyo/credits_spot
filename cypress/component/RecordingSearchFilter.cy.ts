import RecordingSearchFilter from "../../src/components/recordings/RecordingSearchFilter.vue";

describe("RecordingSearchFilter tests", () => {
  it("Only partial", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: { term: "上を向いて歩こう", getPartialMatch: "true" },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("h1").contains("絞り込み結果");
    cy.get("p").contains("検索結果 124 件中 1 〜 100件");

    cy.get(".table-auto > tbody > :nth-child(1) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(1) > :nth-child(2)").contains(
      "長渕剛"
    );

    //曲名が100件ちょうどあるか
    cy.get(".table-auto > tbody > tr")
      .filter(':contains("上を向いて歩こう")')
      .should(($trs) => {
        expect($trs, "100 items").to.have.length(100);
      });

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div');
    cy.get(":nth-child(3) > .paginate-buttons").contains("2");
    cy.get(":nth-child(4) > .paginate-buttons").contains(">");

    //2ページ目
    cy.get(":nth-child(3) > .paginate-buttons").contains("2").click();
    cy.get("p").contains("検索結果 124 件中 101 〜 124件");

    //曲名が24件ちょうどあるか
    cy.get(".table-auto > tbody > tr")
      .filter(':contains("上を向いて歩こう")')
      .should(($trs) => {
        expect($trs, "24 items").to.have.length(24);
      });
  });

  it("Only get rid of inst", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: { term: "上を向いて歩こう", getRidOfInstrument: "true" },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 491 件中 1 〜 100件");

    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(2)").contains(
      "トータス松本"
    );

    //曲名が100件ちょうどあるか
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "100 items").to.have.length(100);
    });

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div');
    cy.get(":nth-child(3) > .paginate-buttons").contains("2");

    //2ページ目
    cy.get(":nth-child(7) > .paginate-buttons").contains(">").click();
    cy.get("p").contains("検索結果 491 件中 101 〜 200件");
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "100 items").to.have.length(100);
    });

    //5ページ目
    cy.get(".last-button").click();
    cy.get("p").contains("検索結果 491 件中 401 〜 491件");
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "91 items").to.have.length(91);
    });
  });

  it("Only artist filter", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: { term: "上を向いて歩こう", artistName: "坂本九" },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 36 件中 1 〜 36件");

    cy.get(".table-auto > tbody > :nth-child(1) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(1) > :nth-child(2)").contains(
      "坂本九"
    );

    //曲名が36件ちょうどあるか
    cy.get(".table-auto > tbody > tr")
      .filter(':contains("坂本九")')
      .should(($trs) => {
        expect($trs, "36 items").to.have.length(36);
      });

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Partial and get rid of inst", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: {
        term: "上を向いて歩こう",
        getPartialMatch: "true",
        getRidOfInstrument: "true",
      },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 122 件中 1 〜 100件");

    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(2)").contains(
      "トータス松本"
    );

    //曲名が100件ちょうどあるか
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "100 items").to.have.length(100);
    });

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div');
    cy.get(":nth-child(3) > .paginate-buttons").contains("2");

    //2ページ目
    cy.get(":nth-child(3) > .paginate-buttons").click();
    cy.get("p").contains("検索結果 122 件中 101 〜 122件");
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "22 items").to.have.length(22);
    });
  });

  it("Partial and artist filter", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: {
        term: "上を向いて歩こう",
        getPartialMatch: "true",
        artistName: "坂本九",
      },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 31 件中 1 〜 31件");

    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(2)").contains(
      "坂本九"
    );

    //曲名が35件ちょうどあるか
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "31 items").to.have.length(31);
    });

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("Get rid of inst and artist filter", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: {
        term: "上を向いて歩こう",
        getRidOfInstrument: "true",
        artistName: "坂本九",
      },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 35 件中 1 〜 35件");

    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(2)").contains(
      "坂本九"
    );

    //曲名が35件ちょうどあるか
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "35 items").to.have.length(35);
    });

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("All filter", () => {
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: {
        term: "上を向いて歩こう",
        getPartialMatch: "true",
        getRidOfInstrument: "true",
        artistName: "坂本九",
      },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("検索結果 30 件中 1 〜 30件");

    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(1)").contains(
      "上を向いて歩こう"
    );
    cy.get(".table-auto > tbody > :nth-child(2) > :nth-child(2)").contains(
      "坂本九"
    );

    //曲名が30件ちょうどあるか
    cy.get(".table-auto > tbody > tr")
      .filter(':contains("坂本九")')
      .should(($trs) => {
        expect($trs, "30 items").to.have.length(30);
      });

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should("not.be");
  });

  it("No result", () => {
    //検索結果が0件
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json",
      { fixture: "mock_ue1.json" }
    ).as("ue1Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json",
      { fixture: "mock_ue2.json" }
    ).as("ue2Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json",
      { fixture: "mock_ue3.json" }
    ).as("ue3Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json",
      { fixture: "mock_ue4.json" }
    ).as("ue4Request");
    cy.intercept(
      "GET",
      "https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json",
      { fixture: "mock_ue5.json" }
    ).as("ue5Request");
    cy.mount(RecordingSearchFilter, {
      query: { term: "上を向いて歩こう", artistName: "マキシマムザホルモン" },
    });
    cy.wait("@ue1Request");
    cy.wait("@ue2Request");
    cy.wait("@ue3Request");
    cy.wait("@ue4Request");
    cy.wait("@ue5Request");

    cy.get("p").contains("条件に該当する楽曲はありませんでした。");

    //1件も表示されていないか
    cy.get(".table-auto > tbody > tr").should(($trs) => {
      expect($trs, "0 item").to.have.length(0);
    });
  });
});
