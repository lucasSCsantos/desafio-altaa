describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/login');

    cy.get('input[id="email"]').type('email@teste.com');
    cy.get('input[id="password"]').type('testeteste');

    cy.get('button[type="submit"]').click();

    cy.url().should('equal', 'http://localhost:3000/');
  });

  it('should not login successfully with wrong email or password', () => {
    cy.visit('/login');

    cy.get('input[id="email"]').type('lucas@example.com');
    cy.get('input[id="password"]').type('123456');

    cy.get('button[type="submit"]').click();

    cy.get('li[data-type="error"]').should('have.length.at.least', 1);
  });
});
