/// <reference types="cypress" />
import { faker } from '@faker-js/faker'

function gerarCNPJ(comPontos = false) {
  const rnd = (n) => Math.round(Math.random() * n);
  const mod = (dividendo, divisor) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
  const n = 9;
  const n1 = rnd(n), n2 = rnd(n), n3 = rnd(n), n4 = rnd(n), n5 = rnd(n), n6 = rnd(n), n7 = rnd(n), n8 = rnd(n);
  const n9 = 0, n10 = 0, n11 = 0, n12 = 1;
  
  let d1 = n12*2 + n11*3 + n10*4 + n9*5 + n8*6 + n7*7 + n6*8 + n5*9 + n4*2 + n3*3 + n2*4 + n1*5;
  d1 = 11 - (mod(d1, 11)); if (d1 >= 10) d1 = 0;
  
  let d2 = d1*2 + n12*3 + n11*4 + n10*5 + n9*6 + n8*7 + n7*8 + n6*9 + n5*2 + n4*3 + n3*4 + n2*5 + n1*6;
  d2 = 11 - (mod(d2, 11)); if (d2 >= 10) d2 = 0;
  
  const cnpj = `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
  
  if (comPontos) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  }
  return cnpj;
}

describe('API - Gestão de Emprresas', () => {

  let empresaId; 
  it('POST - Criar empresa', () => {
    
    const nomeEmpresa = "Empresa Final " + faker.string.alpha(4);
    const payload = {
      "name": nomeEmpresa,
      "cnpj": gerarCNPJ(false),
      "cep": "91000000",            
      "country": "Brasil",
      "state": "RS",
      "city": "Porto Alegre",
      "street": "Rua Teste",
      "number": "123",  
      "district": "Centro",
      "show": "1" 
    }

    cy.log('Enviando Payload:', JSON.stringify(payload))

    cy.request({
      method: 'POST',
      url: '/api/company/create',
      body: payload,
      failOnStatusCode: false
    }).then((response) => {
      
      if(response.status !== 201) {
         console.error("ERRO API:", response.body);
         throw new Error(`FALHA AO CRIAR: ${JSON.stringify(response.body)}`)
      }

      expect(response.status).to.eq(201, 'Empresa criada com sucesso!')
      
      if (response.body.id) empresaId = response.body.id
      if (response.body.id_company) empresaId = response.body.id_company
      if (response.body.company?.id) empresaId = response.body.company.id

      cy.log(`✅ ID Criado: ${empresaId}`)
    })
  })

  it('GET - Consultar a empresa criada', () => {
    if (!empresaId) throw new Error('Setup falhou: Sem ID para consultar')

    cy.request({
      method: 'GET',
      url: `/api/company/${empresaId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.name).to.contain("Empresa Final") 
    })
  })

  it('PATCH - Atualizar dados', () => {
    if (!empresaId) return

    cy.request({
      method: 'PATCH',
      url: `/api/company/${empresaId}/update`,
      failOnStatusCode: false,
      body: { 
        "city": "Nova Cidade",
        "district": "Novo Bairro"
      }
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 201])
    })
  })


  it('DELETE - Excluir a empresa', () => {
    if (!empresaId) return

    cy.request({
      method: 'DELETE',
      url: `/api/company/${empresaId}/delete`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})
describe('API - Empresas (Descoberta)', () => {

  it('INVESTIGAÇÃO - Descobrir campos da Empresa via GET', () => {
    cy.request({
      method: 'GET',
      url: '/api/company', 
      failOnStatusCode: false
    }).then((response) => {

      console.log('🔍 ESTRUTURA DA EMPRESA:', response.body[0]) 

      cy.log(JSON.stringify(response.body[0]))
    })
  })

})
