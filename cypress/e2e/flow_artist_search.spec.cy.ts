describe('template spec', () => {
  it('Visits artist search result', function() {
    cy.visit('http://127.0.0.1:5173/')
    // cy.mount(SearchForm)
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=0&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_page1.json' }).as('komurotetsuya1PageRequest');

    cy.get('[value="人物名"]').check();
    cy.get('#search').type('小室哲哉{enter}', {force: true});
    cy.get('.text-white').click();

    // cy.mount(ArtistSearch, { query: { term: '小室哲哉' } })
    cy.wait('@komurotetsuya1PageRequest');
    cy.contains('小室哲哉')

    // ページネーションを動かして検索ワードがUndefinedにならないか確認
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:%E5%B0%8F%E5%AE%A4%E5%93%B2%E5%93%89&offset=100&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_page2.json' }).as('komurotetsuya2PageRequest');
    cy.get(':nth-child(7) > .paginate-buttons').click();
    cy.wait('@komurotetsuya2PageRequest');

    cy.get('body').should('not.contain', 'Undefined')
    cy.get('.back-button').click();

    //小室哲哉をクリック
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/de242082-2f3e-4ce5-99e1-7839559da089?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json', { fixture: 'mock_komurotetsuya_relationship.json' }).as('komurotetsuyaRelationshipRequest');
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording?artist=de242082-2f3e-4ce5-99e1-7839559da089&offset=0&limit=100&fmt=json', { fixture: 'mock_komurotetsuya_recording_page1.json' }).as('komurotetsuyaRecording1PageRequest');
    cy.get(':nth-child(1) > .border > a').click();
    cy.wait('@komurotetsuyaRelationshipRequest');
    cy.wait('@komurotetsuyaRecording1PageRequest');
    cy.contains('小室哲哉')

    //アーティスト楽曲の詳細へ
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/08cea5ad-09af-466a-b2f4-46ec63dd2d09?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', { fixture: 'mock_D_wakare_relationship.json' }).as('komurotetsuyaDWakareRelationshipRequest');
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20', { fixture: 'mock_komurotetsuya_D_wakare_spotify.json' }).as('komurotetsuyaDWakareSpotifyRequest');
    cy.get('.artist-table > tbody > :nth-child(1) > td > a ').click();
    cy.wait('@komurotetsuyaDWakareRelationshipRequest');
    cy.wait('@komurotetsuyaDWakareSpotifyRequest');
    cy.url().should('include', '/recordings/08cea5ad-09af-466a-b2f4-46ec63dd2d09')

    cy.get('.text-2xl').contains('Dのテーマ (別れ)')
    cy.get('.my-2 > tbody > tr > .px-4').contains('小室哲哉')
    cy.get(':nth-child(1) > :nth-child(6) > :nth-child(2) > a')
    .should('not.be')
    cy.go('back')

    //workへ
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/work/73d884ae-bdb1-466f-8585-23aeb4644bfb?inc=recording-rels+artist-credits&fmt=json', { fixture: 'mock_crazy_work.json' }).as('komurotetsuyaCrazyWorkRequest');
    cy.get('.songwriter-table > tbody > :nth-child(43) > :nth-child(2) > a').click();
    cy.wait('@komurotetsuyaCrazyWorkRequest');

    //作詞作曲した曲へ
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/4f33f498-ecac-429a-87ee-ec6f74680fcc?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', { fixture: 'mock_crazy_relationship.json' }).as('komurotetsuyaCrazyRelationshipRequest');
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3AJPB609520101&type=track&offset=0&limit=20', { fixture: 'mock_crazy_spotify.json' }).as('komurotetsuyaCrazySpotifyRequest');
    cy.get(':nth-child(2) > .max-w-\\[600px\\] > a').click();
    cy.wait('@komurotetsuyaCrazyRelationshipRequest');
    cy.wait('@komurotetsuyaCrazySpotifyRequest');

    cy.get('.text-2xl').contains('CRAZY GONNA CRAZY')
    cy.get('table tbody tr')
    .contains('composer').parent().parent()
    .contains('小室哲哉')
    cy.get(':nth-child(6) > :nth-child(2) > a').contains('Spotifyで聴く');
    cy.go('back')
    cy.go('back')

    //スタッフ曲へ
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/ff0a6f14-14b2-4b32-b84b-b6961293b92c?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', { fixture: 'mock_soon_19_relationship.json' }).as('komurotetsuyaSoon19RelationshipRequest');
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20', { fixture: 'mock_soon_19_spotify.json' }).as('komurotetsuyaSoon19SpotifyRequest');

    cy.get('.staff-table > tbody > :nth-child(1) > :nth-child(2) > a').click();
    cy.wait('@komurotetsuyaSoon19RelationshipRequest');
    cy.wait('@komurotetsuyaSoon19SpotifyRequest');

    cy.get('.text-2xl').contains('...soon nineteen')
    cy.get('table tbody tr')
    .contains('arranger').parent().parent()
    .contains('小室哲哉')
    cy.get(':nth-child(1) > :nth-child(6) > :nth-child(2) > a')
    .should('not.be')
    cy.go('back')
  });

  it('Continuously artist search', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:YOASOBI&offset=0&limit=100&fmt=json', { fixture: 'mock_yoasobi.json' }).as('yoasobiRequest');
    cy.get('[value="人物名"]').check();
    cy.get('#search').type('YOASOBI{enter}', {force: true});
    cy.contains('検索').click();
    cy.wait('@yoasobiRequest');
    cy.contains('YOASOBI')

    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/?query=artist:the%20band%20apart&offset=0&limit=100&fmt=json', { fixture: 'mock_the_band_apart.json' }).as('theBandApartRequest');
    cy.get('#search').focus().clear()
    .type('the band apart{enter}', {force: true});
    cy.contains('検索').first().click();
    cy.wait('@theBandApartRequest');
    cy.contains('the band apart')
  })
})
