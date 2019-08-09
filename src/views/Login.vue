<template>
    <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">光团文旅平台后台管理系统登录</h3>
        <el-form-item prop="phone_num">
            <el-input type="text" v-model="loginForm.phone_num" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="user_password">
            <el-input type="password" v-model="loginForm.user_password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        data() {
            var pass = (rule, val, callback) => {
                if (val == '') {
                    callback(new Error('请输入密码'));
                } else if (val.length < 6) {
                    callback(new Error('密码长度应大于6位'));
                } else {
                    callback();
                }
            }
            return {
                logining: false,
                loginForm: {
                    phone_num: '',
                    user_password: ''
                },
                rules2: {
                    phone_num: [
                        {required: true, message: '请输入账号', trigger: 'change'},
                        //{ validator: validaePass }
                    ],
                    user_password: [{validator: pass, trigger: 'change'}]
                },
                checked: true
            };
        },
        created() {
            window.globalVue = this;
        },
        methods: {
            handleSubmit(ev) {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        this.$ajax.login({
                            "account": this.loginForm.phone_num,
                            "password": this.loginForm.user_password
                        }, res => {
                            this.logining = false;
                            console.log(res)
                            if (res.data.isenable * 1) {
                                var storage = {
                                    uKey: res.data.ukey,
                                    uid: res.data.uid,
                                    name: res.data.account
                                }
                                sessionStorage.setItem('user', JSON.stringify(storage))
                                this.$router.push({path: '/'});
                            } else {
                                this.$message.error('账号禁用')
                            }
                        }, err => {
                            this.logining = false;
                        })
                    } else {
                        this.$message.error('请输入完整');
                        return false;
                    }
                    //         var loginParams = {
                    //             phone_num: this.loginForm.phone_num,
                    //             user_password: this.loginForm.user_password
                    //         };
                    //         console.log(loginParams)
                    //         this.$ajax.requestLogin(loginParams, data => {
                    //             this.logining = false;
                    //             console.log(data.data.uKey)
                    //             sessionStorage.setItem('user', data.data.uKey);
                    //             this.$router.push({path: '/'});
                    //         })
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>
