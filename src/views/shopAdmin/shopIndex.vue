<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="heads">头图管理</el-menu-item>
      <el-menu-item index="multiprobe">兑换说明</el-menu-item>
      <el-menu-item index="bright">商品管理</el-menu-item>
    </el-menu>
    <!-- <router-view></router-view> -->
    <div class="boxd">
      <bright v-if="activeIndex == 'bright'" />
      <multiprobe v-else-if="activeIndex == 'multiprobe'" />
      <heads v-else-if="activeIndex == 'heads'" />
    </div>
  </div>
</template>

<script>
import bright from "./index/bright";
import heads from "./index/heads";
import multiprobe from "./index/multiprobe";
export default {
  data() {
    return {
      activeIndex: "heads",
    };
  },
  components: {
    bright,
    heads,
    multiprobe,
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      // console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
.boxd {
  margin-top: 20px;
}
</style>