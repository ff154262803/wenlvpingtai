<template>
    <div class="classificationPage">
        <el-input placeholder="请输入物品名字" v-model="query.condition" clearable style="width: 300px"
                  @clear="search"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="addBtn">添加</el-button>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column width="55" type="selection"></el-table-column>
            <el-table-column width="200" prop="caption" label="物品名"></el-table-column>
            <el-table-column width="100" prop="cash" label="押金"></el-table-column>
            <el-table-column width="100" prop="total" label="数量"></el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">{{ scope.row.isenable=='0'?'禁用':'可用' }}</template>
            </el-table-column>
            <el-table-column
                label="赔偿条款">
                <el-button type="text" size="small" slot-scope="scope" @click="checkH5(scope.row)">查看</el-button>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="isEnable(scope.row)">{{scope.row.isenable=='0'?'启用':'禁用' }}
                    </el-button>
                    <el-button type="text" size="small" @click="DetailBolChange(scope.row)">条款</el-button>
                    <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="delLease()">删除</el-button>
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
        <el-dialog title="添加分类" :visible.sync="addBol" :close-on-click-modal=false>
            <el-form :model="addData" :rules="rules" ref="addData">
                <el-form-item label="物品：" label-width="120px" prop="caption">
                    <el-input v-model="addData.caption" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="押金：" label-width="120px" prop="cash">
                    <el-input v-model.number="addData.cash" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="总数量：" label-width="120px" prop="total">
                    <el-input v-model.number="addData.total" style="width: 200px"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBol = false">取 消</el-button>
                <el-button type="primary" @click="submit('addData')">确 定</el-button>
            </div>
        </el-dialog>
        <!--条款编辑-->
        <div class="el-dialog__wrapper" v-show="DetailBol">
            <div class="el-dialog el-dialogedit">
                <div class="el-dialog__header">
                    <span class="el-dialog__title">编辑详情</span>
                    <button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="DetailBol=false"><i class="el-dialog__close el-icon el-icon-close"></i></button>
                </div>
                <div class="el-dialog__body">
                    <tinymce-editor ref="editor" v-model="h5.content" > </tinymce-editor>
                </div>
                <div class="el-dialog__footer">
                    <div class="dialog-footer">
                        <el-button @click="DetailBol=false">取 消</el-button>
                        <el-button type="primary" @click="submith5('')">确 定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import TinymceEditor from '../../../components/editor'
    export default {
        name: "leaseRes",
        components: {TinymceEditor},
        data() {
            return {
                total: 0,
                addBol: false,
                DetailBol:false,
                query: {
                    page: 1,
                    count: 10,
                    condition: '',
                    parkid: sessionStorage.getItem('parkid'),
                },
                rules: {
                    caption: [{required: true, message: '请输入物品名称', trigger: 'blur'}, {max: 20, message: '最多20个字符', trigger: 'blur'}],
                    cash: [{required: true, type: 'number', message: '请输入押金', trigger: 'blur'}],
                    total: [{required: true, type: 'number', message: '请输入总数量', trigger: 'blur'}]
                },
                addData: {},
                tableData: [],
                multipleSelection: [],
                h5:{
                    caption:'',
                    content:'',
                },
            }
        },
        mounted() {
            this.queryLeaseResList();
        },
        methods: {
            //查询
            queryLeaseResList() {
                this.$ajax.queryLeaseResList(this.query, res => {
                    this.tableData = res.data
                    this.total = res.total
                })
            },
            //分页
            handleSizeChange(val) {
                this.query.count = val;
                this.queryLeaseResList();
            },
            //修改状态
            isEnable(isEnable) {
                let enable = isEnable.isenable == '0' ? '1' : '0'
                this.$ajax.setLeaseResEnableState({idlst: [isEnable.id], isenable: enable}, (res) => {
                    this.queryLeaseResList();
                })
            },
            edit(data) {
                this.addBol = true;
                this.addData = data;
            },
            //提交
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addData.id) {
                            !this.addData.h5id && delete this.addData.h5id;
                            this.updateLeaseRes();
                        } else {
                            this.addData.parkid = sessionStorage.getItem('parkid');
                            this.$ajax.addLeaseRes(this.addData, res => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.addBol = false;
                                this.queryLeaseResList()
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            updateLeaseRes(){
                this.$ajax.updateLeaseRes({id: this.addData.id, parameters: this.addData}, res => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.addBol = false;
                    this.DetailBol = false;
                    this.queryLeaseResList();
                })
            },
            search() {
                this.queryLeaseResList()
            },
            addBtn() {
                this.addBol = true;
                this.addData = {}
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //条款
            DetailBolChange(data){
                this.DetailBol = true;
                this.addData = data;
                this.h5.content = '';
                data.h5id && this.$ajax.getH5Details({id:data.h5id}, res => {
                    this.h5=res.data;
                })
            },
            checkH5(data){
                if(data.h5id){
                    this.$ajax.getH5Details({id:data.h5id}, res => {
                        var OpenWindow = window.open("", "newwin", "toolbar=no,menubar=no");
                        OpenWindow.document.write("<HTML>");
                        OpenWindow.document.write("<TITLE>富文本内容</TITLE>");
                        OpenWindow.document.write("<BODY>");
                        OpenWindow.document.write(res.data.content);
                        OpenWindow.document.write("</BODY>");
                        OpenWindow.document.write("</HTML>");
                    })
                }else{
                    this.$message({
                        type: 'warning',
                        message: '暂未添加任何条款!'
                    })
                }
            },
            //删除物品
            delLease() {
                let arr = this.multipleSelection.map(n => n.id);
                if (arr.length) {
                    this.$confirm('您确定要删除该类型吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        this.$ajax.deleteLeaseRes({idlst: arr}, res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.queryLeaseResList()
                        })
                    }).catch(() => {
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '尚未选择任何内容!'
                    });
                }
            },
            // 编辑条款
            submith5(){
                if(this.h5.id){
                    this.$ajax.updateH5({id: this.h5.id,parameters: {content:this.h5.content}}, res => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.DetailBol = false
                    })
                }else{
                    this.$ajax.addH5(this.h5, res => {
                        if(res.resb==200){
                            this.addData.h5id =res.data.id;
                            this.updateLeaseRes();
                        }
                    })
                }

            },
            handleCurrentChange(val) { // 切换元页
                this.query.page = val//.toString()
                this.resLoading = true
                this.queryLeaseResList()
            }
        },
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

        .toolbar {
            display: flex;
            justify-content: flex-end;
            position: relative;

            .allControl {
                position: absolute;
                left: 15px;
            }
        }
        .el-dialog__wrapper{
            z-index: 999;
            background: rgba(0,0,0,.8);
            .el-dialogadd{
                width: 500px;
                margin-top: 15vh;
            }
            .el-dialogedit{
                width: 1000px;
                margin-top: 15vh;
            }
        }
    }
</style>
