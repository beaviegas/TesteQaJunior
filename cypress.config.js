const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // 1. Adicione esta linha para ativar o reporter
  reporter: 'cypress-mochawesome-reporter',
  
  reporterOptions: {
    reportDir: 'cypress/relatorios', // Onde o arquivo vai ser salvo
    charts: true, // Gera gráficos bonitos
    reportPageTitle: 'Relatório de Bugs - CRUD', // Título da Aba
    embeddedScreenshots: true, // Anexa o print direto no HTML
    inlineAssets: true, // Deixa tudo num arquivo só (fácil de enviar)
    saveAllAttempts: false,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // 2. Adicione esta linha para o plugin funcionar
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
    // Suas outras configurações (baseUrl, etc) continuam aqui...
  },
});