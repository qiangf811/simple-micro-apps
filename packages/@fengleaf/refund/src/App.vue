<template>
  <div id="app">
    <h1>我是缓存的 下次切换我不会变</h1>
    <h1>{{message}}</h1>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      message: '初始化状态'
    }
  },
  mounted () {
    setTimeout(() => {
      this.message = '已经mounted，我被改掉了，且缓存'
    }, 2000)
  }
}
</script>
