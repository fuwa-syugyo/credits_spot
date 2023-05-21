import RecordingSearch from '../../src/components/recordings/RecordingSearch.vue'

describe('RecordingSearch tests', () => {
  it('Less than 100 recording search result', () => {
    // iPhone SE2のサイズでテスト(リリース日が非表示)
    cy.viewport('iphone-se2')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9%E3%83%8A%E3%83%83%E3%83%84&offset=0&limit=100&fmt=json', {fixture: 'mock_mixednuts.json'}).as('mixednutsRequest')
    cy.mount(RecordingSearch, { query: { term: 'ミックスナッツ' } })
    cy.wait('@mixednutsRequest');

    cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
      .contains('ミックスナッツ')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('Official髭男dism')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('2022-04-15').should('not.be.visible')
    
    // PCサイズだとリリース日が表示される
    cy.viewport('macbook-16')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2022-04-15').should('be.visible')

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('.container > :nth-child(4)').should('not.be')
  })
  
  it('More than 100 recording search result 1 page', () => {
    // iPhone SE2のサイズでテスト(リリース日が非表示)
    cy.viewport('iphone-se2')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%82%A2%E3%82%A4%E3%83%89%E3%83%AB&offset=0&limit=100&fmt=json', { fixture: 'mock_idol_page1.json' }).as('idol1PageRequest');
    cy.mount(RecordingSearch, { query: { term: 'アイドル' } })
    cy.wait('@idol1PageRequest');

    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('アイドル')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('星勝')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('1990-12-28').should('not.be.visible')

    // PCサイズだとリリース日が表示される
    cy.viewport('macbook-16')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('1990-12-28')

    //曲名が100件ちょうどあるか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('.container > :nth-child(4)')
    cy.get(':nth-child(4) > .paginate-buttons').contains('3')
    cy.get(':nth-child(5) > .paginate-buttons').contains('>')
  })

  it('More than 100 recording search result 2 page', () => {
    //2ページ目
    cy.viewport('iphone-se2')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%82%A2%E3%82%A4%E3%83%89%E3%83%AB&offset=0&limit=100&fmt=json', { fixture: 'mock_idol_page2.json' }).as('idol2PageRequest');
    cy.mount(RecordingSearch, { query: { term: 'アイドル' } })
    cy.wait('@idol2PageRequest');
    
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('アイドル活動！')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('風鈴ぼるけいの')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2018-03-04').should('not.be.visible')

    // PCサイズだとリリース日が表示される
    cy.viewport('macbook-16')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('2018-03-04')

    //曲名が100件ちょうどあるか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })
  })

  it('More than 100 recording search result 3 page', () => {
    //3ページ目
    cy.viewport('iphone-se2')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%82%A2%E3%82%A4%E3%83%89%E3%83%AB&offset=0&limit=100&fmt=json', { fixture: 'mock_idol_page3.json' }).as('idol3PageRequest');
    cy.mount(RecordingSearch, { query: { term: 'アイドル' } })
    cy.wait('@idol3PageRequest');
    
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('全力アイドル (M@STER VERSION) (オリジナル・カラオケ)')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('水瀬伊織 (CV: 釘宮理恵 )')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2015-06-03').should('not.be.visible')

    // PCサイズだとリリース日が表示される
    cy.viewport('macbook-16')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('2015-06-03')

    //曲名が49件か
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(49)
    })
  })

  it('No result', () => {
    //検索結果が0件
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%81%84%E3%81%88%E3%81%98%E3%81%8A%E3%81%88%E3%81%AC%EF%BD%82%E3%81%AE%E3%81%84%E3%81%BF%E3%81%8A%E3%81%88%EF%BD%8E&offset=0&limit=100&fmt=json', { fixture: 'mock_no_recording.json' }).as('noRecordingRequest');
    cy.mount(RecordingSearch, { query: { term: 'いえじおえぬｂのいみおえｎ' } })
    cy.wait('@noRecordingRequest');
    
    cy.get('p')
      .contains('見つかりませんでした。')

    //1件も表示されていないか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(0)
    })
  })
})


