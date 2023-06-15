import ArtistSearch from '../../src/components/artists/ArtistSearch.vue'

describe('ArtistSearch tests', () => {
  it('Less than 100 recording search result', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E3%82%B1%E3%83%B3%E3%83%A2%E3%83%81%E3%83%92%E3%83%87%E3%83%95%E3%83%9F&offset=0&limit=100&fmt=json',
      { fixture: 'mock_kenmochihidefumi.json' }
    ).as('kenmochihidefumiRequest')
    cy.mount(ArtistSearch, { query: { term: 'ケンモチヒデフミ' } })
    cy.wait('@kenmochihidefumiRequest')
    cy.get('h1').contains('人物検索結果')

    cy.get('.artist-search-table > tbody').contains(
      'ケンモチヒデフミ'
    )

    cy.get('.artist-search-table > tbody > tr').should(($trs) => {
      expect($trs, '1 item').to.have.length(1)
    })
    cy.get('.artist-search-number').contains('検索結果 1 件中 1 〜 1件')

    cy.get('.pagination').should('not.be')
  })

  it('More than 100 recording search result', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page1.json' }
    ).as('komurotetsuya1PageRequest')
    cy.mount(ArtistSearch, { query: { term: '小室哲哉' } })
    cy.wait('@komurotetsuya1PageRequest')

    cy.get('.artist-search-table > tbody').contains(
      '小室哲哉'
    )

    cy.get('.artist-search-table > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })
    cy.get('.artist-search-number').contains('検索結果 2479 件中 1 〜 100件')

    cy.get('.pagination').contains('1')
    cy.get('.last-button').contains('25')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=100&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page2.json' }
    ).as('komurotetsuya2PageRequest')
    cy.get('.pagination').contains('>').click()
    cy.wait('@komurotetsuya2PageRequest')

    cy.get('.artist-search-table > tbody').contains(
      '小久保隆'
    )

    cy.get('.artist-search-table > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })
    cy.get('.artist-search-number').contains('検索結果 2479 件中 101 〜 200件')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=2400&limit=100&fmt=json',
      { fixture: 'mock_komurotetsuya_page_last.json' }
    ).as('komurotetsuyaLastPageRequest')
    cy.get('.last-button').click()
    cy.wait('@komurotetsuyaLastPageRequest')

    cy.get('.artist-search-table > tbody').contains(
      '小山田祐治'
    )

    cy.get('.artist-search-table > tbody > tr').should(($trs) => {
      expect($trs, '79 items').to.have.length(79)
    })
    cy.get('.artist-search-number').contains('検索結果 2479 件中 2401 〜 2479件')
  })

  it('No result', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/?query=artist:%E3%81%86%E3%81%87%EF%BD%93%EF%BD%92%EF%BD%84%EF%BD%86%EF%BD%94%EF%BD%96%EF%BD%87%EF%BD%99%EF%BD%82%EF%BD%88%E3%82%93%EF%BD%8A%EF%BD%8B%EF%BD%8D%EF%BD%8C%E3%80%81%E3%80%82%E3%80%81%EF%BD%8D%E3%82%93%EF%BD%87%EF%BD%82%EF%BD%86%EF%BD%84%EF%BD%96%EF%BD%93&offset=0&limit=100&fmt=json',
      { fixture: 'mock_no_artist.json' }
    ).as('noArtistRequest')
    cy.mount(ArtistSearch, {
      query: {
        term: 'うぇｓｒｄｆｔｖｇｙｂｈんｊｋｍｌ、。、ｍんｇｂｆｄｖｓ',
      },
    })
    cy.wait('@noArtistRequest')

    cy.get('.no-result-caption').contains('Not Found!')
    cy.get('.no-result > p').contains('見つかりませんでした。')

    cy.get('.artist-search-table > tbody > tr').should(($trs) => {
      expect($trs, '0 item').to.have.length(0)
    })
  })
})
