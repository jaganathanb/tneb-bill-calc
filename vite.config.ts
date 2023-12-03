/// <reference types="vitest/config" />

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
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
import path from 'path'
const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
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
      dts: path.resolve(pathSrc, '@types/auto-imports.d.ts')
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep']
        }),
        ElementPlusResolver()
      ],

      dts: path.resolve(pathSrc, '@types/components.d.ts')
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
