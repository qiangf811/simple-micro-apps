<template>
  <div id="app">
    <div style="width: 100%;">
      <HISHeader :applicationList="applicationList" :applicationTree="applicationTree"
        :currentApplication="currentApplication" />
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
        return this.$store.state.flatApplicationList
      },
      applicationTree () {
        return this.$store.state.applicationList
      },
      currentApplication () {
        return this.$store.getters.currentApplication
      },
      redirect () {
        return this.$store.state.redirect
      },
      redirectFromRemote () {
        return this.$route.query.redirect
      }
    },
    watch: {
      'currentApplication.id': {
        handler (val) {
          if (val) {
            if (this.redirectFromRemote) {
              this.$router.push(`/${this.redirectFromRemote}`)
            } else {
              const { children = [] } = this.currentApplication
              const { path } = children[0] || {}
              if (path) { // 当前系统存在菜单，判断是否和当前一致，如果不一致就进行跳转
                if (this.redirect && path !== this.$router.currentRoute.path) {
                  this.$router.push(children[0].path)
                }
              }
            }
          }
        }
      }
    }
  }
</script>