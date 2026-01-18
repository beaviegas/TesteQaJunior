describe('Interface da Listagem de Usuários', () => {
  
  beforeEach(() => {
    cy.acessarHome()
  })

  it('Validação da estrutura da Tabela e Colunas obrigatórias', () => {

    const colunasEsperadas = ['Nome', 'Email', 'Telefone', 'Nascimento', 'Cidade', 'Empresa'] 
    cy.validarCabecalhosTabela(colunasEsperadas)
  })

  it('Validação se a listagem carregou sem erros de servidor', () => {

    cy.validarPaginaSemErros()
  })
})