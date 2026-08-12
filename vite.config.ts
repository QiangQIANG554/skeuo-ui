import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// 开发模式：跑 playground；构建模式：打包组件库
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [vue()],
      resolve: { alias: { '@': resolve(rootDir, 'src') } },
    }
  }

  return {
    plugins: [
      vue(),
      // 生成 .d.ts 类型声明（npm 发布的 types 入口）
      dts({
        tsconfigPath: './tsconfig.json',
        include: ['src'],
        exclude: ['src/App.vue'],
      }),
    ],
    build: {
      lib: {
        entry: resolve(rootDir, 'src/index.ts'),
        name: 'SkeuoUI',
        fileName: 'skeuo-ui',
        formats: ['es', 'umd'],
      },
      rollupOptions: {
        // vue 不打包进产物，由使用方提供
        external: ['vue'],
        output: {
          globals: { vue: 'Vue' },
          exports: 'named',
        },
      },
      cssCodeSplit: false, // 全量样式打进单个 css
    },
  }
})
