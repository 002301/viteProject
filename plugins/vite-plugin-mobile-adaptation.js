const script = `
(function () {
  var psdWidth = document.documentElement.getAttribute('boom-mobile') || 750;
  var initFontSize = parseFloat(window.getComputedStyle(document.documentElement)['font-size']);
  var vwFontScale = 1;
  var zoomStyle = document.getElementById('zoom-style');
  var isMobile =(!!navigator.userAgent.match(/(iPhone|iPod|Android|ios|Mobile)/i));
  /*横屏*/
  var portrait = '';
  /*竖屏*/
  if (!zoomStyle) {
    zoomStyle = document.createElement('style');
    zoomStyle.id = 'zoom-style';
    zoomStyle.type = 'text/css';
    document.documentElement.appendChild(zoomStyle);
  }
  var timer = null;
  _resize(true);
  window.addEventListener('orientationchange', resize, false);
  window.addEventListener('load', resize, false);
  function resize() {
    clearTimeout(timer);
    timer = setTimeout(function(){_resize(true)}, 300);
  }
  function _resize(isFirst) {
    var screen_width = document.documentElement.clientWidth;
    if (!screen_width) {
      setTimeout(function(){_resize(true)}, 100);
      return;
    }
    var screen_height = window.innerHeight;
    if (window.innerWidth !== screen_width) {
      screen_height *= screen_width / window.innerWidth;
    }
    var fontSize = screen_width / (psdWidth / 2) * 50;
    if (screen_width < screen_height) {
      var scaleSize = Math.min(1, screen_height / screen_width * (375 / 650));
      portrait = 'html{font-size:' + fontSize/initFontSize*100 + '% !important;font-size:' + 10000/psdWidth*vwFontScale + 'vw !important;}' + (scaleSize < 1 ? '.auto_scale{-webkit-transform: scale(' + scaleSize + ');transform: scale(' + scaleSize + ');}.auto_scale_center{-webkit-transform:translate(-50%,-50%) scale(' + scaleSize + ');transform:translate(-50%,-50%) scale(' + scaleSize + ');}' : '.auto_scale_center{-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);}');
    }else{
      portrait =  '@media (min-width: 999px) and (max-width: 1440px) and (orientation : landscape){html{font-size:50px !important;}body{font-size: 14px;}}@media  (min-width: 1441px) and (orientation : landscape){html{font-size:60px !important;}body{font-size: 14px;}}'
    }
    zoomStyle.innerHTML = portrait ;
    if (portrait) {
      window.removeEventListener('orientationchange', resize);
    }
  }

})();
`

export default function vitePluginMobileAdaptation(){
  return {
    name: 'vite-plugin-mobile-adaptation',
    transformIndexHtml(){
        return [{
          tag: 'script',
          children: script,
          injectTo: 'head'
        }]
    }
  }
}
