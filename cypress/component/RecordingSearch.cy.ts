import RecordingSearch from '../../src/components/recordings/RecordingSearch.vue'

describe('Tests', () => {
  it.only('Less than 100 recording search result', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/?query=recording:%E3%83%9F%E3%83%83%E3%82%AF%E3%82%B9%E3%83%8A%E3%83%83%E3%83%84&offset=0&limit=100&fmt=json', {fixture: 'mock_mixednuts.json'}).as('mixednutsRequest')
    cy.mount(RecordingSearch, { query: { term: 'ミックスナッツ' } })
    cy.wait('@mixednutsRequest');

    cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
      .contains('ミックスナッツ')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('Official髭男dism')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('2022-04-15')
  })
  
  it('More than 100 recording search result', () => {
    cy.intercept('https://musicbrainz.org/ws/2/recording/?query=recording:アイドル&offset=0&limit=100&fmt=json', { fixture: 'mock_idol_page1.json' }).as('idol1PageRequest');
    cy.mount(RecordingSearch, { query: { term: 'アイドル' } })
    cy.wait('@idol1PageRequest');
    cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
      .contains('アイドル')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
      .contains('星勝')
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
      .contains('1990-12-28')
  
    // //2ページ目の1件目が101件目と等しいか
    // cy.get(':nth-child(5) > .paginate-buttons').click();
    // cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
    //   .contains('きゅぴーん★アイドル宣言')
    // cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
    //   .contains('真野桜子 (CV: 大久保瑠美 )')
    // cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    //   .contains('2021-10-06')
  })
})


