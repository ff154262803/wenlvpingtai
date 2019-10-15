<template>
    <div class="classificationPage">
        <el-input placeholder="请输入内容" v-model="query.condition" clearable style="width: 300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="addBtn">添加</el-button>
        <div class="filter">
            <strong>分类：</strong>
			<span @click="changetype('')" :class='query.groupId==""?"active":""'>不限</span>
			<span v-for="(item, index) in list" :key="index" :class='query.groupId==item.toString()?"active":""' @click="changetype(item)">{{index}}</span>
        </div>
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
                prop="typeName"
                label="分类名"
                width="200">
            </el-table-column>
            <el-table-column
                label="类型">
                <template slot-scope="scope">{{ typenamaedata[scope.row.groupId] }}</template>
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
                    <!-- <el-button type="text" size="small" @click="UpDown(scope.row.id)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="enableState(1)">启用</el-button>
                <el-button size="small" @click="enableState(0)">禁用</el-button>
            </div>
            <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
                           :page-size="query.count" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>

        <!--弹窗内容-->
        <el-dialog title="添加分类" :visible.sync="addBol">
            <el-form :model="addData" :rules="rules" ref="addData" >
                <el-form-item label="分类名" label-width="120px">
                    <el-input v-model="addData.typeName" style="width: 200px" prop="typeName"></el-input>
                </el-form-item>
                <el-form-item label="分类" label-width="120px">
                    <el-select v-model="addData.groupId" placeholder="请选择分类" prop="groupId">
                        <el-option :label='index' :value="item" v-for="(item, index) in list" :key="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBol = false">取 消</el-button>
                <el-button type="primary" @click="submit('addData')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "user",
        data() {
            return {
                list:[],
                total: 0,
                addBol: false,
                typenamaedata:{},
                query: {
                    page: 1,
                    count: 20,
                    condition:'',
                    groupId:""
                },
                rules: {
                    typeName: [{required: true, message: '请输入分类名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                    groupId: [{required: true, message: '请选择类型', trigger: 'change'}]
                },
                addData: {},
                tableData: [],
                multipleSelection: []
            }
        },
        mounted(){
            this.getAccessToken()
            this.gettype()
        },
        methods: {
            edit(data){
                this.addBol = true
                this.addData = data
            },
            gettype(){
                this.$ajax.getGroupList({}, res => {
                    this.list = res.data
                    for(var key in res.data){
                        this.typenamaedata[res.data[key]] = key
                    }
                })
            },
            getAccessToken(){
                this.$ajax.queryTypeList(this.query, res => {
                    this.tableData = res.data
                    this.total = res.total
                    if(res.totalPage<this.query.page){//过滤时页数bug
                        this.query.page=1
                        this.getAccessToken()
                    }
                })
            },
            changetype(val){
                this.query.groupId = val.toString()
                this.getAccessToken()
            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.addData.id){
                            this.$ajax.updateType({id:this.addData.id,parameters:{typeName:this.addData.typeName,groupId:this.addData.groupId,}}, res => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.addBol= false
                                this.getAccessToken()
                            })
                        }else{
                            this.$ajax.addType(this.addData, res => {
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
                this.addData={}
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
                    this.$ajax.setTypeEnableState({idlst:idlst,isenable:val}, res => {
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                        this.getAccessToken()
                    })
                }
            },
            UpDown(id) {
                this.$ajax.checkDeleteType({id:id}, res => {
                    if(res.resb=200){
                        this.$confirm('您确定要删除该类型吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$ajax.deleteType({id:id}, res => {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getAccessToken()
                            })
                        }).catch(() => {});
                    }
                    
                }, err => {
                    if(err.resb=996){
                        this.$confirm('该类型已被使用您确定要删除该类型吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$ajax.deleteType({id:id}, res => {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getAccessToken()
                            })
                        }).catch(() => {});
                    }
                    
                })
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
        .addBtn {
            margin-left: 80px;
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
