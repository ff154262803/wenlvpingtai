<template>
    <div class="classificationPage">
        <el-button class="addBtn" type="primary" @click="addBtn">发布公告</el-button>
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
                prop="title"
                label="标题"
                width="200">
            </el-table-column>
            <el-table-column
                prop="content"
                label="内容"
                width="200">
            </el-table-column>
            <el-table-column
                prop="siteName"
                label="有效期"
                width="200">
            </el-table-column>
             <el-table-column
                prop="createtime"
                label="发布时间">
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">复制重发</el-button>
                    <el-button type="text" size="small" @click="Detail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="Del()">删除</el-button>
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
        <div class="el-dialog__wrapper" v-show="addBol">
			<div class="el-dialog el-dialogedit">
				<div class="el-dialog__header">
					<span class="el-dialog__title">发布公告</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="reset('')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="addData" :rules="rules" ref="addData" >
                    <el-form-item label="标题" label-width="60px" prop="title">
                        <el-input v-model="addData.title" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="有效期" label-width="60px"  prop="time">
                    <el-date-picker v-model="addData.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="内容" label-width="60px"  prop="content">
                        <el-input v-model="addData.content" style="width: 200px"></el-input>
                    </el-form-item>
                    <el-form-item label="详情" label-width="60px"  prop="h5id">
                        <div style="height:500px">
                            <tinymce-editor ref="editor" v-model="h5.content" > </tinymce-editor>
                        </div>
                    </el-form-item>
                </el-form>
				</div>
				<div class="el-dialog__footer">
					<div class="dialog-footer">
						<el-button @click="reset('addData')">取 消</el-button>
						<el-button type="primary" @click="submit('addData')">确 定</el-button>
					</div>
				</div>
			</div>
        </div>
    </div>
</template>
<script>
    import TinymceEditor from '../../components/editor'
    export default {
        name:'list',
        components: {
            TinymceEditor
        },
        data() {
            return {
                total: 0,
                addBol: false,
                query: {
                    parkid:sessionStorage.getItem('parkid'),
                    page: 1,
                    count: 10
                },
                rules: {
                    title: [{required: true, message: '请输入名称', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                    content: [{required: true, message: '请输入备注', trigger: 'blur'}, { max: 20, message: '最多200个字符', trigger: 'blur' }],
                    siteid: [{required: true, message: '请选择商家名称', trigger: 'change'}]
                },
                addData: {},
                tableData: [],
                multipleSelection: [],
                h5:{
                    id:'',
                    content:''
                }
            }
        },
        mounted(){
            this.getAccessToken()
        },
        methods: {
            handleSizeChange(val) {
                this.query.count = val;
                this.getAccessToken();
            },
            reset(formName){
                this.$refs[formName].resetFields();
                this.addBol = false
            },
            edit(data){
                this.addBol = true
                this.addData = {...data}
            },
            getAccessToken(){
                this.$ajax.queryParkNoticeList(this.query, res => {
                    this.tableData = res.data
                    this.total = res.total
                })
            },
            submit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.addData.id){
                           
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
                this.addData= {}
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            Del(id) {
                this.$confirm('您确定要删除该类型吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.deleteParkNotice({idlst:[id]}, res => {
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
                this.getAccessToken()
            }
        }
    }
</script>

<style scoped lang="scss">
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
