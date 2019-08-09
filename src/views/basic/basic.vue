<template>
    <div>
        <!--服务器状态-->
        <el-card class="box-card" style="width: 300px">
            <div slot="header" class="clearfix">
                <span>服务器状态</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="item">
                {{status.status*1 ? '正常' : '维护中'}}
                <el-button style="float: right; padding: 3px 0" type="text" @click="changeClick">更改</el-button>
                <!--<el-button class="changeState">更改</el-button>-->
            </div>
        </el-card>
        <!--服务器状态修改-->
        <el-dialog
            title="服务器状态"
            :visible.sync="status.show"
            width="30%">
            <el-radio-group v-model="status.changeStatus">
                <el-radio label="1">正常</el-radio>
                <el-radio label="0">维护中</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="status.show = false">取 消</el-button>
                <el-button type="primary" @click="changeStatus">确 定</el-button>
              </span>
        </el-dialog>

        <!--版本管理-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>版本管理</span>
                <el-button style="float: right; padding: 5px 10px" @click="newAppClick">发布新版本</el-button>
            </div>
            <el-row>
                <el-col :span="12" class="title">Android</el-col>
                <el-col :span="12" class="title">IOS</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">版本名：{{Android.versionName}}</el-col>
                <el-col :span="12">版本名：{{IOS.versionName}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">版本号：{{Android.versionCode}}</el-col>
                <el-col :span="12">版本号：{{IOS.versionCode}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">最低版本号：{{Android.minVersion}}</el-col>
                <el-col :span="12">最低版本号：{{IOS.minVersion}}</el-col>
            </el-row>
            <el-row>
                <!--<el-col :span="12">更新说明：{{Android.content}}</el-col>-->
                <el-col :span="12" label="文档">更新说明：
                    <!--<textarea class="text" v-model="Android.content" disabled></textarea>-->
                    <el-input autosize disabled class="textarea1" type="textarea" :autosize="{ minRows: 3}"
                              v-model="Android.content"></el-input>
                </el-col>
                <el-col :span="12">更新说明：
                    <!--<textarea class="text" v-model="IOS.content" disabled></textarea>-->
                    <el-input autosize disabled class="textarea1" type="textarea" :autosize="{ minRows: 3}"
                              v-model="IOS.content"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">下载地址：<a :href="Android.address" target="_blank">{{Android.address}}</a></el-col>
                <el-col :span="12">下载地址：<a :href="IOS.address" target="_blank">{{IOS.address}}</a></el-col>
            </el-row>
        </el-card>
        <!--上传新版本-->
        <el-dialog title="发布新版本" :visible.sync="newApp.show" class="demo-box">
            <el-form :model="newApp" :rules="rules" ref="newApp">
                <el-form-item label="平台" label-width="120px">
                    <el-radio-group v-model="newApp.system">
                        <el-radio label="Android">Android</el-radio>
                        <el-radio label="IOS">IOS</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本名" label-width="120px" prop="versionName">
                    <el-input v-model="newApp.versionName"></el-input>
                </el-form-item>
                <el-form-item label="版本号" label-width="120px" prop="version_code">
                    <el-input v-model="newApp.version_code"></el-input>
                </el-form-item>
                <el-form-item label="最低版本号" label-width="120px" prop="min_version">
                    <el-input v-model="newApp.min_version"></el-input>
                </el-form-item>
                <el-form-item label="更新说明" label-width="120px" prop="content">
                    <el-input autosize type="textarea" :autosize="{ minRows: 3}" v-model="newApp.content"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" label-width="120px" prop="address">
                    <el-input v-model="newApp.address"></el-input>
                    <!--<el-button style="margin-left: 50px">上传</el-button>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newApp.show = false">取 消</el-button>
                <el-button type="primary" @click="upDateNewApp('newApp')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "basic",
        data() {
            return {
                status: {//服务器状态
                    show: false,
                    status: '1',
                    changeStatus: '1'
                },
                Android: [],
                IOS: [],
                newApp: {
                    show: false,
                    system: 'Android',
                    versionName: '',
                    version_code: '',
                    min_version: '',
                    content: '',
                    address: '',
                },
                rules: {
                    versionName: [{required: true, message: '请输入版本名', trigger: 'change'}],
                    version_code: [{required: true, message: '请输入版本号', trigger: 'change'}],
                    min_version: [{required: true, message: '请输入最低版本号', trigger: 'change'}],
                    content: [{required: true, message: '请输入更新说明', trigger: 'change'}],
                    address: [{required: true, message: '请输入下载地址', trigger: 'change'}],
                },
            }
        },
        mounted() {
            window.vm = this;
            //服务器状态
            this.getServerStatus();
            //版本管理
            this.getAppVersion();
        },
        methods: {
            //获取服务器状态
            getServerStatus() {
                this.$ajax.getServerStatus({}, res => {
                    this.status.status = res.data.status
                    this.status.changeStatus = res.data.status
                })
            },
            //获取版本信息
            getAppVersion() {
                this.$ajax.getAppVersion({}, res => {
                    this.Android = res.data.filter(n => {
                        if (n.system == 'Android') return true;
                    })[0]
                    this.IOS = res.data.filter(n => {
                        if (n.system == 'iOS') return true;
                    })[0]
                })
            },
            changeClick(){
                this.status.show = true;
                this.status.changeStatus = this.status.status;
            },
            newAppClick (){
                this.newApp.show = true;
                if(this.$refs['newApp']) this.$refs['newApp'].resetFields();
            },
            //修改状态
            changeStatus() {
                if (this.status.changeStatus != this.status.status) {
                    this.$ajax.updateServerStatus({
                        status: this.status.changeStatus
                    }, res => {
                        this.$message.success('修改成功');
                        this.getServerStatus();
                        this.status.show = false;
                    })
                }
            },
            //上传新版本
            upDateNewApp(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$ajax.addAppUpdate(this.newApp, res => {
                            this.$message.success('添加成功');
                            this.newApp.show = false;
                            this.getAppVersion();
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    $w: 250px;

    .box-card {
        width: 500px;
        margin-top: 30px;
    }

    .el-input {
        width: $w;
    }

    .el-row {
        margin-bottom: 0px; /*去除el-row之间的间距*/
        border: 1px solid #e6e6e6;
        margin: -1px -1px -1px -1px; /*解决相邻边框重叠问题就靠这行代码*/
        text-align: center;
        .el-col {
            text-align: left;
            line-height: 35px;
            padding-left: 5px;
            &:nth-child(1) {
                border-right: 1px solid #e6e6e6;
            }
            .textarea1 {
                width: 140px;
                vertical-align: top;
                border: 0;
                padding: 5px 5px 12px;
                font-size: inherit;
                color: #606266;

            }
            .textarea1 > > > .el-textarea__inner {
                color: #606266;
                background: red;
            }
        }
        .title {
            text-align: center;
        }
    }

    .el-textarea {
        width: $w;
        textarea {
            height: 100px;
        }
    }
</style>
