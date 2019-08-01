<template>
    <div>
        <button @click="aaaa">景点列表</button>
    </div>
</template>

<script>
    import {init} from '../../routes'
    export default {
        name: "senceList",
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
