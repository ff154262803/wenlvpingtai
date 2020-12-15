<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col
        :span="20"
        class="logo"
        :class="collapsed ? 'logo-collapse-width' : 'logo-width'"
      >
        <img src="../../static/img/zksw.png" alt="" />
        {{ collapsed ? "" : sysName }}
      </el-col>
      <el-col :span="4" class="userinfo">
        {{ sysUserName }}
        <el-button type="text" @click="logout">退出登录</el-button>
        <!-- <el-dropdown trigger="hover">-->
        <!--<span class="el-dropdown-link userinfo-inner">-->
        <!--&lt;!&ndash; <img src="../../static/img/user.png" alt=""> &ndash;&gt;-->
        <!--{{sysUserName}}</span>-->
        <!--&lt;!&ndash;<el-button @click.native="logout">退出登录</el-button>&ndash;&gt;-->
        <!--<el-dropdown-menu slot="dropdown">-->
        <!--&lt;!&ndash;<el-dropdown-item>设置</el-dropdown-item>&ndash;&gt;-->
        <!--<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>-->
        <!--</el-dropdown-menu>-->
        <!--</el-dropdown> -->
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed ? 'menu-collapsed' : 'menu-expanded'">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          unique-opened
          router
          v-show="!collapsed"
        >
          <!--返回按钮-->
          <template v-if="$store.state.child.length">
            <el-menu-item index="" @click="backRoute" align="center">
              <span slot="title">返回</span>
            </el-menu-item>
          </template>
          <!--一级标题-->
          <template
            v-for="(item, index) in $router.options.routes"
            v-if="!item.hidden && !item.back"
          >
            <el-menu-item
              :index="item.children[0].path"
              :key="item.children[0].path"
              v-if="item.children && !$store.state.child.length"
              align="center"
              @click="clickOne(item, $router.options.routes)"
            >
              {{ item.children[0].meta.title }}
            </el-menu-item>
          </template>
          <!-- {{$store.state.child}} -->
          <!--二级标题-->
          <template
            v-for="(item, index) in $store.state.child"
            v-if="$store.state.child.length"
          >
            <el-menu-item
              @click="clickTWOS()"
              :index="item.path"
              :key="item.path"
              v-if="!item.hidden && item.name != '首页配置'"
              align="center"
            >
              {{ item.name }}
            </el-menu-item>
            <el-menu-item
              @click="clickTWOS()"
              :index="item.path"
              :key="item.path"
              v-if="item.name == '首页配置' && (parkid || $route.query.id) == 3"
              align="center"
            >
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单-->
        <!-- 改版后 -->
        <!-- <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          router
          v-show="!collapsed"
        > -->
        <!-- {{ showList }} -->
        <!-- <template v-for="(item, index) in showList" v-if="!item.hidden"> -->
        <!--有折叠-->
        <!-- <el-submenu :index="index + ''" v-if="!item.leaf"> -->
        <!-- <template slot="title"> -->
        <!--<i :class="item.iconCls"></i>-->
        <!-- {{ item.name }}</template -->
        <!-- > -->
        <!-- <el-menu-item -->
        <!-- v-for="child in item.children" -->
        <!-- :index="child.path" -->
        <!-- :key="child.path" -->
        <!-- v-if="!child.hidden" -->
        <!-- > -->
        <!-- {{ child.name }} -->
        <!-- </el-menu-item> -->
        <!-- </el-submenu> -->
        <!--无折叠-->
        <!-- <el-menu-item -->
        <!-- v-if="item.leaf && item.children.length > 0" -->
        <!-- :index="item.children[0].path" -->
        <!-- > -->
        <!-- {{ item.children[0].name }} -->
        <!-- </el-menu-item> -->
        <!-- </template> -->
        <!-- </el-menu> -->
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <h2 class="title">{{ $route.name }}</h2>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      sysName: "文旅平台管理系统",
      collapsed: false,
      sysUserName: "",
      showList: [],
      child: [],
      parkid: sessionStorage.getItem("parkid"),
    };
  },
  created() {},
  mounted() {},
  methods: {
    clickTWOS() {
      this.parkid = sessionStorage.getItem("parkid");
      //console.log(this.parkid);
    },
    clickOne(item) {
      if (item.unfold) {
        this.$store.state.child = item.children;
      }
      //  this.parkid = sessionStorage.getItem("parkid");
      //     console.log(this.parkid);
    },
    backRoute() {
      if (this.$store.state.child.length) {
        this.$store.state.child = [];
      }
      this.$route.meta.parent
        ? this.$router.replace({ path: this.$route.meta.parent })
        : history.back();
      if (this.$route.query.id == 3) {
        sessionStorage.removeItem("parkid");
      }
    },
    handleopen() {},
    handleclose() {},
    handleselect: function (a, b) {},
    //退出登录
    logout: function () {
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.loginOut({}, (res) => {
            this.$message({
              type: "success",
              message: "退出成功!",
            });
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("permissions");
            this.$router.push("/login");
          });
        })
        .catch(() => {});
    },
    //折叠导航栏
    collapse: function () {
      this.collapsed = !this.collapsed;
    },
  },
  mounted() {
    //权限设置
    let showItem = this.$router.options.routes.filter((n) => !n.hidden);
    let roleItem = JSON.parse(sessionStorage.getItem("permissions"));
    //console.log("showItem", showItem);
    //console.log("roleItem", roleItem);
    // let showList = showItem.filter((n) => {
    //   n.children = n.children.filter((m) => {
    //     console.log("m", m);
    //     if (~m.path.indexOf("index")) return true; //第一条首页的特例
    //     return !!roleItem.filter((j) => {
    //       if (m.code == j.code) return true;
    //     }).length;
    //   });
    //   console.log("n.children.length", n.children.length);
    //   return n.children.length;
    // });
    //this.showList = showList;
    // console.log("showList", showList);
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      this.sysUserName = user.name || "admin";
    }
    this.parkid = sessionStorage.getItem("parkid");
  },
};
</script>

<style scoped lang="scss">
@import "~scss_vars";

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: #000;
    box-shadow: 0 1px 4px #d4d4d4, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #000;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      //width:230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      // border-color: rgba(238, 241, 146, 0.3);
      // border-right-width: 1px;
      // border-right-style: solid;
      img {
        width: 50px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: #fff;
      }
    }
    .logo-width {
      // width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    // background: #324057;
    position: absolute;
    top: 62px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      // position: absolute;
      // top: 0px;
      // bottom: 0px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      // background: #f1f2f7;
      flex: 1;
      // position: absolute;
      // right: 0px;
      // top: 0px;
      // bottom: 0px;
      // left: 230px;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        //margin-bottom: 15px;
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
}
</style>
