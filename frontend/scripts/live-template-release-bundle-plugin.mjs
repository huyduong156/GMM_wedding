import { generateTemplateReleaseBundle } from './generate-template-release-bundle.mjs'

export function liveTemplateReleaseBundle() {
  let activeGeneration

  return {
    name: 'live-template-release-bundle',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split('?')[0]
        if (request.method !== 'GET' || path !== '/template-release-bundle.json') {
          next()
          return
        }

        try {
          activeGeneration ??= generateTemplateReleaseBundle().finally(() => {
            activeGeneration = undefined
          })
          const bundle = await activeGeneration
          response.statusCode = 200
          response.setHeader('content-type', 'application/json; charset=utf-8')
          response.setHeader('cache-control', 'no-store')
          response.end(JSON.stringify(bundle))
        } catch (error) {
          server.config.logger.error(
            `Cannot generate template release bundle: ${error instanceof Error ? error.message : String(error)}`,
          )
          response.statusCode = 500
          response.setHeader('content-type', 'application/json; charset=utf-8')
          response.end(JSON.stringify({ error: 'TEMPLATE_RELEASE_BUNDLE_GENERATION_FAILED' }))
        }
      })
    },
  }
}
