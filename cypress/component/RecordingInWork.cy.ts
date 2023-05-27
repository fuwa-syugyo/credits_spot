import { OptionsParam } from '../../cypress'
import RecordingInWork from '../../src/components/recordings/RecordingInWork.vue'

describe('RecordingInWork tests', () => {
  it('More than 100 recordings', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/work/30a33711-0db8-3fc7-a3c8-f42426bdf43b?inc=recording-rels+artist-credits&fmt=json', {fixture: 'mock_debby.json'}).as('debbyRequest')
    cy.mount(RecordingInWork, { props: { id: '30a33711-0db8-3fc7-a3c8-f42426bdf43b' } } as OptionsParam )
    cy.wait('@debbyRequest');
    cy.get('h1').contains('曲群一覧')

    //曲数が127件ちょうどか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '127 items').to.have.length(127)
    })
  })

  it('Less than 100 recordings', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/work/0eb34006-eac6-466c-a692-42a52741d354?inc=recording-rels+artist-credits&fmt=json', {fixture: 'mock_uma.json'}).as('umaRequest')
    cy.mount(RecordingInWork, { props: { id: '0eb34006-eac6-466c-a692-42a52741d354' } } as OptionsParam )
    cy.wait('@umaRequest');

    //曲数が44件ちょうどか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '44 items').to.have.length(44)
    })
  })
})


