describe('Interface da Listagem de Usuários', () => {
  
  beforeEach(() => {
    cy.acessarHome()
  })

  it('Deve validar a estrutura da Tabela e Colunas obrigatórias', () => {

    const colunasEsperadas = ['Nome', 'Email', 'Cidade', 'Ações'] 
    cy.validarCabecalhosTabela(colunasEsperadas)
  })

  it('Deve verificar se a listagem carregou sem erros de servidor', () => {

    cy.validarPaginaSemErros()
  })
})