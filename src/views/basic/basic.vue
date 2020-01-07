<template>
    <div>
        <!--服务器状态-->
        <el-card class="box-card" style="width: 300px">
            <div slot="header" class="clearfix">
                <span>服务器状态</span>
            </div>
            <div class="item">
                {{status.status*1 ? '正常' : '维护中'}}
                <el-button style="float: right; padding: 3px 0" type="text" @click="changeClick">更改</el-button>
            </div>
        </el-card>
        <!--服务器状态-->
        <!--        <el-card class="box-card" style="width: 300px">-->
        <!--            <div slot="header" class="clearfix">-->
        <!--                <span>支付方式</span>-->
        <!--            </div>-->
        <!--            <div class="item">-->
        <!--                <el-checkbox label="微信" v-model="paytype.wechat" @change="pattypechange"></el-checkbox>-->
        <!--                <el-checkbox label="支付宝" v-model="paytype.alipay" @change="pattypechange"></el-checkbox>-->
        <!--                <el-checkbox label="银联" v-model="paytype.visal" @change="pattypechange"></el-checkbox>-->
        <!--            </div>-->
        <!--        </el-card>-->
        <!--服务器状态修改-->
        <el-dialog
            title="服务器状态"
            :close-on-click-modal=false
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
                <el-col :span="12" label="文档">更新说明：
                    <el-input autosize disabled class="textarea1" type="textarea" :autosize="{ minRows: 3}"
                              v-model="Android.content"></el-input>
                </el-col>
                <el-col :span="12">更新说明：
                    <el-input autosize disabled class="textarea1" type="textarea" :autosize="{ minRows: 3}"
                              v-model="IOS.content"></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">下载地址：<a :href="Android.address" target="_blank" class="href">{{Android.address}}</a>
                </el-col>
                <el-col :span="12">下载地址：<a :href="IOS.address" target="_blank" class="href">{{IOS.address}}</a></el-col>
            </el-row>
        </el-card>
        <!--上传新版本-->
        <el-dialog title="发布新版本" :visible.sync="newApp.show" class="demo-box" :close-on-click-modal=false>
            <el-form :model="newApp" :rules="rules" ref="newApp">
                <el-form-item label="平台" label-width="120px">
                    <el-radio-group v-model="newApp.system">
                        <el-radio label="Android">Android</el-radio>
                        <el-radio label="iOS">iOS</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本名" label-width="120px" prop="versionName">
                    <el-input v-model="newApp.versionName" placeholder="请输入版本名"></el-input>
                </el-form-item>
                <el-form-item label="版本号" label-width="120px" prop="version_code">
                    <el-input v-model="newApp.version_code" placeholder="请输入版本号"></el-input>
                </el-form-item>
                <el-form-item label="最低版本号" label-width="120px" prop="min_version">
                    <el-input v-model="newApp.min_version" placeholder="请输入最低版本号"></el-input>
                </el-form-item>
                <el-form-item label="更新说明" label-width="120px" prop="content">
                    <el-input autosize type="textarea" :autosize="{ minRows: 3}" placeholder="请输入更新说明"
                              v-model="newApp.content"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" label-width="120px" prop="address">
                    <el-input v-model="newApp.address" placeholder="请输入下载地址" style="display:none"></el-input>
                    <el-upload
                        class="upload-demo"
                        :action="$store.state.ip+'/resources/uploadResource'"
                        :data="uploaddata"
                        accept="application/vnd.android.package-archive"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        :before-upload="beforeUpload"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
                    </el-upload>
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
            let rules = {
                num(rule, val, callback) {
                    val === '' ?
                      callback(new Error('请输入数字')):
                      val.includes('.') ?
                        callback(new Error('请输入整数')) :
                        callback();
                }
            }
            return {
                uploaddata: {
                    type: '',
                    uKey: JSON.parse(sessionStorage.getItem('user')).uKey
                },
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
                // paytype:{},
                rules: {
                    versionName: [{required: true, message: '请输入版本名', trigger: 'blur'}, {
                        max: 20,
                        message: '最多20个字符',
                        trigger: 'blur'
                    }],
                    version_code: [{required: true, trigger: 'blur', validator: rules.num}],
                    min_version: [{required: true, trigger: 'blur', validator: rules.num}],
                    content: [{required: true, message: '请输入更新说明', trigger: 'blur'}, {
                        max: 100,
                        message: '最多100个字符',
                        trigger: 'blur'
                    }],
                    address: [{required: true, message: '请上传安装包', trigger: 'blur'}, {
                        max: 100,
                        message: '最多100个字符',
                        trigger: 'blur'
                    }],
                },
            }
        },
        mounted() {
            //服务器状态
            this.getServerStatus();
            //版本管理
            this.getAppVersion();
            //服务器状态
            // this.getPaytype();
        },
        methods: {
            // pattypechange(){
            //     var str = ''
            //     this.paytype.wechat?str+='1':str+='0'
            //     this.paytype.alipay?str+='1':str+='0'
            //     this.paytype.visal?str+='1':str+='0'
            //     this.$ajax.setPayType({data:str}, res => {
            //         this.$message.success('修改成功');
            //     })
            // },
            // getPaytype(){
            //     this.$ajax.getPayType({}, res => {
            //         this.paytype.wechat = res.data[0]=='1'?true:false
            //         this.paytype.alipay = res.data[1]=='1'?true:false
            //         this.paytype.visal = res.data[2]=='1'?true:false
            //     })
            // },
            //上传成功
            handleSuccess(file, fileList) {
                this.newApp.address = file.shortUrl;
                this.$message.success('上传成功');
            },
            //上传失败
            handleError() {
                this.$message.error('上传失败');
            },
            //上传之前的格式检验
            beforeUpload(file) {
                this.newApp.size = file.size
                const isLt50M = file.size / 1024 / 1024 < 300;
                const accept = file.type == 'application/vnd.android.package-archive'
                if (!accept) {
                    this.$message.error('上传文件只能是apk格式!');
                }
                if (!isLt50M) {
                    this.$message.error('上传文件大小不能超过 300MB!');
                }
                return accept && isLt50M;
            },
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
            changeClick() {
                this.status.show = true;
                this.status.changeStatus = this.status.status;
            },
            //添加app按钮点击
            newAppClick() {
                this.newApp.show = true;
                if (this.$refs.newApp) this.$refs.newApp.resetFields();
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
        word-break: break-all;
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
