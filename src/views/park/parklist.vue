<template>
    <div>
        <button @click="aaaa">用户管理</button>
    </div>
</template>

<script>
    import {init} from '../../routes'
    export default {
        name: "user",
        methods:{
            aaaa(){
                init('base')
                this.$router.push('base');
            }
        }
    }
</script>

<style scoped>

</style>
