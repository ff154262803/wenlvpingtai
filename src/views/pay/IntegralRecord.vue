<template>
    <div class="classificationPage">
        <strong>手机号：</strong>
        <el-input placeholder="请输入手机号" v-model="query.mobile" clearable style="width: 300px"></el-input>
        <strong>类型：</strong>
        <el-select placeholder="请选择" v-model="query.type" clearable>
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id">
            </el-option>
        </el-select>
        <el-button icon="el-icon-search" class="btn" @click="queryScoreList"></el-button>
        <!--表格内容-->
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="orderno" label="订单号" width="200px"></el-table-column>
            <el-table-column prop="mobile" label="用户"></el-table-column>
            <el-table-column prop="point" label="积分数量" width="80px"></el-table-column>
            <el-table-column prop="amount" label="金额" width="50px"></el-table-column>
            <el-table-column label="类型" width="80px">
                <template slot-scope="scope">
                    <div class="cell">{{typeKey[scope.row.type]}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="subject" label="说明"></el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
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
        <div class="el-dialog__wrapper" v-show="showBol">
            <div class="el-dialog">
                <div class="el-dialog__header">
                    <span class="el-dialog__title">订单详情</span>
                    <button class="el-dialog__headerbtn" aria-label="Close" type="button"><i
                        class="el-dialog__close el-icon el-icon-close" @click="showBol=false"></i></button>
                </div>
                <div class="el-dialog__body">
                    <el-row><el-col>商品名：{{addData.subject}}</el-col></el-row>
                    <el-row><el-col>订单编号：{{addData.orderno}}</el-col></el-row>
                    <el-row><el-col>创建时间：{{addData.createtime}}</el-col></el-row>
                    <el-row><el-col>价格：{{addData.amount}}</el-col></el-row>
                    <el-row><el-col>用户账号：{{addData.mobile}}</el-col></el-row>
                    <el-row><el-col>数量：{{addData.num}}</el-col></el-row>
                    <el-row><el-col>支付方式：{{addData.paychannel}}</el-col></el-row>
                    <el-row><el-col>支付时间：{{addData.paytime}}</el-col></el-row>
                    <el-row><el-col>状态：{{status[addData.status]}}</el-col></el-row>
                    <el-row><el-col>操作时间：{{addData.operationreason}}</el-col></el-row>
                    <el-row><el-col>操作人员：{{addData.account}}</el-col></el-row>
                    <el-row><el-col>退款原因：{{addData.subject}}</el-col></el-row>
                </div>
                <div class="el-dialog__footer">
                    <div class="dialog-footer">
                        <el-button @click="showBol=false">取 消</el-button>
                        <el-button type="primary" @click="showBol=false">确 定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "IntegralRecord",
        data() {
            return {
                total: 0,
                showBol: false,
                GiveBackBol: false,
                leaseResIdList: [],
                typeKey: {},
                typeList: [],
                query: {
                    page: 1,
                    count: 10,
                },
                tableData: [],
                addData:{},
                status:{'01':'已支付', '02':'已取消', '03':'已超时', '04':'已退款', '05':'已关闭' },
                payChannel:{'wechat':'微信',},
            }
        },
        mounted() {
            this.queryTypeList();
            // this.getLeaseResNames();
            // this.getServiceCenterList();
        },
        methods: {
            //查询积分的类型
            queryTypeList() {
                this.$ajax.queryTypeList({count: 999, page: 1, groupId: 10}, res => {
                    let obj = {};
                     res.data.forEach(n=>{obj[n.id] = n.typeName;});
                    this.typeKey = obj;
                    this.typeList = res.data;
                    this.queryScoreList();
                })
            },
            //查询
            queryScoreList() {
                this.$ajax.queryScoreList(this.query, res => {
                    this.tableData = res.data;
                    this.total = res.total
                })
            },
            edit(data, item) {
                this.showBol = true;
                console.log(data);
                this.addData = {...data};
            },
            cancel() {
                this.showBol = false;
            },
            //分页
            handleSizeChange(val) {
                this.query.count = val;
                this.queryScoreList();
            },
            handleCurrentChange(val) { // 切换元页
                this.query.page = val;//.toString()
                this.resLoading = true;
                this.queryScoreList()
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

        .filter {
            line-height: 40px;

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

        * > > > .el-dialog {
            width: 20%;
        }

        .el-row {
            word-break: break-all;
            margin-bottom: 0; /*去除el-row之间的间距*/
            border: 1px solid #e6e6e6;
            border-left: 0;
            border-right: 0;
            margin: -1px -1px -1px -1px; /*解决相邻边框重叠问题就靠这行代码*/
            text-align: left;

            .el-col {
                text-align: left;
                line-height: 35px;
                padding-left: 50px;
            }
        }

        .el-dialog__wrapper {
            z-index: 999;
            background: rgba(0, 0, 0, .8);

            .el-dialog {
                width: 400px;
                margin-top: 15vh;
            }
        }
    }
</style>
