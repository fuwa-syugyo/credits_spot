describe('template spec', () => {
  it('Visits artist search result', function() {
    cy.visit('http://localhost:5173/');
    cy.get('[value="人物名"]').check();
    cy.get('#search').type('小室哲哉{enter}', {force: true});
    cy.get('.text-white').click();
    cy.contains('小室哲哉')
    cy.get(':nth-child(9) > .paginate-buttons').click();
    cy.get('body').should('not.contain', 'Undefined')
    cy.get('.back-button').click();
    cy.get(':nth-child(1) > .border > a').click();
    cy.contains('小室哲哉')
    cy.get('.table-auto > tbody > :nth-child(43) > :nth-child(2) > a').click();
    cy.get(':nth-child(2) > .max-w-\\[600px\\] > a').click();
    cy.get('table tbody tr')
    .contains('composer').parent().parent()
    .contains('小室哲哉')
    cy.get(':nth-child(1) > :nth-child(5) > :nth-child(2) > a').contains('Spotifyで聴く');
  });
})
