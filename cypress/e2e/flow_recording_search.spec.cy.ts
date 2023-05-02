describe('Recording search and lookup artist', () => {
  it('Visits recording search result', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('input[type="search"]').should('be.visible').type('ミックスナッツ', {force: true})
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/recordings')
    cy.contains('ミックスナッツ')
    cy.contains('Official髭男dism')

    cy.contains('ミックスナッツ').click()
    cy.url().should('include', '/recordings/30ed18b6-d95b-4efe-a332-6fcc0e07b087')
    cy.contains('ミックスナッツ')
    cy.contains('Official髭男dism')
    cy.contains('composer')
    cy.contains('藤原聡')
    cy.contains('trombone')
    cy.contains('川島稔弘')
  })
})
