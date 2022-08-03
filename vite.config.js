import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginMobileAdaptation from "./plugins/vite-plugin-mobile-adaptation"
import vitePluginBB from './plugins/vite-plugin-background-backup'
import vitePluginRpxToRem from "./plugins/vite-plugin-rpx-to-rem"
import vitePluginBAP from "./plugins/vite-plugin-background-add-property"
import vitePluginSI from "./plugins/vite-plugin-scss-import"
import viteImagemin from 'vite-plugin-imagemin'
import Components from 'unplugin-vue-components/vite'

const { resolve } = require('path')


export default defineConfig({
  root: 'src/',
  base: './',
  publicDir: './public',
  plugins: [vue({
    reactivityTransform: true,
  }),
    vitePluginMobileAdaptation(),
    vitePluginSI(),
    vitePluginBB(),
    vitePluginBAP(),
    vitePluginRpxToRem(),
    Components({ dts: true, dirs:['./'] }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
    }),
  ],
  server: {
    open: true, // 运行自动打开浏览器
  },
  build:{
    assetsInlineLimit: 0,
    brotliSize:true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      },
    },
    outDir: resolve(__dirname, 'dist'),
  }
})
