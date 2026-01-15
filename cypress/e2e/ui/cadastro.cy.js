describe('Funcionalidade: Cadastro de Usuário', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5400')
  })

  it('Deve cadastrar um novo usuário (Usando Custom Command)', () => {
    cy.abrirModalCadastro()

    const usuarioCompleto = {
        nome: 'Beatriz Viegas',
        email: 'beatriz@qa.com',
        telefone: '51999998888',
        cidade: 'Porto Alegre',
        dataNascimento: '1997-02-09',
        empresas: 'Empresa Teste'
    }

    cy.preencherCadastro(usuarioCompleto)

    cy.contains('button', 'Salvar').click()
    cy.contains('Beatriz Viegas').should('be.visible')
  })
})