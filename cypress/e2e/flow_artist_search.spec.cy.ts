describe('Visits artist search result', () =>  {
  it('Search artist', () =>  {
    cy.visit('http://127.0.0.1:5173/')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page1.json' }
    ).as('komurotetsuya1PageRequest')

    cy.get('[value="人物名"]').check()
    cy.get('#search').type('小室哲哉{enter}', { force: true })
    cy.get('.search-button').click()
    cy.wait('@komurotetsuya1PageRequest')
    cy.get('.artist-search-table > tbody').contains('小室哲哉').click()
    cy.url().should('include', 'http://127.0.0.1:5173/artists/de242082-2f3e-4ce5-99e1-7839559da089')
  })

  it('Look up artist recording', () =>  {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/de242082-2f3e-4ce5-99e1-7839559da089?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json',
      { fixture: 'mock_komurotetsuya_relationship.json' }
    ).as('komurotetsuyaRelationshipRequest')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording?artist=de242082-2f3e-4ce5-99e1-7839559da089&offset=0&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_recording_page1.json' }
    ).as('komurotetsuyaRecording1PageRequest')
    cy.visit('http://localhost:5173/artists/de242082-2f3e-4ce5-99e1-7839559da089')
    cy.wait('@komurotetsuyaRelationshipRequest')
    cy.wait('@komurotetsuyaRecording1PageRequest')
    cy.contains('小室哲哉')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/08cea5ad-09af-466a-b2f4-46ec63dd2d09?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_D_wakare_relationship.json' }
    ).as('komurotetsuyaDWakareRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20',
      { fixture: 'mock_komurotetsuya_D_wakare_spotify.json' }
    ).as('komurotetsuyaDWakareSpotifyRequest')
    cy.get('.artist-table > tbody > :nth-child(1) > td > a ').click()
    cy.wait('@komurotetsuyaDWakareRelationshipRequest')
    cy.wait('@komurotetsuyaDWakareSpotifyRequest')
    cy.get('.recording-title').contains('Dのテーマ (別れ)')
    cy.get('.artist-name').contains('小室哲哉')
  })

  it('Look up songwriter recording', () =>  {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/work/73d884ae-bdb1-466f-8585-23aeb4644bfb?inc=recording-rels+artist-credits&fmt=json',
      { fixture: 'mock_crazy_work.json' }
    ).as('komurotetsuyaCrazyWorkRequest')
    cy.visit('http://localhost:5173/artists/de242082-2f3e-4ce5-99e1-7839559da089')
    cy.get(
      '.songwriter-table > tbody > :nth-child(43) > :nth-child(2) > a'
    ).click()
    cy.wait('@komurotetsuyaCrazyWorkRequest')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/4f33f498-ecac-429a-87ee-ec6f74680fcc?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_crazy_relationship.json' }
    ).as('komurotetsuyaCrazyRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPB609520101&type=track&offset=0&limit=20',
      { fixture: 'mock_crazy_spotify.json' }
    ).as('komurotetsuyaCrazySpotifyRequest')
    cy.get('.work-table > tbody > :nth-child(2) > :nth-child(1) > a').click()
    cy.wait('@komurotetsuyaCrazyRelationshipRequest')
    cy.wait('@komurotetsuyaCrazySpotifyRequest')

    cy.get('.recording-title').contains('CRAZY GONNA CRAZY')
    cy.get('.songwriter-data > tr')
      .contains('composer')
      .parent()
      .parent()
      .contains('小室哲哉')
  })

  it('Look up staff recording', () =>  {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/ff0a6f14-14b2-4b32-b84b-b6961293b92c?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_soon_19_relationship.json' }
    ).as('komurotetsuyaSoon19RelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20',
      { fixture: 'mock_soon_19_spotify.json' }
    ).as('komurotetsuyaSoon19SpotifyRequest')
    cy.visit('http://localhost:5173/artists/de242082-2f3e-4ce5-99e1-7839559da089')
    cy.get('.staff-table > tbody > :nth-child(1) > :nth-child(2) > a').click()
    cy.wait('@komurotetsuyaSoon19RelationshipRequest')
    cy.wait('@komurotetsuyaSoon19SpotifyRequest')
    cy.get('.recording-title').contains('...soon nineteen')
    cy.get('.staff-data > tr')
      .contains('arranger')
      .parent()
      .parent()
      .contains('小室哲哉')
  })
})

describe('Continuously artist search', () => {
  it('Should be continuously artist search', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:YOASOBI&offset=0&limit=100&fmt=json',
      { fixture: 'mock_yoasobi.json' }
    ).as('yoasobiRequest')
    cy.get('[value="人物名"]').check()
    cy.get('#search').type('YOASOBI{enter}', { force: true })
    cy.get('.search-button').click()
    cy.wait('@yoasobiRequest')
    cy.get('.artist-search-table > tbody').contains('YOASOBI')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:the%20band%20apart&offset=0&limit=100&fmt=json',
      { fixture: 'mock_the_band_apart.json' }
    ).as('theBandApartRequest')
    cy.get('#search')
      .focus()
      .clear()
      .type('the band apart{enter}', { force: true })
    cy.get('.search-button').first().click()
    cy.wait('@theBandApartRequest')
    cy.get('.artist-search-table > tbody').contains('the band apart')
  })
})

describe('Check search word is not undefined by using pagination', () => {
  it('Using pagination', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page1.json' }
    ).as('komurotetsuya1PageRequest')

    cy.get('[value="人物名"]').check()
    cy.get('#search').type('小室哲哉{enter}', { force: true })
    cy.get('.search-button').click()
    cy.wait('@komurotetsuya1PageRequest')
    cy.get('.artist-search-table > tbody').contains('小室哲哉')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=100&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page2.json' }
    ).as('komurotetsuya2PageRequest')
    cy.get('.pagination').contains('>').click()
    cy.wait('@komurotetsuya2PageRequest')
    cy.get('body').should('not.contain', 'Undefined')
    cy.get('.pagination').contains('<').click()
  })
})
export {}
