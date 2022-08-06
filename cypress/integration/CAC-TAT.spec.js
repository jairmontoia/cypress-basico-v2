/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    cy.get('#firstName')
      .should('be.visible')
      .type('primeiro nome')
    cy.get('#lastName')
      .should('be.visible')
      .type('sobrenome')
    cy.get('#email')
      .should('be.visible')
      .type('a@b.com')
    cy.get('#open-text-area')
      .should('be.visible')
      .type(longText, { delay: 0 })
    // cy.get('button[type="submit"]')
    //   .should('be.visible')
    //   .click()
    cy.contains('button', 'Enviar')
      .should('be.visible')
      .click()
    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('primeiro nome')
    cy.get('#lastName').type('sobrenome')
    cy.get('#email').type('a')
    cy.get('#open-text-area').type('teste')
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
    cy.get('#phone')
      .type('teste')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('primeiro nome')
    cy.get('#lastName').type('sobrenome')
    cy.get('#email').type('a@b.com')
    // cy.get('#phone-checkbox').click()
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('teste')
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('primeiro nome')
      .should('have.value', 'primeiro nome')
      .clear()
      .should('have.value', '')
    cy.get('#lastName')
      .type('sobrenome')
      .should('have.value', 'sobrenome')
      .clear()
      .should('have.value', '')
    cy.get('#email')
      .type('a@b.com')
      .should('have.value', 'a@b.com')
      .clear()
      .should('have.value', '')
    cy.get('#phone')
      .type('12345678')
      .should('have.value', '12345678')
      .clear()
      .should('have.value', '')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    // cy.get('button[type="submit"]').click()
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .should('be.visible')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .should('be.visible')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .should('be.visible')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('have.value', 'feedback')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each($el => {
        cy.wrap($el)
          .click()
          .should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .should('have.length', 2)
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should($input => {
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should($input => {
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('@sampleFile')
      .should($input => {
        expect($input[0].files[0].name).to.be.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicanco no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .should('not.have.attr', 'target')
    cy.contains('a', 'Política de Privacidade')
      .click()
    cy.contains('p', 'Talking About Testing')
      .should('be.visible')
  })

})
