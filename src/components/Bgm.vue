<template>
  <teleport to="body">
      <div class="bgm" :class="{active:playing}" @click="onMusic">
        <audio :src="src" loop id="bgm" ></audio>
      </div>
  </teleport>
</template>

<script setup>
import { onMounted, ref , reactive } from 'vue';
//传入音频地址
const {src} = defineProps(['src'])

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

</script>

<style lang="scss" scoped>
.bgm{
    position: absolute;
    z-index: 1000;
    top:20rpx;right:50rpx;
    background: url(../assets/music.png#y2);
}
.music.active{
  background-position: 0 100%;
  animation:r 4s linear infinite;
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
