describe('Company creation', () => {
  beforeEach(() => {
    cy.login(); // função customizada que vamos adicionar
  });

  it('should create a new company', () => {
    cy.visit('/');

    cy.wait(3000);

    cy.get('button').contains('Criar Empresa').click();

    cy.get('input[id="company-name"]').type('Empresa Teste');
    cy.get('input[id="company-logo"]').click();
    cy.get('button').contains('🚀').click();
    cy.get('button[type="submit"]').click();

    cy.contains('Empresa Teste');
  });

  it('should not create a new company with invalid data', () => {
    cy.visit('/');

    cy.wait(3000);

    cy.get('button').contains('Criar Empresa').click();

    cy.get('input[id="company-name"]').type('E');
    cy.get('input[id="company-logo"]').click();
    cy.get('button').contains('🚀').click();
    cy.get('button[type="submit"]').click();

    cy.get('li[data-type="error"]').should('have.length.at.least', 1);
  });
});
