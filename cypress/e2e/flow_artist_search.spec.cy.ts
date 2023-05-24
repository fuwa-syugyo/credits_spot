describe('template spec', () => {
  it('Visits artist search result', function() {
    cy.visit('http://localhost:5173/');
    cy.get('[value="人物名"]').check();
    cy.get('#search').type('小室哲哉{enter}', {force: true});
    cy.get('.text-white').click();
    cy.contains('小室哲哉')

    // ページネーションを動かして検索ワードがUndefinedにならないか確認
    cy.get(':nth-child(7) > .paginate-buttons').click();
    cy.get('body').should('not.contain', 'Undefined')
    cy.get('.back-button').click();

    cy.get(':nth-child(1) > .border > a').click();
    cy.contains('小室哲哉')

    cy.get('.artist-table > tbody > :nth-child(1) > td > a ').click();
    cy.url().should('include', '/recordings/08cea5ad-09af-466a-b2f4-46ec63dd2d09')
    cy.get('.text-2xl').contains('Dのテーマ (別れ)')
    cy.get('.my-2 > tbody > tr > .px-4').contains('小室哲哉')
    cy.go('back')

    cy.get('.songwriter-table > tbody > :nth-child(43) > :nth-child(2) > a').click();
    cy.get(':nth-child(2) > .max-w-\\[600px\\] > a').click();
    cy.get('table tbody tr')
    .contains('composer').parent().parent()
    .contains('小室哲哉')
    cy.get(':nth-child(6) > :nth-child(2) > a').contains('Spotifyで聴く');
    cy.go('back')
    cy.go('back')

    cy.get('.staff-table > tbody > :nth-child(1) > :nth-child(2) > a').click();
    cy.get('table tbody tr')
    .contains('arranger').parent().parent()
    .contains('小室哲哉')
    cy.go('back')

    cy.wait(5000) //通信回数制限回避のため待機
    cy.get('.staff-table > tbody').contains('keyboard').parent().find('a').click();
    cy.url().should('include', '/recordings/fb9f4ec9-c0e5-4834-8ce7-7c3ede8dcef8')
    cy.get('table tbody tr')
    .contains('keyboard').parent()
    .contains('小室哲哉')
  });

  it('Continuously artist search', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('[value="人物名"]').check();
    cy.get('#search').type('YOASOBI{enter}', {force: true});
    cy.contains('検索').click();
    cy.contains('YOASOBI')

    cy.get('#search').focus().clear()
    .type('the band apart{enter}', {force: true});
    cy.contains('検索').first().click();
    cy.contains('the band apart')
  })
})
