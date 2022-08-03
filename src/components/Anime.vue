<template>
<transition name="fade">
  <div v-if="isShow" :class="_className" @click="handleClick" @animationend="onEnded">
    <slot></slot>
  </div>
</transition>
</template>

<script setup>
import { onMounted} from 'vue';
// 1.点击添加class 动画
// <AnimeVue checked='ani bigSmall' animeEndHide></AnimeVue>
// 2.设置自动消失 autohide
// <AnimeVue  autohide="1000"></AnimeVue>

const props = defineProps({
    checked:String,
    animeEndHide:{type:Boolean,default:false},
    autohide:{type:Number,default:0}
  })
const emit = defineEmits(['onClick','onEnded'])
//选中状态
let _className = $ref('');
// 显示状态
let isShow = $ref(true);
//点击事件
const handleClick = () => {
  if(_className==''){
    _className = props.checked 
    emit('onClick')
  }else{
    className()
  }
}
const onEnded = () => {
    _className = ''
    emit('onEnded')
    if(props.animeEndHide) isShow=false
}
const className = (name='') => {
    _className = name
}
onMounted(()=>{
  if(props.autohide){
    setTimeout(() => {
      isShow = false
    }, props.autohide)
  }

})

defineExpose({className})
</script>