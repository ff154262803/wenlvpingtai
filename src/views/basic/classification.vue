<template>
    <div>
        <button @click="aaa">分类管理</button>
    </div>
</template>

<script>
    import {init} from '../../routes'
    export default {
        name: "classificationPage",
        methods:{
            aaa(){
                console.log(this.$route);
                this.$router.push('/three')
                init('three');
                // this.$store.state.children
            }
        }
    }
</script>

<style scoped>

</style>
