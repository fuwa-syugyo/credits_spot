import { OptionsParam } from '../../cypress'
import RecordingDetail from '../../src/components/recordings/RecordingDetail.vue'

describe('RecordingDetail tests', () => {
  it('Recording have Spotify link test', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/02689e6a-9a9f-4415-9218-bb3da1dc1a87?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', {fixture: 'mock_suiheisen.json'}).as('suiheisenRequest')
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3AJPPO02100907&type=track&offset=0&limit=20', {fixture: 'mock_spotify_suiheisen.json'}).as('suiheisenSpotifyRequest')
    cy.mount(RecordingDetail, { props: { id: '02689e6a-9a9f-4415-9218-bb3da1dc1a87' } } as OptionsParam )
    cy.wait('@suiheisenRequest');
    cy.wait('@suiheisenSpotifyRequest');

    cy.get('.text-2xl')
      .contains('水平線')
    cy.get('.my-2 > tbody > tr > .px-4')
    .contains('back number')
    cy.get('.bg-blue-400 > a').should('have.attr', 'href', 'https://open.spotify.com/track/3RvdkNMcSy71m0aT6UF9Uf')
  })

  it('Recording have not Spotify link test', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/1aa67948-6be8-4d51-9526-054c75c651c4?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', {fixture: 'mock_Butter_Sugar_Cream_inst.json'}).as('butterSugarCreamRequest')
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20', {fixture: 'mock_spotify_Butter_Sugar_Cream.json'}).as('butterSugarCreamSpotifyRequest')
    cy.mount(RecordingDetail, { props: { id: '1aa67948-6be8-4d51-9526-054c75c651c4' } } as OptionsParam )
    cy.wait('@butterSugarCreamRequest');
    cy.wait('@butterSugarCreamSpotifyRequest');

    cy.get('.text-2xl')
      .contains('Butter Sugar Cream (instrumental)')
    cy.get('.my-2 > tbody > tr > .px-4')
    .contains('Tomggg feat. tsvaci')
    cy.get('.bg-blue-400').should('be.disabled')
  })
})


