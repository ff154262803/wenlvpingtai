<template>
    <div class="classificationPage">
        <el-input placeholder="请输入内容" v-model="condition" @clear="queryManageUserList" clearable
                  style="width: 300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="queryManageUserList"></el-button>
        <el-button class="addBtn" type="primary" @click="addBtn">添加</el-button>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="dataList"
            v-loading="dataLoading"
            tooltip-effect="dark"
            style="width: 100%;margin-top: 30px;"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="managename" label="真实姓名" width="120"></el-table-column>
            <el-table-column prop="account" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="isenable" label="状态" width="100" :formatter="state"
                             show-overflow-tooltip></el-table-column>
            <el-table-column label="最后登录" prop="lastlogintime" show-overflow-tooltips align="center"></el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="changeUser(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="delUser(scope.row.uid)">删除</el-button>
                    <el-button type="text" size="small" @click="dealState(scope.row,'0')" v-if="scope.row.isenable*1">
                        禁用
                    </el-button>
                    <el-button type="text" size="small" @click="dealState(scope.row,'1')" v-else>启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <!--<el-checkbox v-model="checked"></el-checkbox>-->
                <el-button size="small" @click="dealState(multipleSelection,'1')">启用</el-button>
                <el-button size="small" @click="dealState(multipleSelection,'0')">禁用</el-button>
            </div>
            <el-pagination background
                           layout="total,sizes, prev, pager, next, jumper"
                           @current-change="handleCurrentChange"
                           @size-change="handleSizeChange"
                           :page-sizes="[10, 15, 20, 30, 50]"
                           :page-size="pageObj.size" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>

        <!--添加用户-->
        <el-dialog :title="addUser.state == 'add'? '添加用户':'修改用户'" :visible.sync="addUser.show" class="demo-box">
            <el-form :model="addUser" :rules="rules" ref="addUser">
                <el-form-item label="姓名：" label-width="120px" prop="managename">
                    <el-input v-model="addUser.managename"></el-input>
                </el-form-item>
                <el-form-item label="账号：" label-width="120px" prop="account">
                    <el-input v-model="addUser.account"></el-input>
                </el-form-item>
                <el-form-item label="密码：" label-width="120px" prop="password">
                    <el-input v-model="addUser.password"></el-input>
                </el-form-item>
                <el-form-item label="状态：" label-width="120px" prop="isenable">
                    <el-radio-group v-model="addUser.isenable">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUser.show = false">取 消</el-button>
                <el-button type="primary" @click="addUserBtn('addUser')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "manage",
        data() {
            var pass = (rule, val, callback) => {
                if (val == '') {
                    callback(new Error('请输入密码'));
                } else if (val.length < 6) {
                    callback(new Error('密码长度应大于6位'));
                } else {
                    callback();
                }
            }
            return {
                condition: '',
                // checked: true,
                total: 0,
                dataList: [],
                dataLoading: false,
                pageObj: {
                    page: 1,
                    size: 15,
                },
                addUser: {//添加账号的表单
                    state: 'add',
                    show: false,
                    managename: '',
                    account: '',
                    password: '',
                    isenable: '',
                },
                multipleSelection: [],//选中内容
                rules: {//验证规则
                    managename: [{required: true, message: '请输入姓名', trigger: 'change'}],
                    account: [{required: true, message: '请输入账号', trigger: 'change'}],
                    password: [{validator: pass, trigger: 'change'}],
                    isenable: [{required: true, message: '请选择状态', trigger: 'change'}],
                }
            }
        },
        mounted() {
            this.queryManageUserList();
        },
        methods: {
            //显示状态
            state(val) {
                return val.isenable * 1 ? '启用' : '禁用'
            },
            //查询
            queryManageUserList() {
                this.dataLoading = true;
                this.$ajax.queryManageUserList({
                    "condition": this.condition,
                    "count": this.pageObj.size,
                    "page": this.pageObj.page
                }, res => {
                    this.dataLoading = false;
                    this.total = res.total;
                    this.dataList = res.data;
                })
            },
            // 添加按钮
            addBtn() {
                this.addUser.show = true;
                this.addUser.state = 'add';
                if (this.$refs.addUser) this.$refs.addUser.resetFields();
                this.addUser.managename = '';
                this.addUser.account = '';
                this.addUser.password = '';
                this.addUser.isenable = '';
            },
            //弹窗确定按钮
            addUserBtn(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addUser.state == 'add') {//添加用户
                            this.$ajax.addManageUser(this.addUser, res => {
                                this.$message.success('添加成功');
                                this.addUser.show = false;
                                this.queryManageUserList();
                            })

                        } else if (this.addUser.state == 'change') {//修改用户
                            this.$ajax.updateManageUser(this.addUser, res => {
                                this.$message.success('修改成功');
                                this.addUser.show = false;
                                this.queryManageUserList();
                            })
                        }
                    } else {
                        return false;
                    }
                });
            },
            //修改
            changeUser(data) {
                this.addUser = {...this.addUser, ...data}
                this.addUser.state = 'change'
                this.addUser.show = true;
            },
            //删除
            delUser(data) {
                var id = Number(data) ? [Number(data)] : data;//备用以后批量删除
                this.$confirm('确认删除该用户？')
                  .then(_ => {
                      this.$ajax.deleteManageUser({idlst: id}, res => {
                          this.queryManageUserList();
                      })
                  })
                  .catch(_ => {
                  });
            },
            //处理状态
            dealState(data, enable) {
                if (data.constructor == Object) data = [data];
                var idlist = data.map(n => n.uid);
                if(idlist.length){
                    this.$ajax.setManageUserEnableState({
                        idlst: idlist,
                        isenable: enable
                    }, res => {
                        this.queryManageUserList();
                    })
                }else{
                    this.$message.error('请选择要处理的管理员');
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //切换页码
            handleSizeChange(val) {
                this.pageObj.size = val;
                this.queryManageUserList();
            },
            // 切换元页
            handleCurrentChange(val) {
                this.pageObj.page = val;
                this.queryManageUserList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .classificationPage {
        .btn {
            margin-left: 20px;
        }
        .el-input {
            width: 200px;
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

