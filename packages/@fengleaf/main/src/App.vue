<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
    text-color="#fff"
    active-text-color="#ffd04b">
      <el-menu-item index="1">
        <router-link to="/refund">退费</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/charge">收费</router-link>
       </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>
<script>
  export default {
    data () {
      return {
        activeIndex: '1'
      }
    }
  }
</script>