<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="heads">头图管理</el-menu-item>
      <el-menu-item index="functions">功能按钮</el-menu-item>
      <el-menu-item index="multiprobe">夜探阿朵</el-menu-item>
      <el-menu-item index="bright">夜游亮点</el-menu-item>
    </el-menu>
    <!-- <router-view></router-view> -->
    <div class="boxd">
        <bright v-if="activeIndex=='bright'" />
    <functions  v-else-if="activeIndex=='functions'" />
    <multiprobe v-else-if="activeIndex=='multiprobe'"/>
    <heads v-else-if="activeIndex=='heads'"/>
    </div>
  </div>
</template>

<script>
import bright from "../gohome/bright";
import functions from "../gohome/functions";
import heads from "../gohome/heads";
import multiprobe from "../gohome/multiprobe";
export default {
  data() {
    return {
      activeIndex: "heads",
    };
  },
  components: {
    bright,
    functions,
    heads,
    multiprobe,
  },
  methods: {
    handleSelect(key, keyPath) {
        this.activeIndex=key
      // console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.boxd{
    margin-top: 20px;
}
</style>