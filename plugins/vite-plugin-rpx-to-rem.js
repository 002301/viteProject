const packageInfo = require('../package.json');

export default function vitePluginRpxToRem(){
  return {
    name: 'vite-plugin-rpx-to-rem',
    transform(code, id){
      if(/\.scss$/.test(id)){
        return {
          code: code.replace(/([0-9.]+)rpx/g, (match, p1)=>{return `${p1/100}rem`})
        }
      }
    }
  }
}
