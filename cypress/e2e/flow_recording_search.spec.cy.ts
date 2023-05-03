describe('Recording search and lookup artist', () => {
  it('Visits recording search result has Spotify link', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('input[type="search"]').should('be.visible').type('青春コンプレックス', {force: true})
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/recordings')
    cy.contains('青春コンプレックス')
    cy.contains('結束バンド')

    cy.contains('青春コンプレックス').click()
    cy.url().should('include', '/recordings/7c8ca692-d78a-4785-a7f4-7cc9ed0fb0f5')
    cy.contains('青春コンプレックス')
    cy.contains('結束バンド')
    cy.contains('composer')
    cy.contains('音羽-otoha-')
    cy.contains('arranger')
    cy.contains('三井律郎')
    cy.contains('drums (drum set)')
    cy.contains('比田井修')
    cy.contains('Spotifyで聴く')

    cy.contains('結束バンド').click()
    cy.contains('結束バンド')
    cy.contains('青春コンプレックス')
    cy.go('back')

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
})
