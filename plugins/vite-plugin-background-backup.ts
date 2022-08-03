export default function vitePluginBackgroundBackup(){
  let config;
  return {
    name: 'vite-plugin-background-backup',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(code, id){
      if(/\.scss$/.test(id)){
        const relativePath = id.replace(config.root, '').replace(/^\//,'').replace(/[^\/]*$/,'').replace(/.+\//,'../');
        const newCode = code.replace(
          /url\(['|"]*([^'");]+)['|"]*\)[^;]*;/g,
          (_, url)=>{
            if(/^http/.test(url)) return _;
            return _ + `\n--bg: ${ process.env.NODE_ENV === 'production' ? url.replace(relativePath,'') : url};`;
          }
        )
        return {
          code: newCode,
        }
      }
    },
  }
}
