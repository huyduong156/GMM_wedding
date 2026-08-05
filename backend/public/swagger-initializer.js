window.addEventListener('DOMContentLoaded', () => {
  window.ui = window.SwaggerUIBundle({
    url: '/api/openapi',
    dom_id: '#swagger-ui',
    deepLinking: true,
    displayRequestDuration: true,
    persistAuthorization: false,
    queryConfigEnabled: false,
    supportedSubmitMethods: [],
    validatorUrl: null,
  })
})
