<template>
    <div>
        <button @click="aaaa">用户管理</button>
    </div>
</template>

<script>
    import router from '../../routes'
    import {init} from '../../routes'
    export default {
        name: "user",
        methods:{
            aaaa(){
                init('three')
                this.$router.push('three');
            }
        }
    }
</script>

<style scoped>

</style>
