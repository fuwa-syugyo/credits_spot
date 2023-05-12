import RecordingSearch from '../../src/components/recordings/RecordingSearch.vue'

it('Less than 100 recording search result', () => {
  cy.mount(RecordingSearch, { query: { term: 'ミックスナッツ' } })
  cy.contains('ミックスナッツ')

})

