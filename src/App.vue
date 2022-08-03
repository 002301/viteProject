<template>
  <div class="app">
      <div class="music" :class="{active:playing}" @click="onMusic">
        <audio :src="bgm" loop id="bgm" ></audio>
      </div>
    <transition-group name="fade">
      <Loading v-if="pageIndex === -1" :assets="loadAssets" @loaded="loadingLoaded" ></Loading>
    </transition-group>
  </div>
</template>

<script setup>
import { onMounted, ref , reactive, provide } from 'vue';

const loadAssets = import.meta.globEager('./assets/**/*.(png|jpg)');

const loadingLoaded = ()=>{
  pageIndex = 0
}
let playing = $ref(false)
const onMusic = ()=>{
  if(playing){
    playing = false;
    document.querySelector('#bgm').pause()
    
  }else{
    playing = true;
    document.querySelector('#bgm').play()
  }
  
}
//初始化页数
let pageIndex = $ref(-1);
const setPage = (params) => {
    pageIndex = params
}
provide('setPage',setPage)

</script>

<style lang="scss" scoped>
.app{
  width: 100%;height: 100%;
  .music{
      position: absolute;
      z-index: 1000;
      top:20rpx;right:50rpx;
      background: url(./assets/music.png#y2);
  }
  .music.active{
    background-position: 0 100%;
    animation:r 4s linear infinite;
  }
}
@keyframes r{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>