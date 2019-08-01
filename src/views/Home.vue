<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner">{{sysUserName}}</span>
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
                        <el-menu-item  @click="backRoute" align="center">
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
    // import axios from 'axios'
    import {logoutLogin} from '../api/api';
    import {init, initArr, initSet} from '../routes'

    export default {
        data() {
            return {
                sysName: '文旅平台管理系统',
                collapsed: false,
                sysUserName: '',
                sysUserAvatar: '',
                child: [],
                children:[],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },

            }
        },
        created() {
            window.v = this;
        },
        methods: {
            clickOne(item) {
                // console.error(item);
                if (item.unfold) {
                    this.$store.state.child = item.children
                }
            },
            backRoute() {
                console.log(this.$route.meta);
                if(this.$store.state.child.length){
                    this.$store.state.child = [];
                    if(this.$route.meta.parent){
                        console.error(this.$route.meta.parent,this.$router.options.routes)
                        var to = this.$router.options.routes.filter(n=>{
                            if(n.name == this.$route.meta.parent) return true;
                        });
                        console.log(to[0].children);
                        this.$store.state.child = to[0].children
                    }
                }
                this.$router.replace({path:this.$route.meta.parent || '/pay'})

            },
            onSubmit() {
                console.log('submit!');
            },
            handleopen() {
            },
            handleclose() {
            },
            handleselect: function (a, b) {
                // if (~a.indexOf('basicPage')) {
                //     init(initSet);
                // }
            },
            //退出登录
            logout: function () {
                var _this = this,
                  obj = {uKey: sessionStorage.getItem('user')}
                this.$confirm('确认退出吗?', '提示', {
                    //type: 'warning'
                }).then(() => {
                    logoutLogin(obj).then(data => {
                        console.log(data)
                        sessionStorage.removeItem('user');
                        _this.$router.push('/login');
                    })

                }).catch(() => {

                });
            },
            //折叠导航栏
            collapse: function () {
                this.collapsed = !this.collapsed;
            },
            showMenu(i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
            }
        },
        mounted() {
            var user = sessionStorage.getItem('user');
            if (user) {
                this.sysUserName = user.name || 'admin';
                this.sysUserAvatar = user.avatar || '';
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
            color: #fff;
            .userinfo {
                text-align: right;
                padding-right: 35px;
                float: right;
                .userinfo-inner {
                    cursor: pointer;
                    color: #fff;
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
                border-color: rgba(238, 241, 146, 0.3);
                border-right-width: 1px;
                border-right-style: solid;
                img {
                    width: 40px;
                    float: left;
                    margin: 10px 10px 10px 18px;
                }
                .txt {
                    color: #fff;
                }
            }
            .logo-width {
                width: 230px;
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
            top: 60px;
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
