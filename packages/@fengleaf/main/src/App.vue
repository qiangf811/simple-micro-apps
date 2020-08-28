<template>
  <div id="app">
   <div style="width: 100%;">
      <HISHeader :applicationList="applicationList" :currentApplication="currentApplication" />
    </div>
    <div class="view-wrapper">
      <router-view />
    </div>
    <win-footer></win-footer>
  </div>
</template>
<script>
  import HISHeader from '@/components/Header'
  import mixin from '@/mixins'

  export default {
    mixins: [mixin],
    components: {
      HISHeader
    },
    computed: {
      applicationList () {
        return this.$store.state.applicationList
      },
      currentApplication () {
        return this.$store.getters.currentApplication
      },
      redirect () {
        return this.$store.state.redirect
      }
    },
    watch: {
      'currentApplication.id': {
        handler (val) {
          if (val) {
            const { children = [] } = this.currentApplication
            const { path } = children[0] || {}
            if (path) { // 当前系统存在菜单，判断是否和当前一致，如果不一致就进行跳转
              debugger
              if (this.redirect && path !== this.$router.currentRoute.path) {
                this.$router.push(children[0].path)
              }
            } else {
              // 当前系统不存在菜单 需要跳转至空页面
              this.$router.push('/empty')
              console.log('不存在菜单')
            }
          }
        }
      }
    }
  }
</script>