<template>
    <div class="classificationPage">
        <el-input placeholder="请输入内容" v-model="condition" clearable style="width: 300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="addBtn">添加</el-button>
        <div class="classify">
            <strong>分类:</strong>
            <el-button type="text">不限</el-button>
            <el-button type="text">按钮</el-button>
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
                prop="managename"
                label="用户名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="account"
                label="账号"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="address"
                label="平台"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="isenable"
                label="状态"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="lastlogintime"
                show-overflow-tooltips
                align="center"
            >
                <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="UpDown(1,'1')">冻结</el-button>
                    <el-button type="text" size="small" @click="UpDown(1,'0')">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <!--<el-checkbox v-model="checked"></el-checkbox>-->
                <el-button size="small">删除</el-button>
                <el-button size="small">启用</el-button>
                <el-button size="small">禁用</el-button>
            </div>
            <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
                           :page-size="pageObj.size" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>

        <!--添加用户-->
        <!--<el-dialog title="添加用户" :visible="addUser.show" class="demo-box">-->
            <!--<el-form :model="form">-->
                <!--&lt;!&ndash;<el-form-item label="平台" label-width="120px">&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-radio-group v-model="addUser.resource">&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-radio label="Android"></el-radio>&ndash;&gt;-->
                        <!--&lt;!&ndash;<el-radio label="IOS"></el-radio>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-radio-group>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                <!--<el-form-item label="版本名" label-width="120px">-->
                    <!--<el-input v-model="addUser.account"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="版本号" label-width="120px">-->
                    <!--<el-input v-model="addUser.name2"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-radio-group v-model="addUser.isenable">-->
                    <!--<el-radio label="正常"></el-radio>-->
                    <!--<el-radio label="维护中"></el-radio>-->
                <!--</el-radio-group>-->
                <!--<el-form-item label="最低版本号" label-width="120px">-->
                    <!--<el-input v-model="addUser.name3"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="活动形式" label-width="120px">-->
                    <!--<el-input autosize type="textarea" :autosize="{ minRows: 3}" v-model="form.desc"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="下载地址" label-width="120px">-->
                    <!--<el-input :disabled="true" v-model="form.url"></el-input>-->
                    <!--<el-button style="margin-left: 50px">上传</el-button>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="dialogVisibleNew = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="dialogNewTrue">确 定</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    export default {
        name: "classificationPage",
        data() {
            return {
                condition: '',
                checked: true,
                total: 0,
                dataList: [],
                pageObj: {
                    page: 1,
                    size: 20,
                    uKey: sessionStorage.getItem('user')
                },
                addUser: {
                    show:false,
                    account:'',
                    isenable:'',
                    managename:'',
                    password:'',
                },
                multipleSelection: []
            }
        },
        mounted() {
            this.queryManageUserList();
        },
        methods: {
            queryManageUserList() {
                this.$ajax.queryManageUserList({
                    "condition": this.condition,
                    "count": 20,
                    "page": 0
                }, res => {
                    this.dataList = res;
                    console.log(res)
                })
            },
            search() {
                console.log(this.$route);
            },
            addBtn() {
                this.addUser.show = true;
            },
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val;
            },
            UpDown() {
            },
            handleCurrentChange(val) { // 切换元页
                this.pageObj.page = val.toString()
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
        .classify {
            margin: 20px 10px;
            .el-button {
                margin-left: 20px;
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

