<template>
    <div>
        用户管理
    </div>
</template>

<script>
    import {init} from '../../routes'
    export default {
        name: "user",
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
