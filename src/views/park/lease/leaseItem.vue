<template>
    <div class="classificationPage">
        <el-input placeholder="请输入手机号" v-model="query.phone" clearable style="width: 300px"></el-input>
        <!--        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>-->
        <el-button class="addBtn" type="primary" @click="addBtn">租借</el-button>
        <div class="filter">
            <strong>物品：</strong>
            <span @click="query.leaseresid=''" :class='query.leaseresid==""?"active":""'>不限</span>
            <span v-for="item in leaseResIdList"
                  :key="item.id"
                  :class='query.leaseresid==item.id?"active":""'
                  @click="query.leaseresid=item.id">{{item.caption}}</span>
        </div>
        <div class="filter">
            <strong>时间：</strong>
            <el-date-picker
                v-model="query.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="clearNullTime(query.time)"
            >
            </el-date-picker>
        </div>
        <div class="filter">
            <strong>状态：</strong>
            <span @click="query.status=''" :class='query.status==""?"active":""'>不限</span>
            <span @click="query.status='1'" :class='query.status=="1"?"active":""'>已归还</span>
            <span @click="query.status='0'" :class='query.status=="0"?"active":""'>未归还</span>
        </div>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                prop="name"
                label="姓名"
                width="100">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号"
                width="150">
            </el-table-column>
            <el-table-column
                prop="caption"
                label="物品"
                width="100">
            </el-table-column>
            <el-table-column
                prop="num"
                label="数量">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">{{ scope.row.status==='0'?'未归还':'已归还' }}</template>
            </el-table-column>
            <el-table-column
                prop="createtime"
                label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="GiveBackBtn(scope.row)" v-if="scope.row.status==='0'">
                        归还
                    </el-button>
                    <el-button type="text" size="small" @click="edit(scope.row,'disabled')">详情</el-button>
                    <el-button type="text" size="small" @click="edit(scope.row,'detail')">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <!--            <div class="allControl">-->
            <!--                <el-button size="small" @click="enableState(1)">启用</el-button>-->
            <!--                <el-button size="small" @click="enableState(0)">禁用</el-button>-->
            <!--            </div>-->
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
        <el-dialog :title="disabled?'详情':'租借'" :visible.sync="addBol" :close-on-click-modal=false @close="cancel">
            <el-form :model="addData" :rules="rules" ref="addData">
                <el-form-item label="物品：" label-width="120px" prop="leaseresid">
                    <el-select v-model="addData.leaseresid" placeholder="请选择分类" @change="change"
                               :disabled="disabled || detail">
                        <el-option :label='item.caption' :value="item.id" v-for="(item, index) in leaseResIdList"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="借出地点：" label-width="120px" prop="servicecenterid">
                    <el-select v-model="addData.servicecenterid" placeholder="请选择分类" @change="change"
                               :disabled="disabled || detail">
                        <el-option :label='item.caption' :value="item.id" v-for="(item, index) in serviceCenterIdList"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量：" label-width="120px" prop="num">
                    <el-input-number v-model.number="addData.num" :min="0" :max="unused"
                                     :disabled="disabled || detail"></el-input-number>
                    <strong style="float: right;margin-right: 50px;">剩余数量：{{unused}}</strong>
                </el-form-item>
                <span class="el-dialog__title">租借人信息</span>
                <el-form-item label="姓名：" label-width="120px" prop="name">
                    <el-input v-model="addData.name" placeholder="请输入姓名" style="width: 200px"
                              :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" label-width="120px" prop="phone">
                    <el-input v-model="addData.phone" placeholder="请输入手机号" style="width: 200px"
                              :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="证件号：" label-width="120px" prop="number">
                    <el-input v-model="addData.number" placeholder="请输入证件号" style="width: 200px"
                              :disabled="disabled"></el-input>
                </el-form-item>
                <el-form-item label="押金：" label-width="120px" prop="cash">
                    <el-input v-model.number="addData.cash" placeholder="请输入押金" style="width: 200px"
                              :disabled="disabled"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit('addData')" v-if="!disabled">确 定</el-button>
            </div>
        </el-dialog>
        <!--归还-->
        <el-dialog title="归还" :visible.sync="GiveBackBol" :close-on-click-modal=false>
            <el-form :model="GiveBackData" :rules="rules" ref="GiveBackData">
                <span class="el-dialog__title">请确认好归还的物品和归还数量</span>
                <el-form-item label="归还地点：" label-width="120px" prop="servicecenterid">
                    <el-select v-model="GiveBackData.servicecenterid" placeholder="请选择分类" @change="change">
                        <el-option :label='item.caption' :value="item.id" v-for="(item, index) in serviceCenterIdList"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="GiveBackBol=false">取 消</el-button>
                <el-button type="primary" @click="GiveBack('GiveBackData')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "leaseItem",
        data() {
            const checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
                if (!value) {
                    return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                    // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                    // 所以我就在前面加了一个+实现隐式转换
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (phoneReg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式不正确'))
                        }
                    }
                }, 100)
            };
            return {
                list: [],
                total: 0,
                addBol: false,
                GiveBackBol: false,
                leaseResIdList: [],
                serviceCenterIdList: [],
                unused: 0,
                disabled: false,
                detail: false,
                query: {
                    page: 1,
                    phone: '',
                    count: 10,
                    status: '',
                    endDate: '',
                    startDate: '',
                    leaseresid: '',
                    parkid: sessionStorage.getItem('parkid'),
                },
                rules: {
                    leaseresid: [{required: true, message: '请选择物品', trigger: 'change'}],
                    servicecenterid: [{required: true, message: '请选择地点', trigger: 'change'}],
                    num: [{
                        validator: (rule, val, callback) => {
                            val ? callback() : callback(new Error('数量必须大于0'))
                        }, trigger: 'change'
                    }],
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    phone: [{required: true, validator: checkPhone, trigger: 'blur'}],
                    number: [{required: true, message: '请输入证件号', trigger: 'blur'}],
                    cash: [{type: 'number', required: true, message: '请输入押金', trigger: 'blur'}]
                },
                addData: {},
                GiveBackData: {},
                tableData: [],
                multipleSelection: []
            }
        },
        mounted() {
            this.queryLeaseRecords();
            this.getLeaseResNames();
            this.getServiceCenterList();
        },
        methods: {
            //查询
            queryLeaseRecords() {
                this.$ajax.queryLeaseRecords(this.query, res => {
                    this.tableData = res.data;
                    this.total = res.total
                })
            },
            //获取物品
            getLeaseResNames() {
                this.$ajax.getLeaseResNames({id: sessionStorage.getItem('parkid')}, res => {
                    this.leaseResIdList = res.data;
                })
            },
            //获取服务中心
            getServiceCenterList() {
                this.$ajax.getServiceCenterList({id: sessionStorage.getItem('parkid')}, res => {
                    this.serviceCenterIdList = res.data;
                })
            },
            //改变分类
            change(callback) {
                if (this.addData.leaseresid && this.addData.servicecenterid) {
                    let data = {...this.query, ...this.addData};
                    this.$ajax.queryLeaseResManagement(data, res => {
                        if (res.data.length) {
                            this.unused = res.data[0].unused;
                            callback && callback();
                        } else {
                            this.unused = 0;
                            this.addData.num = 0;
                        }
                    })
                }
            },


            //改变时间
            clearNullTime(time) {
                this.query.startDate = time ? time[0] : '';
                this.query.endDate = time ? time[1] : '';
                this.queryLeaseRecords();
            },

            GiveBackBtn(item) {
                this.GiveBackBol = true;
                this.GiveBackData.recordid = item.id;
            },
            edit(data, item) {
                this[item] = true;
                this.addBol = true;
                this.addData = {...data};
                this.change(() => {
                    this.addData = {...data};
                });
            },
            cancel() {
                this.addBol = false;
                this.disabled = false;
                this.detail = false;
            },
            GiveBack(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$ajax.leaseGiveBack({...this.GiveBackData}, res => {
                            this.$message({
                                type: 'success',
                                message: '归还成功!'
                            });
                            this.GiveBackBol = false;
                            this.queryLeaseRecords();
                        })
                    }
                })
            },
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.addData.id) {
                            this.$ajax.updateVisitorLease(this.addData, res => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.addBol = false;
                                this.queryLeaseRecords();
                            })
                        } else {
                            this.addData.parkid = sessionStorage.getItem('parkid');
                            this.$ajax.visitorLease(this.addData, res => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.addBol = false;
                                this.queryLeaseRecords()
                            })
                        }

                    } else {
                        return false;
                    }
                });
            },
            search() {
                this.queryLeaseRecords()
            },
            addBtn() {
                this.addBol = true;
                this.addData = {num: 0};
                this.unused = 0;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // enableState(val) {
            //     if (this.multipleSelection.length == 0) {
            //         this.$message({
            //             type: 'warning',
            //             message: '尚未选择任何内容!'
            //         });
            //     } else {
            //         let idlst = []
            //         for (let i = 0; i < this.multipleSelection.length; i++) {
            //             idlst.push(this.multipleSelection[i].id)
            //         }
            //         this.$ajax.setTypeEnableState({idlst: idlst, isenable: val}, res => {
            //             this.$message({
            //                 type: 'success',
            //                 message: '设置成功!'
            //             });
            //             this.queryLeaseRecords()
            //         })
            //     }
            // },
            // UpDown(id) {
            //     this.$ajax.detailDeleteType({id: id}, res => {
            //         if (res.resb = 200) {
            //             this.$confirm('您确定要删除该类型吗?', '提示', {
            //                 confirmButtonText: '确定',
            //                 cancelButtonText: '取消',
            //                 type: 'warning'
            //             }).then(() => {
            //                 this.$ajax.deleteType({id: id}, res => {
            //                     this.$message({
            //                         type: 'success',
            //                         message: '删除成功!'
            //                     });
            //                     this.queryLeaseRecords()
            //                 })
            //             }).catch(() => {
            //             });
            //         }
            //
            //     }, err => {
            //         if (err.resb = 996) {
            //             this.$confirm('该类型已被使用您确定要删除该类型吗?', '提示', {
            //                 confirmButtonText: '确定',
            //                 cancelButtonText: '取消',
            //                 type: 'warning'
            //             }).then(() => {
            //                 this.$ajax.deleteType({id: id}, res => {
            //                     this.$message({
            //                         type: 'success',
            //                         message: '删除成功!'
            //                     });
            //                     this.queryLeaseRecords()
            //                 })
            //             }).catch(() => {
            //             });
            //         }
            //
            //     })
            // },
            //分页
            handleSizeChange(val) {
                this.query.count = val;
                this.queryLeaseRecords();
            },
            handleCurrentChange(val) { // 切换元页
                this.query.page = val;//.toString()
                this.resLoading = true;
                this.queryLeaseRecords()
            }
        },
        watch: {
            query: {
                handler(newVal, oldVal) {
                    this.queryLeaseRecords();
                },
                deep: true
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

        .filter {
            line-height: 40px;
            margin-top: 10px;
            span {
                display: inline-block;
                line-height: 30px;
                margin-left: 10px;
                background-color: rgba(64, 158, 255, .1);
                padding: 0 10px;
                font-size: 12px;
                color: #409EFF;
                border-radius: 4px;
                box-sizing: border-box;
                border: 1px solid rgba(64, 158, 255, .2);
                white-space: nowrap;
            }

            .active {
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

        .pic {
            position: relative;
            display: inline-block;
            height: 100px;
            width: 100px;
            margin-right: 10px;

            .close {
                position: absolute;
                right: -10px;
                top: -10px;
                width: 20px;
            }
        }
    }
</style>
