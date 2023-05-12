import RecordingSearch from '../../src/components/recordings/RecordingSearch.vue'

it('Less than 100 recording search result', () => {
  cy.mount(RecordingSearch, { query: { term: 'ミックスナッツ' } })
  cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
    .contains('ミックスナッツ')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(2)')
    .contains('Official髭男dism')
  cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(3)')
    .contains('2022-04-15')
})

