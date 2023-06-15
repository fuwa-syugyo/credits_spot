import RecordingSearchFilter from '../../src/components/recordings/RecordingSearchFilter.vue'

describe('RecordingSearchFilter tests', () => {
  it('Only partial', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: { term: '上を向いて歩こう', partialMatch: 'true' },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('h1').contains('絞り込み結果')
    cy.get('.filtered-recording-search-number').contains(
      '検索結果 124 件中 1 〜 100件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(2)'
    ).contains('長渕剛')

    cy.get('.filtered-recording-search-table > tbody > tr')
      .filter(':contains("上を向いて歩こう")')
      .should(($trs) => {
        expect($trs, '100 items').to.have.length(100)
      })

    cy.get('.pagination').contains('2').click()
    cy.get('.filtered-recording-search-number').contains(
      '検索結果 124 件中 101 〜 124件'
    )

    cy.get('.filtered-recording-search-table > tbody > tr')
      .filter(':contains("上を向いて歩こう")')
      .should(($trs) => {
        expect($trs, '24 items').to.have.length(24)
      })
  })

  it('Only exclude inst', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: { term: '上を向いて歩こう', excludeInst: 'true' },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 491 件中 1 〜 100件'
    )
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(2)'
    ).contains('トータス松本')

    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    cy.get('.pagination').contains('>').click()
    cy.get('.filtered-recording-search-number').contains(
      '検索結果 491 件中 101 〜 200件'
    )
    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    cy.get('.last-button').click()
    cy.get('.filtered-recording-search-number').contains(
      '検索結果 491 件中 401 〜 491件'
    )
    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '91 items').to.have.length(91)
    })
  })

  it('Only artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: { term: '上を向いて歩こう', artistName: '坂本九' },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 36 件中 1 〜 36件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(1) > :nth-child(2)'
    ).contains('坂本九')

    cy.get('.filtered-recording-search-table > tbody > tr')
      .filter(':contains("坂本九")')
      .should(($trs) => {
        expect($trs, '36 items').to.have.length(36)
      })

    cy.get('.pagination').should('not.be')
  })

  it('Partial and exclude inst', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: {
        term: '上を向いて歩こう',
        partialMatch: 'true',
        excludeInst: 'true',
      },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 122 件中 1 〜 100件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(2)'
    ).contains('トータス松本')

    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '100 items').to.have.length(100)
    })

    cy.get('.pagination').contains('>').click()
    cy.get('.filtered-recording-search-number').contains(
      '検索結果 122 件中 101 〜 122件'
    )
    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '22 items').to.have.length(22)
    })
  })

  it('Partial and artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: {
        term: '上を向いて歩こう',
        partialMatch: 'true',
        artistName: '坂本九',
      },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 31 件中 1 〜 31件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(2)'
    ).contains('坂本九')

    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '31 items').to.have.length(31)
    })

    cy.get('.pagination').should('not.be')
  })

  it('Exclude inst and artist filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: {
        term: '上を向いて歩こう',
        excludeInst: 'true',
        artistName: '坂本九',
      },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 35 件中 1 〜 35件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(2)'
    ).contains('坂本九')

    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '35 items').to.have.length(35)
    })

    cy.get('.pagination').should('not.be')
  })

  it('All filter', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: {
        term: '上を向いて歩こう',
        partialMatch: 'true',
        excludeInst: 'true',
        artistName: '坂本九',
      },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.filtered-recording-search-number').contains(
      '検索結果 30 件中 1 〜 30件'
    )

    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(1)'
    ).contains('上を向いて歩こう')
    cy.get(
      '.filtered-recording-search-table > tbody > :nth-child(2) > :nth-child(2)'
    ).contains('坂本九')

    cy.get('.filtered-recording-search-table > tbody > tr')
      .filter(':contains("坂本九")')
      .should(($trs) => {
        expect($trs, '30 items').to.have.length(30)
      })

    cy.get('.pagination').should('not.be')
  })

  it('No result', () => {
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=0&limit=100&fmt=json',
      { fixture: 'mock_ue1.json' }
    ).as('ue1Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=100&limit=100&fmt=json',
      { fixture: 'mock_ue2.json' }
    ).as('ue2Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=200&limit=100&fmt=json',
      { fixture: 'mock_ue3.json' }
    ).as('ue3Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=300&limit=100&fmt=json',
      { fixture: 'mock_ue4.json' }
    ).as('ue4Request')
    cy.intercept(
      'GET',
      'https://musicbrainz.org/ws/2/recording/?query=recording:%E4%B8%8A%E3%82%92%E5%90%91%E3%81%84%E3%81%A6%E6%AD%A9%E3%81%93%E3%81%86&offset=400&limit=100&fmt=json',
      { fixture: 'mock_ue5.json' }
    ).as('ue5Request')
    cy.mount(RecordingSearchFilter, {
      query: { term: '上を向いて歩こう', artistName: 'マキシマムザホルモン' },
    })
    cy.wait('@ue1Request')
    cy.wait('@ue2Request')
    cy.wait('@ue3Request')
    cy.wait('@ue4Request')
    cy.wait('@ue5Request')

    cy.get('.no-filtered-recording > p').contains(
      '条件に該当する音源はありませんでした。'
    )

    cy.get('.filtered-recording-search-table > tbody > tr').should(($trs) => {
      expect($trs, '0 item').to.have.length(0)
    })
  })
})
