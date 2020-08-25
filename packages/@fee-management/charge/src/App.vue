<template>
  <div id="app">
    <h1>{{name}}</h1>
    <img alt="Vue logo" src="./assets/logo.png">
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  data () {
    return {
      name: '收11111'
    }
  },
  mounted () {
    console.log('mounted')
    setTimeout(() => {
      this.name = '收费'
    }, 3000)
  }
}
</script>
