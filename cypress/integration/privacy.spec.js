/// <reference types="Cypress" />

describe('Central de Atendimento - Política de privacidade', () => {

  beforeEach(() => {
    cy.visit('./src/privacy.html')
  })

  it('verifica o título da página de privacidade', () => {
    cy.title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
  })

  it.only('testa a página da política de privavidade de forma independente', () => {
    cy.contains('p', 'Talking About Testing')
      .should('be.visible')
  })

})