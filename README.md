# Automação de Testes E2E (Front-end & API)

Este projeto consiste na automação de testes "End-to-End" para Teste técnico em Quality Assurance. A cobertura inclui testes de interface (Front-end) e testes de integração de serviços (API), realizados em um contexto de **Desafio Blackbox**.

## Documentação e Planejamento

Todo o planejamento estratégico, incluindo o Plano de Testes detalhado e o Relatório de Bugs (com os impedimentos técnicos encontrados na API), está documentado no Notion:

**[CLIQUE AQUI PARA ACESSAR O PLANO DE TESTE E REPORT DE BUGS (NOTION)](COLOQUE_SEU_LINK_DO_NOTION_AQUI)**

---

## Tecnologias Utilizadas

* **Cypress:** Framework de automação de testes (Front e API).
* **JavaScript:** Linguagem de programação.
* **Faker.js:** Geração de massa de dados dinâmica.
* **Node.js:** Ambiente de execução.

---

## Como Executar o Projeto

### Pré-requisitos
Certifique-se de ter o **Node.js** e o **npm** instalados em sua máquina.

### 1. Instalação
Clone o repositório e instale as dependências:

`npm install`

### 2. Executando os Testes
Modo Interativo (Interface Visual)
Para abrir o Cypress Runner e escolher quais testes executar (Front ou API):

`npx cypress open`

Modo Headless (Execução Completa)
Para rodar TODOS os testes (Front e API) em segundo plano e gerar o relatório final:

`npx cypress run`


Apenas API:

`npx cypress run --spec "cypress/e2e/api/**/*"`
Relatórios e Evidências
Um relatório da última execução foi versionado neste repositório. Em caso de falhas ou execução bem-sucedida, as evidências são salvas automaticamente em:

cypress/relatorios/ 

cypress/screenshots/ (Prints automáticos em caso de erro)

### Escopo dos Testes
 Front-end (Interface)
Testes focados na jornada do usuário e validação visual:


Navegação pelos menus.

Fluxos de Cadastro e Edição (Caminho feliz).

Validação de campos obrigatórios e mensagens de erro visuais (caminho triste).

Back-end (API)
Testes focados na integração e integridade dos dados, realizados via Engenharia Reversa (sem documentação oficial):

Mapeamento de endpoints via inspeção de tráfego.

Tentativas de descoberta de payload para o fluxo de criação (POST).

Validação de status codes e contratos de resposta.

Nota sobre a API: Foi identificado um bloqueio técnico na rota de criação de empresas (POST) devido a regras de validação não documentadas ("invalid data"). As evidências técnicas e as tentativas de solução estão detalhadas no Relatório de Bugs no Notion.

Autora: Beatriz Viegas