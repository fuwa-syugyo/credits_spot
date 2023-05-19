import RecordingSearch from '../../src/components/recordings/RecordingSearch.vue'

it('Less than 100 recording search result', () => {
  cy.mount(RecordingSearch, { query: { term: 'ミックスナッツ' } })
  cy.wait(5000)
  cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
    .contains('ミックスナッツ')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
    .contains('Official髭男dism')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2022-04-15')
})

it.only('More than 100 recording search result', () => {
  cy.mount(RecordingSearch, { query: { term: 'アイドル' } })
  cy.wait(5000)
  cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
    .contains('アイドル')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
    .contains('星勝')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('1990-12-28')

  //2ページ目の1件目が101件目と等しいか
  cy.get(':nth-child(5) > .paginate-buttons').click();
  cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
    .contains('きゅぴーん★アイドル宣言')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
    .contains('真野桜子 (CV: 大久保瑠美 )')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2021-10-06')
})

