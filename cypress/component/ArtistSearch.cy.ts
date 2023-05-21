import ArtistSearch from '../../src/components/artists/ArtistSearch.vue'

describe('ArtistSearch tests', () => {
  it('Less than 100 recording search result', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E3%82%B1%E3%83%B3%E3%83%A2%E3%83%81%E3%83%92%E3%83%87%E3%83%95%E3%83%9F&offset=0&limit=100&fmt=json', {fixture: 'mock_kenmochihidefumi.json'}).as('kenmochihidefumiRequest')
    cy.mount(ArtistSearch, { query: { term: 'ケンモチヒデフミ' } })
    cy.wait('@kenmochihidefumiRequest');

    cy.get('.table-auto > tbody > :nth-child(1) >  > :nth-child(1)')
      .contains('ケンモチヒデフミ')
    
    //検索結果が1件ちょうどか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '1 item').to.have.length(1)
    })

    //ページネーションのコンポーネントが表示されていないかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div').should('not.be')
  })
  
  it('More than 100 recording search result 1 page', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_page1.json' }).as('komurotetsuya1PageRequest');
    cy.mount(ArtistSearch, { query: { term: '小室哲哉' } })
    cy.wait('@komurotetsuya1PageRequest');

    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('小室哲哉')

    //検索結果が100件ちょうどか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > div')
    cy.get(':nth-child(2) > .paginate-buttons').contains('1')
    cy.get('.last-button').contains('25')
    cy.get(':nth-child(7) > .paginate-buttons').contains('>')
  })

  it('More than 100 recording search result 2 page', () => {
    //2ページ目
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_page2.json' }).as('komurotetsuya2PageRequest');
    cy.mount(ArtistSearch, { query: { term: '小室哲哉' } })
    cy.wait('@komurotetsuya2PageRequest');
    
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('小久保隆')

    //検索結果が100件ちょうどか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })
  })

  it('More than 100 recording search result last page', () => {
    //最後のページ
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_page_last.json' }).as('komurotetsuyaLastPageRequest');
    cy.mount(ArtistSearch, { query: { term: '小室哲哉' } })
    cy.wait('@komurotetsuyaLastPageRequest');
    
    cy.get('.table-auto > tbody > :nth-child(1) > :nth-child(1)')
      .contains('小山田祐治')

    //検索結果が79件か
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(79)
    })
  })

  it('No result', () => {
    //検索結果が0件
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E3%81%86%E3%81%87%EF%BD%93%EF%BD%92%EF%BD%84%EF%BD%86%EF%BD%94%EF%BD%96%EF%BD%87%EF%BD%99%EF%BD%82%EF%BD%88%E3%82%93%EF%BD%8A%EF%BD%8B%EF%BD%8D%EF%BD%8C%E3%80%81%E3%80%82%E3%80%81%EF%BD%8D%E3%82%93%EF%BD%87%EF%BD%82%EF%BD%86%EF%BD%84%EF%BD%96%EF%BD%93&offset=0&limit=100&fmt=json', { fixture: 'mock_no_artist.json' }).as('noArtistRequest');
    cy.mount(ArtistSearch, { query: { term: 'うぇｓｒｄｆｔｖｇｙｂｈんｊｋｍｌ、。、ｍんｇｂｆｄｖｓ' } })
    cy.wait('@noArtistRequest');
    
    cy.get('p')
      .contains('見つかりませんでした。')

    //1件も表示されていないか
    cy.get('.table-auto > tbody > tr').should(($trs) => {
      expect($trs, '0 item').to.have.length(0)
    })
  })
})


