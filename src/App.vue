<template>
  <div class="app">
    <Bgm ></Bgm>
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
}
</style>