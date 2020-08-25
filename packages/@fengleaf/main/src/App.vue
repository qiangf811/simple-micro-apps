<template>
  <div id="app">
    <div style="width: 100%;">
      <win-header :options="options" :routes="routes"></win-header>
    </div>
    <div class="view-wrapper">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
    <win-footer></win-footer>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        clickIndex: 0,
        options: {
          title: '门诊费用管理系统',
          logoLink: '/portal/#/index',
          theme: true
        }
      }
    },
    computed: {
      routes () {
        return this.$store.state.menuList
      }
    }
  }
</script>