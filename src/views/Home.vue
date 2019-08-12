<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="20" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                <img src="../../static/img/zksw.png" alt="">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">
                        <!-- <img src="../../static/img/user.png" alt=""> -->
                        {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen"
                         @close="handleclose" @select="handleselect"
                         unique-opened router v-show="!collapsed">
                    <!--返回按钮-->
                    <template v-if="$store.state.child.length">
                        <el-menu-item index="" @click="backRoute" align="center">
                            <span slot="title">返回</span>
                        </el-menu-item>
                    </template>
                    <!--一级标题-->
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden&&!item.back">
                        <el-menu-item :index="item.children[0].path"
                                      :key="item.children[0].path"
                                      v-if="item.children && !($store.state.child.length)"
                                      align="center"
                                      @click="clickOne(item,$router.options.routes)"
                        >
                            {{item.children[0].name}}
                        </el-menu-item>
                    </template>
                    <!--二级标题-->
                    <template v-for="(item,index) in $store.state.child" v-if="$store.state.child.length">
                        <el-menu-item :index="item.path"
                                      :key="item.path"
                                      v-if="!item.hidden"
                                      align="center"
                        >
                            {{item.name}}
                        </el-menu-item>
                    </template>
                </el-menu>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <h2 class="title">{{$route.name}}</h2>
                        <!--<el-breadcrumb separator="/" class="breadcrumb-inner">-->
                        <!--<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">-->
                        <!--{{ item.name }}-->
                        <!--</el-breadcrumb-item>-->
                        <!--</el-breadcrumb>-->
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
                sysName: '文旅平台管理系统',
                collapsed: false,
                sysUserName: '',
                child: []
            }
        },
        created() {
        },
        methods: {
            clickOne(item) {
                if (item.unfold) {
                    this.$store.state.child = item.children
                }
            },
            backRoute() {
                if(this.$store.state.child.length){
                    this.$store.state.child = [];
                }
                this.$router.replace({path:this.$route.meta.parent || '/'})

            },
            handleopen() {
            },
            handleclose() {
            },
            handleselect: function (a, b) {
            },
            //退出登录
            logout: function () {
                this.$confirm('确认退出吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$ajax.loginOut({}, res => {
						this.$message({
							type: 'success',
							message: '退出成功!'
						});
                        sessionStorage.removeItem('user');
                        this.$router.push('/login');
					})
				}).catch(() => {});
            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                this.sysUserName = user.name || 'admin';
            }

        }
    }

</script>

<style scoped lang="scss">
    @import '~scss_vars';

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
            box-shadow: 0 1px 4px #d4d4d4,0 0 0 #fff, 0 0 0 #fff,0 0 0 #fff;
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
                width: 60px
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
