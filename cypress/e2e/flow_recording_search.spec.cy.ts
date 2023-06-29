describe('Recording search and lookup artist', () => {
  it('Search recording', () => {
    cy.visit('http://127.0.0.1:5173/')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E9%9D%92%E6%98%A5%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9&offset=0&limit=100&fmt=json',
      { fixture: 'mock_seisyun_page1.json' }
    ).as('seisyun1PageRequest')
    cy.get('input[type="search"]')
      .should('be.visible')
      .type('青春コンプレックス', { force: true })
    cy.get('.search-button').click()
    cy.wait('@seisyun1PageRequest')
    cy.get('.recording-search-table > tbody').contains('青春コンプレックス')
    cy.get('.recording-search-table > tbody').contains('結束バンド')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_seisyun_relationship.json' }
    ).as('seisyunRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPE302200934&type=track&offset=0&limit=20',
      { fixture: 'mock_seisyun_spotify.json' }
    ).as('seisyunSpotifyRequest')
    cy.get('.recording-search-table > tbody > :nth-child(1) > td')
      .contains('青春コンプレックス')
      .click()
    cy.wait('@seisyunRelationshipRequest')
    cy.wait('@seisyunSpotifyRequest')
    cy.url().should(
      'include',
      '/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5'
    )
    cy.contains('青春コンプレックス')
  })

  it('Artist look up', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_seisyun_relationship.json' }
    ).as('seisyunRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPE302200934&type=track&offset=0&limit=20',
      { fixture: 'mock_seisyun_spotify.json' }
    ).as('seisyunSpotifyRequest')
    cy.visit('http://127.0.0.1:5173/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.wait('@seisyunRelationshipRequest')
    cy.wait('@seisyunSpotifyRequest')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/c1b0fe0a-779d-43ed-b193-4370f0d0f88f?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json',
      { fixture: 'mock_kessoku_relationship.json' }
    ).as('kessokuRelationshipRequest')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording?artist=c1b0fe0a-779d-43ed-b193-4370f0d0f88f&offset=0&limit=100&fmt=json',
      { fixture: 'mock_kessoku_recording.json' }
    ).as('kessokuRecordingRequest')
    cy.get('p.artist-name > span > a').click()
    cy.wait('@kessokuRelationshipRequest')
    cy.wait('@kessokuRecordingRequest')
    cy.get('.artist-name').contains('結束バンド')
    cy.get('.artist-table > tbody').contains('青春コンプレックス')
    cy.go('back')
  })

  it('Songwriter look up', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_seisyun_relationship.json' }
    ).as('seisyunRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPE302200934&type=track&offset=0&limit=20',
      { fixture: 'mock_seisyun_spotify.json' }
    ).as('seisyunSpotifyRequest')
    cy.visit('http://127.0.0.1:5173/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.wait('@seisyunRelationshipRequest')
    cy.wait('@seisyunSpotifyRequest')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/779f1dee-35ca-4b75-8db5-9ae3ce3b16c8?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json',
      { fixture: 'mock_otoha_relationship.json' }
    ).as('otohaRelationshipRequest')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording?artist=779f1dee-35ca-4b75-8db5-9ae3ce3b16c8&offset=0&limit=100&fmt=json',
      { fixture: 'mock_otoha_recording.json' }
    ).as('otohaRecordingRequest')
    cy.get('.songwriter-data').contains('音羽-otoha-').click()
    cy.wait('@otohaRelationshipRequest')
    cy.wait('@otohaRecordingRequest')
    cy.get('.songwriter-table > tbody > tr')
      .contains('青春コンプレックス')
      .parent()
      .parent()
      .contains('composer')
  })

  it('Staff look up', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_seisyun_relationship.json' }
    ).as('seisyunRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPE302200934&type=track&offset=0&limit=20',
      { fixture: 'mock_seisyun_spotify.json' }
    ).as('seisyunSpotifyRequest')
    cy.visit('http://127.0.0.1:5173/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.wait('@seisyunRelationshipRequest')
    cy.wait('@seisyunSpotifyRequest')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/artist/66dea38d-e16d-4774-b5c5-e0ee56808731?inc=recording-rels+artist-rels+artist-credits+work-rels&fmt=json',
      { fixture: 'mock_mitsui_relationship.json' }
    ).as('mitsuiRelationshipRequest')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording?artist=66dea38d-e16d-4774-b5c5-e0ee56808731&offset=0&limit=100&fmt=json',
      { fixture: 'mock_mitsui_recording.json' }
    ).as('mitsuiRecordingRequest')
    cy.get('.staff-data').contains('三井律郎').click()
    cy.wait('@mitsuiRelationshipRequest')
    cy.wait('@mitsuiRecordingRequest')
    cy.get('.staff-table > tbody > tr')
      .contains('青春コンプレックス')
      .parent()
      .parent()
      .contains('arranger')
  })
})

describe('Apply filter', () => {
  it('Apply button disable when no use filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_tentaikansoku.json' }
    ).as('resultTentaikansokuRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC')
    cy.get('#apply').should('be.disabled')
  })

  it('Only inst filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_tentaikansoku.json' }
    ).as('resultTentaikansokuRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku1.json' }
    ).as('tentaikansoku1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=100&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku2.json' }
    ).as('tentaikansoku2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=200&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku3.json' }
    ).as('tentaikansoku3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=300&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku4.json' }
    ).as('tentaikansoku4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=400&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku5.json' }
    ).as('tentaikansoku5Request')

    cy.get('#inst').check()
    cy.get('#apply').click()
    cy.wait('@tentaikansoku1Request')
    cy.wait('@tentaikansoku2Request')
    cy.wait('@tentaikansoku3Request')
    cy.wait('@tentaikansoku4Request')
    cy.wait('@tentaikansoku5Request')
    cy.contains('天体観測')
    cy.get('.filtered-recording-search-table > tbody > tr').should(
      'not.contain',
      '天体観測(Instrumental Version)'
    )
  })

  it('Only partial filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_tentaikansoku.json' }
    ).as('resultTentaikansokuRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku1.json' }
    ).as('tentaikansoku1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=100&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku2.json' }
    ).as('tentaikansoku2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=200&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku3.json' }
    ).as('tentaikansoku3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=300&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku4.json' }
    ).as('tentaikansoku4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=400&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku5.json' }
    ).as('tentaikansoku5Request')

    cy.get('#partial').check()
    cy.get('#apply').click()
    cy.wait('@tentaikansoku1Request')
    cy.wait('@tentaikansoku2Request')
    cy.wait('@tentaikansoku3Request')
    cy.wait('@tentaikansoku4Request')
    cy.wait('@tentaikansoku5Request')

    cy.contains('天体観測')
    cy.get('.filtered-recording-search-table > tbody > tr').should(
      'not.contain',
      'スカイクラッドの観測者'
    )
  })

  it('Only Artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_tentaikansoku.json' }
    ).as('resultTentaikansokuRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC')
    
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku1.json' }
    ).as('tentaikansoku1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=100&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku2.json' }
    ).as('tentaikansoku2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=200&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku3.json' }
    ).as('tentaikansoku3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=300&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku4.json' }
    ).as('tentaikansoku4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=400&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku5.json' }
    ).as('tentaikansoku5Request')

    cy.get('#filter').type('BUMP OF CHICKEN')
    cy.get('#apply').click()
    cy.wait('@tentaikansoku1Request')
    cy.wait('@tentaikansoku2Request')
    cy.wait('@tentaikansoku3Request')
    cy.wait('@tentaikansoku4Request')
    cy.wait('@tentaikansoku5Request')

    cy.contains('天体観測')
    cy.get('tbody > :nth-child(1) > :nth-child(2)').contains('BUMP OF CHICKEN')
    cy.get('.table-auto tbody tr td:nth-child(2)').each(($td) => {
      expect($td.text()).not.to.include('入尾信充')
    })
  })

  it('Inst and partial filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_tentaikansoku.json' }
    ).as('resultTentaikansokuRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC')
    
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=0&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku1.json' }
    ).as('tentaikansoku1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=100&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku2.json' }
    ).as('tentaikansoku2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=200&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku3.json' }
    ).as('tentaikansoku3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=300&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku4.json' }
    ).as('tentaikansoku4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E5%A4%A9%E4%BD%93%E8%A6%B3%E6%B8%AC&offset=400&limit=100&fmt=json',
      { fixture: 'mock_tentaikansoku5.json' }
    ).as('tentaikansoku5Request')

    cy.get('#inst').check()
    cy.get('#partial').check()
    cy.get('#apply').click()
    cy.wait('@tentaikansoku1Request')
    cy.wait('@tentaikansoku2Request')
    cy.wait('@tentaikansoku3Request')
    cy.wait('@tentaikansoku4Request')
    cy.wait('@tentaikansoku5Request')

    cy.contains('真夏の天体観測')
    cy.get('.filtered-recording-search-table > tbody > tr').should(
      'not.contain',
      'スカイクラッドの観測者'
    )
    cy.get('.filtered-recording-search-table > tbody > tr').should(
      'not.contain',
      '真夏の天体観測 ～Instrumental～'
    )
  })

  it('Inst and artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_celebrate.json' }
    ).as('resultCelebrateRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=can+you+celebrate')
    
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_celebrate1.json' }
    ).as('celebrate1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=100&limit=100&fmt=json',
      { fixture: 'mock_celebrate2.json' }
    ).as('celebrate2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=200&limit=100&fmt=json',
      { fixture: 'mock_celebrate3.json' }
    ).as('celebrate3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=300&limit=100&fmt=json',
      { fixture: 'mock_celebrate4.json' }
    ).as('celebrate4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=400&limit=100&fmt=json',
      { fixture: 'mock_celebrate5.json' }
    ).as('celebrate5Request')

    cy.get('#inst').check()
    cy.get('#filter').type('安室奈美恵')
    cy.get('#apply').click()
    cy.wait('@celebrate1Request')
    cy.wait('@celebrate2Request')
    cy.wait('@celebrate3Request')
    cy.wait('@celebrate4Request')
    cy.wait('@celebrate5Request')

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(2)'
    ).contains('安室奈美恵')
    cy.get(
      '.filtered-recording-search-table > tbody > tr > td:nth-child(2)'
    ).each(($td) => {
      expect($td.text()).not.to.include('白鳥英美子')
    })
    cy.contains('CAN YOU CELEBRATE?')
    cy.contains('Dreaming I was dreaming (Subconscious mix)')
    cy.get('.filtered-recording-search-table > tbody > tr').should(
      'not.contain',
      'CAN YOU CELEBRATE? (instrumental)'
    )
  })

    it('Partial and artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_celebrate.json' }
    ).as('resultCelebrateRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=can+you+celebrate')
    
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_celebrate1.json' }
    ).as('celebrate1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=100&limit=100&fmt=json',
      { fixture: 'mock_celebrate2.json' }
    ).as('celebrate2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=200&limit=100&fmt=json',
      { fixture: 'mock_celebrate3.json' }
    ).as('celebrate3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=300&limit=100&fmt=json',
      { fixture: 'mock_celebrate4.json' }
    ).as('celebrate4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=400&limit=100&fmt=json',
      { fixture: 'mock_celebrate5.json' }
    ).as('celebrate5Request')

    cy.get('#partial').check()
    cy.get('#filter').type('安室奈美恵')
    cy.get('#apply').click()
    cy.wait('@celebrate1Request')
    cy.wait('@celebrate2Request')
    cy.wait('@celebrate3Request')
    cy.wait('@celebrate4Request')
    cy.wait('@celebrate5Request')

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(2)'
    ).contains('安室奈美恵')
    cy.get(
      '.filtered-recording-search-table > tbody > tr > td:nth-child(2)'
    ).each(($td) => {
      expect($td.text()).not.to.include('白鳥英美子')
    })
    cy.contains('CAN YOU CELEBRATE?')
    cy.contains('CAN YOU CELEBRATE? (instrumental)')
    cy.get('tbody').should(
      'not.contain',
      'Dreaming I was dreaming (Subconscious mix)'
    )
  })

  it('All filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_result_celebrate.json' }
    ).as('resultCelebrateRequest')
    cy.visit('http://127.0.0.1:5173/recordings?term=can+you+celebrate')
    
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=0&limit=100&fmt=json',
      { fixture: 'mock_celebrate1.json' }
    ).as('celebrate1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=100&limit=100&fmt=json',
      { fixture: 'mock_celebrate2.json' }
    ).as('celebrate2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=200&limit=100&fmt=json',
      { fixture: 'mock_celebrate3.json' }
    ).as('celebrate3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=300&limit=100&fmt=json',
      { fixture: 'mock_celebrate4.json' }
    ).as('celebrate4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:can%20you%20celebrate&offset=400&limit=100&fmt=json',
      { fixture: 'mock_celebrate5.json' }
    ).as('celebrate5Request')

    cy.get('#inst').check()
    cy.get('#partial').check()
    cy.get('#filter').type('安室奈美恵')
    cy.get('#apply').click()
    cy.wait('@celebrate1Request')
    cy.wait('@celebrate2Request')
    cy.wait('@celebrate3Request')
    cy.wait('@celebrate4Request')
    cy.wait('@celebrate5Request')

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(2)'
    ).contains('安室奈美恵')
    cy.get(
      '.filtered-recording-search-table > tbody > tr > td:nth-child(2)'
    ).each(($td) => {
      expect($td.text()).not.to.include('白鳥英美子')
    })
    cy.contains('CAN YOU CELEBRATE?')
    cy.get('.filtered-recording-search-table > tbody').should(
      'not.contain',
      'CAN YOU CELEBRATE? (instrumental)'
    )
    cy.get('.filtered-recording-search-table > tbody').should(
      'not.contain',
      'Dreaming I was dreaming (Subconscious mix)'
    )
  })
})

describe('Check search word is not undefined by using pagination', () => {
  it('Using pagination', () => {
    cy.visit('http://127.0.0.1:5173/')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E9%9D%92%E6%98%A5%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9&offset=0&limit=100&fmt=json',
      { fixture: 'mock_seisyun_page1.json' }
    ).as('seisyun1PageRequest')
    cy.get('input[type="search"]')
      .should('be.visible')
      .type('青春コンプレックス', { force: true })
    cy.get('.search-button').click()
    cy.wait('@seisyun1PageRequest')

    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E9%9D%92%E6%98%A5%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9&offset=100&limit=100&fmt=json',
      { fixture: 'mock_seisyun_page2.json' }
    ).as('seisyun2PageRequest')
    cy.get('.pagination').contains('>').click()
    cy.wait('@seisyun2PageRequest')
    cy.get('.recording-search-table > tbody > tr').should(
      'not.contain',
      'Undefined'
    )
  })
})

describe('Check spotify button', () => {
  it('Have spotify link recording', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_seisyun_relationship.json' }
    ).as('seisyunRelationshipRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3AJPE302200934&type=track&offset=0&limit=20',
      { fixture: 'mock_seisyun_spotify.json' }
    ).as('seisyunSpotifyRequest')
    cy.visit('http://127.0.0.1:5173/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.wait('@seisyunRelationshipRequest')
    cy.wait('@seisyunSpotifyRequest')

    cy.get('.spotify-button > a').should(
      'have.attr',
      'href',
      'https://open.spotify.com/track/0jpP8AlQLVtaMwA3vQYpYB'
    )
    cy.get('.no-spotify').should('not.be')
  })

  it('Have not spotify link recording', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/1aa67948-6be8-4d51-9526-054c75c651c4?inc=artist-credits+recording-rels+work-rels+work-level-rels+artist-rels+isrcs&fmt=json',
      { fixture: 'mock_Butter_Sugar_Cream_inst.json' }
    ).as('butterSugarCreamRequest')
    cy.intercept(
      'GET',
      'https://api.spotify.com/v1/search?query=isrc%3Aundefined&type=track&offset=0&limit=20',
      { fixture: 'mock_spotify_Butter_Sugar_Cream.json' }
    ).as('butterSugarCreamSpotifyRequest')
    cy.visit('http://127.0.0.1:5173/recordings/1aa67948-6be8-4d51-9526-054c75c651c4')
    cy.wait('@butterSugarCreamRequest')
    cy.wait('@butterSugarCreamSpotifyRequest')

    cy.get('.spotify-button').should('be.disabled')
    cy.get('.no-spotify > p').contains(
      '登録されているSpotifyでの音源情報がないため再生ができません。'
    )
  })
})
export {}
