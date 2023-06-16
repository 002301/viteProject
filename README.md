一个vite+vue项目的简单文档
包括定义插件:
- 背景图片自动添加尺寸 vite-plugin-background-add-property
- 背景图片不全路径 vite-plugin-background-backup
- 移动端自适应 vite-plugin-mobile-adaptation
- rpx转换rem vite-plugin-rpx-to-rem
- scss自动引入 vite-plugin-scss-import

# 三个组件
 ### Anime.vue 
 ```
 1.点击添加class 动画
 <AnimeVue checked='ani bigSmall' animeEndHide></AnimeVue>
 2.设置自动消失 autohide
 <AnimeVue  autohide="1000"></AnimeVue>
```
 ### Bgm.vue
 设置背景音乐

 ### loading.vue
 设置loading

# 一个css动画文件
animate.min.css