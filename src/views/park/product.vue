<template>
    <div class="classificationPage">
        <el-button class="addBtn" type="primary" @click="addBtn">添加</el-button>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="caption"
                label="商品名"
                width="200">
            </el-table-column>
            <el-table-column
                label="类型"
                width="200">
                <template slot-scope="scope">{{ type[scope.row.type] }}</template>
            </el-table-column>
            <el-table-column
                prop="siteName"
                label="店家名"
                width="200">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">{{ scope.row.isenable==0?'禁用':'启用' }}</template>
            </el-table-column>
             <el-table-column
                prop="createtime"
                label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="UpDown(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="enableState(1)">启用</el-button>
                <el-button size="small" @click="enableState(0)">禁用</el-button>
            </div>
            <el-pagination background
				layout="total,sizes, prev, pager, next, jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10, 15, 20, 30, 50]"
				:current-page.sync="query.page"
				:page-size="query.count" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>

        <!--弹窗内容-->
        <el-dialog :title="addData.id?'修改商品':'添加商品'" :visible.sync="addBol" :close-on-click-modal = false>
            <el-form :model="addData" :rules="rules" ref="addData" >
                <el-form-item label="商品名" label-width="120px" prop="caption">
                    <el-input v-model="addData.caption" style="width: 200px"></el-input>
                </el-form-item>
                 <el-form-item label="商品描述" label-width="120px"  prop="remark">
                    <el-input v-model="addData.remark" style="width: 200px"></el-input>
                </el-form-item>
                 <el-form-item label="商品价格" label-width="120px"  prop="price">
                    <el-input v-model="addData.price" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" label-width="120px"  prop="type" >
                    <el-select v-model="addData.type" placeholder="请选择分类" @change = "typechange">
                        <el-option v-for="item in list" :label="item.typeName" :value="item.id" :key="item.id" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商家名称" label-width="120px"  prop="siteid">
                    <el-select v-model="addData.siteid" placeholder="请选择商家名称">
                        <el-option v-for="item in product" :label="item.caption" :value="item.id" :key="item.id" v-show="item.type == addData.type" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品图片" label-width="120px" prop="picurl">
                    <el-input v-model="addData.picurl" style="width: 200px;display:none"></el-input>
                    <el-button size="small" type="primary" @click="uploading('uppic')">点击上传</el-button>
                    <el-upload class="upload-demo" style="display:none"
                        :data="uploaddata"
                        accept="image/jpeg,image/jpg,image/png"
				        :action="$store.state.ip+'/resources/uploadResource'"
                        :on-progress="handleLoading"
                        :on-success='onsuccsesspic'
                        :before-upload="beforeUploadpic"
                        :on-error='onerror'
				        list-type="picture">
                        <el-button size="small" type="primary" id="uppic">点击上传</el-button>
                    </el-upload>
                    <div style="margin-top:20px">
                        <img :src="$store.state.resip+addData.picurl" alt="" class="pic" v-if="addData.picurl" style="width:80px" ref="pic">
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reset('addData')">取 消</el-button>
                <el-button type="primary" @click="submit('addData')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "user",
        data() {
            var checkPrice = (rule, value, callback) => {
                if (!/^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/.test(value)||value>1000) {
                    callback(new Error('请输入最大1000且最多两位小数的数字'));
                }else{
                    callback();
                }
            };
            return {
                uploaddata:{
                    type:'',
                    uKey:JSON.parse(sessionStorage.getItem('user')).uKey
                },
                list:[],
                type:{},
                product:[],
                total: 0,
                addBol: false,
                query: {
                    parkid:sessionStorage.getItem('parkid'),
                    page: 1,
                    count: 10
                },
                rules: {
                    caption: [{required: true, message: '请输入名称', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                    remark: [{required: true, message: '请输入备注', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                    siteid: [{required: true, message: '请选择商家名称', trigger: 'change'}],
                    price: [{ validator: checkPrice, trigger: 'blur' }],
                    picurl: [{required: true, message: '请上传图片'}]
                },
                addData: {},
                tableData: [],
                multipleSelection: []
            }
        },
        mounted(){
            this.getAccessToken()
            this.gettype()
            this.getsitelist()
        },
        methods: {
            handleSizeChange(val) {
                this.query.count = val;
                this.getAccessToken();
            },
            typechange(){
                this.addData.siteid = ''
            },
            reset(formName){
                this.$refs[formName].resetFields();
                this.addBol = false
            },
             uploading(id){
                document.getElementById(id).click()
            },
            handleLoading(){
                this.fullscreenLoading = true;
            },
            beforeUploadpic(file){
                const isLt5M = file.size / 1024 / 1024 < 5;
                const accept =  (file.type.indexOf('jpeg')>-1||file.type.indexOf('png')>-1||file.type.indexOf('jpg')>-1)
                if (!accept){
                    this.$message.error('上传文件只能是图片格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传文件大小不能超过 5MB!');
                }
                return accept && isLt5M;
            },
            onsuccsesspic(response, file, fileList){
                if(response.resb==200){
                    this.$set(this.addData, 'picurl',response.shortUrl);
                    this.fullscreenLoading = false;
                }
            },
            onerror(){
                this.fullscreenLoading = false;
            },
            getsitelist(){
                this.$ajax.querySiteList({
                    parkid:sessionStorage.getItem('parkid'),
                    page:1,
                    count:999,
                    typelist:[],
                }, res => {
                    this.product = res.data
                })
            },
            edit(data){
                this.addBol = true
                this.addData = data
            },
            gettype(){
                this.$ajax.getSiteTypeList({}, res => {
                    this.list = res.data
                    for(let i=0;i<res.data.length;i++){
                        this.type[res.data[i].id]=res.data[i].typeName
                    }
                })
            },
            getAccessToken(){
                this.$ajax.queryCommodityList(this.query, res => {
                    this.tableData = res.data
                    this.total = res.total
                })
            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.addData.id){
                            this.$ajax.updateCommodity({id:this.addData.id,parameters:{caption:this.addData.caption,price:this.addData.price,remark:this.addData.remark,siteid:this.addData.siteid,picurl:this.addData.picurl}}, res => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.addBol= false
                                this.getAccessToken()
                            })
                        }else{
                            this.$ajax.addCommodity(this.addData, res => {
                                this.$message({
                                    type: 'success',
                                    message: '提交成功!'
                                });
                                this.addBol= false
                                this.getAccessToken()
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            search() {
                this.getAccessToken()
            },
            addBtn() {
                this.addBol= true
                this.addData= {
                    siteid:''
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            enableState(val){
                if(this.multipleSelection.length==0){
                    this.$message({
                        type: 'warning',
                        message: '尚未选择任何内容!'
                    });
                }else{
                    let idlst=[]
                    for(let i = 0;i<this.multipleSelection.length;i++){
                        idlst.push(this.multipleSelection[i].id)
                    }
                    this.$ajax.setCommodityEnableState({idlst:idlst,isenable:val}, res => {
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                        this.getAccessToken()
                    })
                }
            },
            UpDown(id) {
                this.$confirm('您确定要删除该类型吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.deleteCommodity({idlst:[id]}, res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getAccessToken()
                    })
                }).catch(() => {})
            },
            handleCurrentChange(val) { // 切换元页
                this.query.page = val.toString()
                this.resLoading = true
                this.getAccessToken()
            }
        }
    }
</script>

<style scoped lang="scss">
    .classificationPage {
        .btn {
            margin-left: 20px;
        }
        .addBtn{
            float: right;
            margin-right: 100px;
        }
        .filter{
            line-height: 40px;
            span {
                display: inline-block;
                line-height: 30px;
                margin-left: 10px;
                background-color: rgba(64,158,255,.1);
                padding: 0 10px;
                font-size: 12px;
                color: #409EFF;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid rgba(64,158,255,.2);
                white-space: nowrap;
            }
            .active{
                background-color: #409EFF;
                color: #fff;
            }
        }
        .toolbar {
            display: flex;
            justify-content: flex-end;
            position: relative;
            .allControl {
                position: absolute;
                left: 15px;
            }
        }
    }
</style>
