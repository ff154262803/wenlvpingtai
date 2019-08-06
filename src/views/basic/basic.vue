<template>
    <div>
        <!--服务器状态-->
        <el-card class="box-card" style="width: 300px">
            <div slot="header" class="clearfix">
                <span>服务器状态</span>
                <!--<el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>-->
            </div>
            <div class="text item">
                {{state}}
                <el-button style="float: right; padding: 3px 0" type="text" @click="dialogVisible = true">更改</el-button>
                <!--<el-button class="changeState">更改</el-button>-->
            </div>
        </el-card>
        <!--服务器状态修改-->
        <el-dialog
            title="服务器状态"
            :visible.sync="dialogVisible"
            width="30%">
            <el-radio-group v-model="resource">
                <el-radio label="正常"></el-radio>
                <el-radio label="维护中"></el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogTrue">确 定</el-button>
              </span>
        </el-dialog>

        <!--版本管理-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>版本管理</span>
                <el-button style="float: right; padding: 5px 10px" @click="newApp.show=true">发布新版本</el-button>
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
                <el-col :span="12">更新说明：{{Android.content}}</el-col>
                <el-col :span="12">更新说明：{{IOS.content}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">下载地址：<a :href="Android.address" target="_blank">{{Android.address}}</a></el-col>
                <el-col :span="12">下载地址：<a :href="IOS.address" target="_blank">{{IOS.address}}</a></el-col>
            </el-row>
        </el-card>
        <!--上传新版本-->
        <el-dialog title="发布新版本" :visible="newApp.show" class="demo-box">
            <el-form :model="newApp">
                <el-form-item label="平台" label-width="120px">
                    <el-radio-group v-model="newApp.system">
                        <el-radio label="Android">Android</el-radio>
                        <el-radio label="IOS">IOS</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本名" label-width="120px">
                    <el-input v-model="newApp.name"></el-input>
                </el-form-item>
                <el-form-item label="版本号" label-width="120px">
                    <el-input v-model="newApp.name2"></el-input>
                </el-form-item>
                <el-form-item label="最低版本号" label-width="120px">
                    <el-input v-model="newApp.min_version"></el-input>
                </el-form-item>
                <el-form-item label="更新说明" label-width="120px">
                    <el-input autosize type="textarea" :autosize="{ minRows: 3}" v-model="newApp.content"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" label-width="120px">
                    <el-input v-model="newApp.address"></el-input>
                    <!--<el-button style="margin-left: 50px">上传</el-button>-->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newApp.show = false">取 消</el-button>
                <el-button type="primary" @click="dialogNewTrue">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "basic",
        data() {
            return {
                state: '关闭',
                dialogVisible: false,//服务器状态
                Android: [],
                IOS: [],
                resource: '正常',
                newApp: {
                    show:true,
                    system: 'Android',
                    name: '',
                    name2: '',
                    min_version: '',
                    content: '',
                    address: '',
                },
            }
        },
        mounted() {
            window.vm = this;
            this.getAppVersion();
        },
        methods: {
            getAppVersion() {
                this.$ajax.getAppVersion({}, res => {
                    console.log(res);
                    this.Android = res.filter(n => {
                        if (n.system == 'Android') return true;
                    })[0]
                    this.IOS = res.filter(n => {
                        if (n.system == 'iOS') return true;
                    })[0]
                })
            },
            //修改状态
            dialogTrue() {
                console.log(this.resource);
                this.dialogVisible = false
            },
            //上传新版本
            dialogNewTrue() {
                console.log(this.newApp);
                this.newApp.show = false;
            },
        },
        watch: {
            state(to) {
                console.log(to);
                this.state = to ? '开启' : '关闭'
            }
        }
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
            &:nth-last-child(1) {
                border-left: 1px solid #e6e6e6;
            }
        }
        .title{
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
