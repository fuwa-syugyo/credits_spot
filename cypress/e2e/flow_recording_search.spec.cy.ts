describe('Recording search and lookup artist', () => {
  it('Visits recording search result has Spotify link', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('input[type="search"]').should('be.visible').type('青春コンプレックス', {force: true})
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/recordings')
    cy.contains('青春コンプレックス')
    cy.contains('結束バンド')
    
    // ページネーションを動かして検索ワードがUndefinedにならないか確認
    cy.get(':nth-child(9) > .paginate-buttons').click();
    cy.get('body').should('not.contain', 'Undefined')
    cy.get('.back-button').click();

    cy.contains('青春コンプレックス').click()
    cy.url().should('include', '/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.contains('青春コンプレックス')
    cy.contains('Spotifyで聴く')

    cy.contains('結束バンド').click()
    cy.contains('結束バンド')
    cy.contains('青春コンプレックス')
    cy.go('back')

    cy.contains('音羽-otoha-').click()
    cy.get('table tbody tr')
    .contains('青春コンプレックス')
    .parent().parent()
    .contains('composer');
    cy.go('back')

    cy.contains('三井律郎').click()
    cy.get('table tbody tr')
    .contains('青春コンプレックス')
    .parent().parent()
    .contains('arranger');
    cy.go('back')

    cy.contains('比田井修').click()
    cy.get('table tbody tr')
    .contains('青春コンプレックス')
    .parent().parent()
    .contains('drums (drum set)');
  })

  it('Visits recording search result has not Spotify link', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('input[type="search"]').should('be.visible').type('青春', {force: true})
    cy.wait(5000)
    cy.get('button[type="submit"]').click()

    cy.contains('青春青春').click()
    cy.get('body').should('not.contain', 'Spotifyで聴く')
  })

  it('Continuously recording search', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('#search').type('ミックスナッツ{enter}', {force: true});
    cy.contains('検索').click();
    cy.contains('ミックスナッツ')

    cy.get('#search').focus().clear()
    .type('マリーゴールド{enter}', {force: true});
    cy.contains('検索').first().click();
    cy.contains('マリーゴールド')
  })

  it('apply filter', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('#search').type('天体観測{enter}', {force: true});
    cy.contains('検索').click();
    cy.contains('天体観測')

    //フィルター1(インスト音源除外フィルター)のみ
    cy.get('form > :nth-child(1) > input').check();
    cy.get('main > .container > form > .relative > .text-white').click();
    cy.wait(5000)
    cy.contains('天体観測')
    cy.get('table tbody tr').should('not.contain', '天体観測(Instrumental Version)')
    cy.go('back')

    //フィルター2(部分一致フィルター)のみ
    cy.get(':nth-child(2) > input').check();
    cy.get('main > .container > form > .relative > .text-white').click();
    cy.wait(5000)
    cy.contains('天体観測')
    cy.get('tbody').should('not.contain', 'スカイクラッドの観測者')
    cy.go('back')

    //フィルター3(アーティスト名フィルター)のみ
    cy.get('#filter').clear();
    cy.get('#filter').type('BUMP OF CHICKEN');
    cy.get('main > .container > form > .relative > .text-white').click();

    cy.get('tbody > :nth-child(1) > :nth-child(2)').contains('BUMP OF CHICKEN')
    cy.get('.table-auto tbody tr td:nth-child(2)').each(($td) => {
      expect($td.text()).not.to.include('入尾信充')
    })
  })
})
