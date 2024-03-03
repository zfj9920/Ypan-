<!--
 * @Author: maple_jy
 * @Date: 2023-09-04 15:27:04
-->
<template>
  <keep-alive include="AllFolderView,RecycleView" max="5">
    <router-view />
  </keep-alive>
</template>

<style lang="scss">
body {
  margin: 0px;
  height: 100vh;
}

.auto-img {
  width: 100%;
  display: block;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
