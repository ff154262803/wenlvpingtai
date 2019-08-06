<template>
    <div class="classificationPage">
        <el-input placeholder="请输入内容" v-model="input10" clearable style="width: 300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="addBol=true">添加</el-button>
        <div class="classify">
            <strong>分类:</strong>
            <el-button type="text">不限</el-button>
            <el-button type="text">按钮</el-button>
        </div>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="分类名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="address"
                label="类型"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="创建时间">
                <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="UpDown(1,'1')">修改</el-button>
                    <el-button type="text" size="small" @click="UpDown(1,'0')">删除</el-button>
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

        <!--弹窗内容-->
        <el-dialog title="收货地址" :visible="addBol">
            <el-form :model="addData">
                <el-form-item label="活动名称" label-width="120px">
                    <el-input v-model="addData.name" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" label-width="120px">
                    <el-select v-model="addData.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai" select></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBol = false">取 消</el-button>
                <el-button type="primary" @click="addBol = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "user",
        data() {
            return {
                input10: '',
                checked: true,
                total: 0,
                addBol: false,
                pageObj: {
                    page: 1,
                    size: 20,
                    uKey: sessionStorage.getItem('user')
                },
                addData: {
                    name: '',
                    region: '',
                },
                tableData3: [{
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-06',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-07',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                multipleSelection: []
            }
        },
        methods: {
            search() {
                console.log(this.$route);
            },
            addBtn() {

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
