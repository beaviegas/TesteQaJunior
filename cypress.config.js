const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // --- 1. Configurações do Seu Relatório (Mochawesome) ---
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/relatorios',
    charts: true,
    reportPageTitle: 'Relatório de Bugs - CRUD',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  e2e: {
    // --- 2. Configuração da URL Base da API (O que faltava) ---
    baseUrl: 'http://localhost:8400',

    setupNodeEvents(on, config) {
      // --- 3. Ativação do Plugin do Relatório ---
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});