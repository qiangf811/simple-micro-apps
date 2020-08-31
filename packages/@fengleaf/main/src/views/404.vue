<template>
    <div id="subapp-viewport">
       <div class="v404-container" :style="{height:screenHeight+'px' }">
        <img src="../assets/404.svg">
       </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                screenHeight: 600
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.screenHeight = document.documentElement.clientHeight - 82
            })
        }
    }
</script>

<style lang="scss" scoped>
.v404-container{
    display: flex;
    align-items: center;
    justify-content: center;
    &>img{
        width: 600px;
    }
}
</style>