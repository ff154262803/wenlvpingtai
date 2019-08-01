<template>
    <div>
        \\111111111111111
        <button @click="aaaa">用户管理</button>
    </div>
</template>

<script>
    import {init} from '../../routes'
    export default {
        name: "scencelist",
        methods:{
            aaaa(){
                init('scenicdetail')
                this.$router.push('scenicdetail');
            }
        }
    }
</script>

<style scoped>

</style>
