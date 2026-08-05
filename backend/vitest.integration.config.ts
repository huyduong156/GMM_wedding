import { defineConfig, mergeConfig } from 'vitest/config'

import baseConfig from './vitest.config'

export default mergeConfig(baseConfig, defineConfig({
  test: {
    include: ['integration/**/*.integration.test.ts'],
    testTimeout: 60_000,
  },
}))
