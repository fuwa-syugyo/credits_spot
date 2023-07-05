import { OptionsParam } from '../../cypress'
import RecordingInWork from '../../src/components/recordings/RecordingInWork.vue'

describe('More than 100 recordings', () => {
  it('Display all recordings on 1 page', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/work/30a33711-0db8-3fc7-a3c8-f42426bdf43b?inc=recording-rels+artist-credits&fmt=json',
      { fixture: 'mock_debby.json' }
    ).as('debbyRequest')
    cy.mount(RecordingInWork, {
      props: { id: '30a33711-0db8-3fc7-a3c8-f42426bdf43b' },
    } as OptionsParam)
    cy.wait('@debbyRequest')
    cy.get('h1').contains('曲群一覧')
    cy.contains('Waltz for Debby')

    cy.get('.work-table > tbody > tr').should(($trs) => {
      expect($trs, '127 items').to.have.length(127)
    })
  })
})

describe('More than 100 recordings', () => {
  it('False fetch request', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/work/30a33711-0db8-3fc7-a3c8-f42426bdf43b?inc=recording-rels+artist-credits&fmt=json',
      { forceNetworkError: true,
        fixture: 'mock_debby.json' }
    ).as('debbyRequest')
    cy.mount(RecordingInWork, {
      props: { id: '30a33711-0db8-3fc7-a3c8-f42426bdf43b' },
    } as OptionsParam)
    cy.wait('@debbyRequest')

    cy.contains('時間を置いて再度お試しください。')
    cy.contains('Waltz for Debby').should('not.be')
  })
})
