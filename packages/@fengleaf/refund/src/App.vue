<template>
  <div id="app">
    <h1>退费</h1>
    <h1>{{arrayCopy}}</h1>
    <!-- <h1>{{array}}</h1> -->
    <!--<h1>{{message}}</h1>-->
  </div>
</template>
<script>
  export default {
    name: 'App',
    data () {
      return {
        // message: '初始化状态',
        array: [{ a: {} }]
      }
    },
    mounted () {
      window.array = this.array
    },
    computed: {
      arrayCopy () {
        console.log('triggle computed')
        return this.array.filter(item => item.a === 3)
      }
    }
    // watch: {
    //   array: {
    //     // deep: true,
    //     handler () {
    //       console.log('change')
    //     }

    //   }
    // }
  }
</script>