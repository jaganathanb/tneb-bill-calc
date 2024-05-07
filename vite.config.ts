/// <reference types="vitest/config" />

import { URL, fileURLToPath } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno } from 'unocss'
import svgLoader from 'vite-svg-loader'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import checker from 'vite-plugin-checker'

const pathSource = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'src'
)

const root = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let environment = {} as any
  const isBuild = command === 'build'
  environment = isBuild
    ? loadEnv(mode, root)
    : loadEnv(
        process.argv[3] === '--mode' ? process.argv[4] : process.argv[3],
        root
      )

  return {
    plugins: [
      vue(),
      svgLoader({ defaultImport: 'url' }),
      checker({
        vueTsc: true
      }),
      Unocss({
        presets: [presetAttributify(), presetUno()]
      }),
      ElementPlus({}),
      AutoImport({
        imports: ['vue'],
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'Icon'
          })
        ],
        vueTemplate: true,
        dts: path.resolve(pathSource, '@types/auto-imports.d.ts')
      }),
      Components({
        resolvers: [
          IconsResolver({
            enabledCollections: ['ep']
          }),
          ElementPlusResolver()
        ],
        dirs: ['src/**/*'],
        dts: path.resolve(pathSource, '@types/components.d.ts')
      }),
      Icons({
        autoInstall: true
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src', import.meta.url))
      }
    },
    build: {
      target: 'ES2022',
      outDir: 'dist',
      sourcemap: environment.APP_ENV === 'dev',
      rollupOptions: {
        output: {
          minifyInternalExports: true,
          manualChunks: {
            'vue-chunks': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
            vendor: [
              'lodash',
              'axios',
              'dayjs',
              'chart.js',
              '@vue-js-cron/element-plus'
            ]
          }
        }
      },
      cssCodeSplit: true
    }
  }
})
