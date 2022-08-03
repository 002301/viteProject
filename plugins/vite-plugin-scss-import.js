const fg = require('fast-glob');
const path = require('path');
export default function vitePluginScssImport(){
  let config;
  return {
    name: 'vite-plugin-scss-import',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(code, id){
      if(/\.scss$/.test(id)){
        const newCode = code.replace(
          /import\((.+)\)/g,
          (_, url)=>{
            url = url.replace(/^'|^"|'$|"$/g,'');
            const entries = fg.sync(url, {
              cwd: path.resolve(id.match('.+/')[0]),
              ignore: ['**/node_modules/**']
            });
            let eachStr = '';
            entries.forEach((item, index)=>{
              const name = item.match(/([^./]+)\./)[1];
              const numberMatch = new RegExp(url).exec(item);
              if(numberMatch && numberMatch[1]) index = numberMatch[1];
              eachStr += `('${item}', ${index}, ${name}),`;
            })
            return eachStr;
          }
        );
        return {
          code: newCode,
        }
      }
    },
  }
}
