<template>
  <div class="home">
    我是测试主页{{copy2}}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data: () => {
    return {
      count: 2
    }
  },
  computed: {
    copy2 () {
      debugger
      return this.count * 2
    }
  },
  mounted () {
    console.log('home mounted')
  }
}
</script>
