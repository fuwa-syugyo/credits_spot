import { OptionsParam } from '../../cypress'
import ArtistDetail from '../../src/components/artists/ArtistDetail.vue'

describe('ArtistDetail tests', () => {
  it('Artist have 3 tables page1', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/53bfc28e-2c48-4776-8949-1953c78dd187?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json', {fixture: 'mock_nakatayasutaka_relationship.json'}).as('yasutakaRelationshipRequest')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording?artist=53bfc28e-2c48-4776-8949-1953c78dd187&offset=0&limit=100&fmt=json', {fixture: 'mock_nakatayasutaka_recording_page1.json'}).as('yasutakaRecording1PageRequest')
    cy.mount(ArtistDetail, { props: { id: '53bfc28e-2c48-4776-8949-1953c78dd187' } } as OptionsParam )
    cy.wait('@yasutakaRelationshipRequest');
    cy.wait('@yasutakaRecording1PageRequest');

    cy.get('.text-2xl')
      .contains('中田ヤスタカ')

    cy.get(':nth-child(2) > .text-lg')
      .contains('作詞作曲した楽曲')
    cy.get('.songwriter-table > tbody > :nth-child(1) > .text-center')
      .contains('composer')
    cy.get('.songwriter-table > tbody > :nth-child(1) > :nth-child(2)')
      .contains('1mm')

    //担当がcomposerが476件ちょうどか
    cy.get('.songwriter-table > tbody > tr > td').filter(':contains("composer")').should(($trs) => {
      expect($trs, '476 items').to.have.length(476)
    })

    //担当がlyricistが310件ちょうどか
    cy.get('.songwriter-table > tbody > tr > td').filter(':contains("lyricist")').should(($trs) => {
      expect($trs, '310 items').to.have.length(310)
    })

    cy.get(':nth-child(4) > .text-lg')
    .contains('スタッフとして関わった楽曲')
    cy.get('.staff-table > tbody > :nth-child(2) > .text-center')
      .contains('arranger')
    cy.get('.staff-table > tbody > :nth-child(2) > :nth-child(2)')
      .contains('5iVE YEARS MONSTER')

    //担当がproducerが172件ちょうどか
    cy.get('.staff-table > tbody > tr > td').filter(':contains("producer")').should(($trs) => {
      expect($trs, '172 items').to.have.length(172)
    })

    cy.get(':nth-child(6) > .text-lg')
      .contains('アーティストとして関わった楽曲')
    cy.get('.artist-table > tbody > :nth-child(1) > .px-4')
      .contains('一番歌 (Extend-mix)')

    // アーティスト楽曲1ページ目が100件か
    cy.get('.artist-table > tbody > tr > td').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > :nth-child(7)')
    cy.get(':nth-child(2) > .paginate-buttons').contains('1')
    cy.get(':nth-child(4) > .paginate-buttons').contains('>')
    cy.get(':nth-child(5) > .paginate-buttons').should('not.be')
  })

  it.only('Artist have 3 tables page2', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/artist/53bfc28e-2c48-4776-8949-1953c78dd187?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json', {fixture: 'mock_nakatayasutaka_relationship.json'}).as('yasutakaRelationshipRequest')
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording?artist=53bfc28e-2c48-4776-8949-1953c78dd187&offset=0&limit=100&fmt=json', {fixture: 'mock_nakatayasutaka_recording_page2.json'}).as('yasutakaRecording2PageRequest')
    cy.mount(ArtistDetail, { props: { id: '53bfc28e-2c48-4776-8949-1953c78dd187' } } as OptionsParam )
    cy.wait('@yasutakaRelationshipRequest');
    cy.wait('@yasutakaRecording2PageRequest');

    // 以下、アーティスト楽曲のページを切り替えてもRelationshipsのデータに変化がないかテスト
    cy.get('.text-2xl')
      .contains('中田ヤスタカ')

    cy.get(':nth-child(2) > .text-lg')
      .contains('作詞作曲した楽曲')
    cy.get('.songwriter-table > tbody > :nth-child(1) > .text-center')
      .contains('composer')
    cy.get('.songwriter-table > tbody > :nth-child(1) > :nth-child(2)')
      .contains('1mm')

    cy.get('.songwriter-table > tbody > tr > td').filter(':contains("composer")').should(($trs) => {
      expect($trs, '476 items').to.have.length(476)
    })

    cy.get('.songwriter-table > tbody > tr > td').filter(':contains("lyricist")').should(($trs) => {
      expect($trs, '310 items').to.have.length(310)
    })

    cy.get(':nth-child(4) > .text-lg')
    .contains('スタッフとして関わった楽曲')
    cy.get('.staff-table > tbody > :nth-child(2) > .text-center')
      .contains('arranger')
    cy.get('.staff-table > tbody > :nth-child(2) > :nth-child(2)')
      .contains('5iVE YEARS MONSTER')

    cy.get('.staff-table > tbody > tr > td').filter(':contains("producer")').should(($trs) => {
      expect($trs, '172 items').to.have.length(172)
    })
    // ここまで1ページ目のテストと同じ


    cy.get(':nth-child(6) > .text-lg')
      .contains('アーティストとして関わった楽曲')
    cy.get('.artist-table > tbody > :nth-child(1) > .px-4')
      .contains('透明 toumei')

    // アーティスト楽曲2ページ目が5件か
    cy.get('.artist-table > tbody > tr > td').should(($trs) => {
      expect($trs, '5 items').to.have.length(5)
    })

    //ページネーションのコンポーネントが表示されているかどうか
    cy.get('[data-v-app=""] > :nth-child(1) > :nth-child(7)')
    cy.get(':nth-child(2) > .paginate-buttons').contains('1')
    cy.get(':nth-child(4) > .paginate-buttons').contains('>')
    cy.get(':nth-child(5) > .paginate-buttons').should('not.be')
  })

  it('Recording have not Spotify link test', () => {
    cy.intercept('GET', 'https://musicbrainz.org/ws/2/recording/1aa67948-6be8-4d51-9526-054c75c651c4?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json', {fixture: 'mock_Butter_Sugar_Cream_inst.json'}).as('butterSugarCreamRequest')
    cy.intercept('GET', 'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20', {fixture: 'mock_spotify_Butter_Sugar_Cream.json'}).as('butterSugarCreamSpotifyRequest')
    cy.mount(ArtistDetail, { props: { id: '1aa67948-6be8-4d51-9526-054c75c651c4' } } as OptionsParam )
    cy.wait('@butterSugarCreamRequest');
    cy.wait('@butterSugarCreamSpotifyRequest');

    cy.get('.text-2xl')
      .contains('Butter Sugar Cream (instrumental)')
    cy.get('.my-2 > tbody > tr > .px-4')
    .contains('Tomggg feat. tsvaci')

    cy.get(':nth-child(1) > :nth-child(6) > :nth-child(2) > a')
    .should('not.be')
  })
})


