<template>
    <div class="classificationPage">
        <el-input placeholder="用户名、账号" v-model="query.condition" clearable style="width: 300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <div class="filter">
            <strong>最后登录时间：</strong>
            <span @click="changetype('all')" :class='query.timeLimit==""?"active":""'>不限</span>
			<span :class='query.timeLimit==1?"active":""' @click="changetype(1)">1日</span>
            <span :class='query.timeLimit==2?"active":""' @click="changetype(2)">2日</span>
            <span :class='query.timeLimit==3?"active":""' @click="changetype(3)">3日</span>
            <span :class='query.timeLimit==4?"active":""' @click="changetype(4)">1周</span>
            <span :class='query.timeLimit==5?"active":""' @click="changetype(5)">1月</span>
        </div>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="caption"
                label="用户名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="账号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="system"
                label="注册平台"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="状态" width="80">
            	<template slot-scope="scope">{{ scope.row.isenable==0?'冻结':'启用' }}</template>
            </el-table-column>
            <el-table-column
                label="最后登录时间"
                prop="lastlogintime"
                show-overflow-tooltips
                align="center"
            >
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" v-show="scope.row.isenable==1" @click="UpDown(scope.row.id,'0')">冻结</el-button>
                    <el-button type="text" size="small" v-show="scope.row.isenable==0" @click="UpDown(scope.row.id,'1')">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="delAll">删除</el-button>
                <el-button size="small" @click="enableState(1)">启用</el-button>
                <el-button size="small" @click="enableState(0)">冻结</el-button>
            </div>
            <el-pagination background
				layout="total,sizes, prev, pager, next, jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10, 15, 20, 30, 50]"
				:page-size="query.count" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>
    </div>
</template>

<script>
    export default {
        name: "classificationPage",
        data() {
            return {
                total: 0,
                dataList: [],
                query: {
                    condition:'',
                    page: 1,
                    size: 20,
                    timeLimit:''
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.queryAppUserList();
        },
        methods: {
            enableState(val){
                if(this.multipleSelection.length>0){
                    let idlst=[]
                    for(let i = 0;i<this.multipleSelection.length;i++){
                        idlst.push(this.multipleSelection[i].id)
                    }
                    this.$ajax.setAppUserEnableState({idlst:idlst,isenable:val}, res => {
                        this.$message({
                            type: 'success',
                            message: '设置成功!'
                        });
                        this.queryAppUserList()
                    })
                }
            },
            changetype(val){
                this.query.timeLimit = val
                this.query.page = 1
                this.queryAppUserList()
            },
            queryAppUserList() {
                this.$ajax.queryAppUserList(this.query, res => {
                    this.dataList = res.data;
                    this.total = res.total
                })
            },
            delAll(){
                if(this.multipleSelection.length>0){
                    let idlst=[]
                    for(let i = 0;i<this.multipleSelection.length;i++){
                        idlst.push(this.multipleSelection[i].id)
                    }
                    this.$confirm('您确定要删除选中用户吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$ajax.deleteAppUser({idlst:idlst}, res => {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.queryAppUserList()
                        })
                    }).catch(() => {});
                }
            },
            search() {
                this.query.page = 1
                this.queryAppUserList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            UpDown(id,val) {
                this.$ajax.setAppUserEnableState({idlst:[id],isenable:val}, res => {
					this.$message({
						type: 'success',
						message: '设置成功!'
					});
					this.queryAppUserList()
				})
            },
            handleSizeChange(val) {
                this.query.count = val;
                this.query.page = 1;
                this.queryAppUserList();
            },
            handleCurrentChange(val) { // 切换元页
                this.query.page = val.toString()
                this.resLoading = true
                this.queryAppUserList()
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

