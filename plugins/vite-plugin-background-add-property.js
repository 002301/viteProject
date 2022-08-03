const sizeOf = require('image-size');
const { resolve } = require('path');
import { normalizePath } from 'vite'
const pcFlag = false;

export default function vitePluginBackgroundAddProperty(){
  let config;
  return {
    name: 'vite-plugin-background-add-property',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async transform(code, id){
      // console.log('process:',process.env.NODE_ENV,code,id);
      if(/\.scss$/.test(id)){
        code = code.replace('@charset "UTF-8";','');
        const ast = cssParse(code);
        for(let selector in ast ){
          const property = ast[selector].value;
          if(property.hasOwnProperty('background') && property.background.indexOf('url')>-1){
            let assetsUrl = property.background.match(/url\(['|"]*([^'")]+)['|"]*\)/)[1];
            if(assetsUrl.indexOf('var')===0) continue;
            let imageInfo = assetsUrl.match(/#(.+)/);
            let scaleNum = 1;
            let xFrame = 1;
            let yFrame = 1;
            if(imageInfo){
              scaleNum = imageInfo[1].match(/s(\d+\.*\d*)/)? +imageInfo[1].match(/s(\d+\.*\d*)/)[1] : 1;
              xFrame = imageInfo[1].match(/x(\d+)/)? +imageInfo[1].match(/x(\d+)/)[1] : 1;
              yFrame = imageInfo[1].match(/y(\d+)/)? +imageInfo[1].match(/y(\d+)/)[1] : 1;
            }
            // console.log(process.env.NODE_ENV,property);
            if(process.env.NODE_ENV === 'production' && property.hasOwnProperty('--bg')) {
              assetsUrl = property['--bg'];
            }
            assetsUrl = assetsUrl.replace(/#.*$/, '');
            assetsUrl = assetsUrl.replace(/\.\.\//g, './'); //过滤多级路径
            assetsUrl = normalizePath(assetsUrl);
            if(!/__VITE_ASSET__|^http/.test(assetsUrl)){
              assetsUrl = process.env.NODE_ENV === 'production' ? resolve(config.root, assetsUrl) : config.root + assetsUrl;
              const dimensions = await sizeOf(assetsUrl);
              if(!property.hasOwnProperty('width')) property['width'] = dimensions.width / (pcFlag ? 1 : 100) * scaleNum / xFrame + `${pcFlag ? 'px' : 'rem'}`;
              if(!property.hasOwnProperty('height')) property['height'] = dimensions.height / (pcFlag ? 1 : 100) * scaleNum / yFrame + `${pcFlag ? 'px' : 'rem'}`;
              if(!property.hasOwnProperty('background-size')){
                if(xFrame + yFrame > 2){
                  property['background-size'] = `${100 * xFrame}% ${100 * yFrame}%`;
                }else{
                  property['background-size'] = 'cover';
                }
              }
              if(!property.hasOwnProperty('background-repeat')) property['background-repeat'] = "no-repeat";
              // 当 top 、left 单位为 %， 自动补充 margin
              if(property.hasOwnProperty('top') && (property.top.indexOf('%')>-1) && !property.hasOwnProperty('margin') && !property.hasOwnProperty('margin-top')) property['margin-top'] = -dimensions.height / (pcFlag ? 1 : 100) / 2 * scaleNum + `${pcFlag ? 'px' : 'rem'}`;
              if(property.hasOwnProperty('left') && (property.left.indexOf('%')>-1) && !property.hasOwnProperty('margin') && !property.hasOwnProperty('margin-left')) property['margin-left'] = -dimensions.width / (pcFlag ? 1 : 100) / 2 * scaleNum + `${pcFlag ? 'px' : 'rem'}`;
            }
          }
        }
        return {
          code: cssStringify(ast)
        }
      }
    },
  }
}

function cssParse(string){
  const ast = {};
  let pointPrev = 0;
  let key = null;
  let property = null;
  let specialKeyFlag = false;
  let specialBlock = 0;
  for(let pointNext = 0; pointNext < string.length; pointNext++){
    if(string.charAt(pointNext) === "{"){
      if(!specialKeyFlag){
        key = string.slice(pointPrev, pointNext).replace(/^\s+|\s+$/g,'');
        if(!ast[key]) ast[key] = {};
        specialKeyFlag = /@/i.test(key);
        // special 初始化
        if(specialKeyFlag){
          ast[key].special = true;
          pointPrev = pointNext;
        }else{
          if(!ast[key].value) ast[key].value = {};
          pointPrev = pointNext + 1;
        }
      }
      // special 内部处理
      if(specialKeyFlag) specialBlock++;
    }else if(string.charAt(pointNext) === "}"){
      if(!specialKeyFlag){
        pointPrev = pointNext + 1;
        key = null;
      }else{
        specialBlock--;
        if(specialKeyFlag && specialBlock === 0){
          ast[key].value = string.slice(pointPrev, pointNext+1).replace(/^\s+|\s+$/g,'');
          specialKeyFlag = false;
          pointPrev = pointNext + 1;
        }
      }
    }else if(string.charAt(pointNext) === ":" && key){
      if(!specialKeyFlag){
        const propertyTemp = string.slice(pointPrev, pointNext).replace(/^\s+|\s+$/g,'');
        if(propertyTemp.indexOf('http')>-1) continue;
        property = propertyTemp;
        pointPrev = pointNext + 1;
      }
    }else if(string.charAt(pointNext) === ";"){
      if(!specialKeyFlag){
        ast[key]['value'][property] = string.slice(pointPrev, pointNext).replace(/^\s+|\s+$/g,'');
        pointPrev = pointNext + 1;
      }
    }
  }
  return ast;
}

function cssStringify(ast){
  let string = "";
  for(let selector in ast){
    if(ast[selector].special){
      string += selector + ast[selector].value;
    }else{
      string += selector + "{";
      for(let property in ast[selector].value){
        if(property === '--bg') continue;
        string += property + ": " + ast[selector].value[property] + ';';
      }
      string += "}";
    }
  }
  return string;
}
