describe('Recording Search', () => {
  it('Visits recording search result', () => {
    cy.visit('http://127.0.0.1:5173/')

    cy.get('input[type="search"]').should('be.visible').type('ミックスナッツ', {force: true})
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/recordings')
    cy.contains('ミックスナッツ')
    cy.contains('Official髭男dism')
  })
})
