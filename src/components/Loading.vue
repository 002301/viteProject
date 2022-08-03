<template>
  <div class="app-loading">
    <slot v-if="$slots.default" :progress="progress"/>
    <div class="loading" v-else>
      <div class="loading-img"><div class="loading-bar" :style="{width:progress+'%'}"></div></div>
      <div class="loading-num">{{progress}}%</div>
    </div>
  </div>
</template>
<script lang="ts">
/**
 * loading组件
 * 用于加载资源
 * @Prop assets  //要加载的资源
 * @Emit loaded(imgData:{[key:string]:{src: string, img: HTMLImageElement}})  //load完成回调
 * <Slot/>  //若默认效果满足不了项目，可以使用插槽替换原有loading，且会传入loading进度（progress），例子如下：
 * ```
 *   <loading v-slot="{ progress }">
 *       <span>{{progress}}%</span>
 *   </loading>
 * ```
 */
import { defineComponent } from 'vue'
const imgData:{[key:string]:{src: string, img: HTMLImageElement}}={};
export default defineComponent({
  name: 'Loading',
  props: ['assets'],
  data(){
    return {
      loadNum: 0,
      totalNum: 0,
      assetsKeys: null,
    }
  },
  created(){
    this.assetsKeys = Object.keys(this.assets);
    if(this.assetsKeys.length > 0){
      this.totalNum += this.assetsKeys.length;
      this.loadAssets();
    }else{
      this.loaded();
    }
  },
  methods: {
    loadAssets(){
      this.assetsKeys.forEach(key=>{
        const img = new Image();
        img.onload = img.onerror =()=>{
          imgData[key.replace(/^\.\/assets\//,'')] = {
            src: this.assets[key].default,
            img: img,
          };
          this.loadNum++;
        };
        img.src = this.assets[key].default;
      });
    },
    loaded(imgData?){
      this.$emit('loaded', imgData);
    }
  },
  computed: {
    progress(){
      if(!this.totalNum) return 0;
      return Math.floor(this.loadNum/this.totalNum*100);
    }
  },
  watch: {
    progress(newValue){
      if(newValue === 100){
        this.loaded(imgData);
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.app-loading{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
.loading{
  position:absolute;
  top:50%;
  left:50%;
  color:#fff;
  .loading-img{
    position:absolute;
    width: 436rpx;
    height: 26rpx;
    background:#3c364f;
    transform:translate(-50%,-50%);
    border-radius:30rpx;
    overflow:hidden;
    .loading-bar{
      width: 100%;
      height: 100%;
      background:#78e6dc;
    }
  }
  .loading-num{
    top:-50rpx;
    position:absolute;
    transform:translate(-50%,-50%);

  }
}
@keyframes rotate_ani {
  0%{
    transform:rotate(0);
  }
  100%{
    transform:rotate(360deg);
  }
}
</style>
