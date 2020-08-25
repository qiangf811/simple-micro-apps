<template>
  <div class="home">
    我是测试主页
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
  mounted () {
    console.log('home mounted')
  }
}
</script>
