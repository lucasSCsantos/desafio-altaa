describe('Signup', () => {
  it('should create a new user', () => {
    cy.visit('/signup');

    cy.get('input[id="name"]').type('Lucas Test');
    cy.get('input[id="email"]').type(`test${Date.now()}@test.com`);
    cy.get('input[id="password"]').type('123456');

    cy.get('button[type="submit"]').click();

    cy.url().should('equal', 'http://localhost:3000/');
  });

  it('should not create a new user when data is invalid', () => {
    cy.visit('/signup');

    cy.get('input[id="name"]').type('Lu');
    cy.get('input[id="email"]').type('invalid-email@email.com');
    cy.get('input[id="password"]').type('123');

    cy.get('button[type="submit"]').click();

    cy.get('li[data-type="error"]').should('have.length.at.least', 1);
  });
});
