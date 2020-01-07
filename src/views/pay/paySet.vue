<template>
    <div>
        <!--支付方式-->
        <el-card class="box-card" style="width: 300px">
            <div slot="header">
                <span>支付方式</span>
            </div>
            <div class="item">
                <el-checkbox label="微信" v-model="payType.wechat" @change="setPayType"></el-checkbox>
                <el-checkbox label="支付宝" v-model="payType.alipay" @change="setPayType"></el-checkbox>
                <el-checkbox label="银联" v-model="payType.visal" @change="setPayType"></el-checkbox>
            </div>
        </el-card>
        <!--充值阶梯按钮-->
        <h2 class="title">充值阶梯
            <el-button class="addBtn" type="primary" @click="addBtn">添加阶梯</el-button>
        </h2>
        <!--表格内容-->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="caption" label="名称" width="150"></el-table-column>
            <el-table-column prop="point" label="积分" width="100"></el-table-column>
            <el-table-column prop="price" label="金额（元）" width="100"></el-table-column>
            <el-table-column prop="discount" label="折扣" width="100"></el-table-column>
            <el-table-column prop="num" label="折扣期限">
                <template slot-scope="scope">{{ scope.row.starttime+'——'+scope.row.endtime }}</template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <div class="allControl">
                <el-button size="small" @click="del">删除</el-button>
            </div>
<!--            <el-pagination background-->
<!--                           layout="total,sizes, prev, pager, next, jumper"-->
<!--                           @current-change="handleCurrentChange"-->
<!--                           @size-change="handleSizeChange"-->
<!--                           :page-sizes="[10, 15, 20, 30, 50]"-->
<!--                           :current-page.sync="query.page"-->
<!--                           :page-size="query.count" :total="total">-->
<!--            </el-pagination>-->
<!--            <el-button size="small">确定</el-button>-->
        </el-col>
        <!--弹窗内容-->
        <el-dialog title="添加阶梯" :visible.sync="addBol" :close-on-click-modal=false>
            <el-form :model="addData" :rules="rules" ref="addData">
                <el-form-item label="名称：" label-width="120px" prop="caption">
                    <el-input v-model="addData.caption" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="支付金额(元)：" label-width="120px" prop="price">
                    <el-input v-model.number="addData.price" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="支付折扣：" label-width="120px" prop="discount">
                    <el-input v-model.number="addData.discount" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="获得积分：" label-width="120px" prop="point">
                    <el-input v-model.number="addData.point" style="width: 200px"></el-input>
                </el-form-item>

                <el-form-item label="折扣期限：" label-width="120px" prop="time">
                    <el-date-picker v-model="addData.time" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                    ></el-date-picker>
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
        name: "paySet",
        data() {
            return {
                total: 0,
                payType: {
                    wechat: false,
                    alipay: false,
                    visal: false
                },
                addBol: false,
                query: {
                    page: 1,
                    phone: '',
                    count: 10,
                    status: '',
                    endDate: '',
                    startDate: '',
                    parkid: sessionStorage.getItem('parkid'),
                },
                rules: {
                    time: [{required: true, message: '折扣日期不能为空'}],
                    caption: [{required: true, message: '请输入名称', trigger: 'blur'}],
                    point: [{type: 'number', required: true, message: '请输入获得积分', trigger: 'blur'}],
                    price: [{type: 'number', required: true, message: '请输入支付金额', trigger: 'blur'}],
                    discount: [{type: 'number', required: true, message: '请输入支付折扣', trigger: 'blur'}],
                },
                tableData: [],
                addData: {},
                multipleSelection: [],
            }
        },
        mounted() {
            this.getPayType();
            this.queryPayOptionList();
        },
        methods: {
            queryPayOptionList(){
                this.$ajax.queryPayOptionList({},res=>{
                    res.data.forEach(n=>{n.price=n.price/100});
                    this.tableData = res.data;
                })
            },
            getPayType() {
                this.$ajax.getPayType({}, res => {
                    let data = res.data.data;
                    this.payType.wechat = data[0] === '1';
                    this.payType.alipay = data[1] === '1';
                    this.payType.visal = data[2] === '1';
                })
            },
            setPayType() {
                let str = '';
                str += this.payType.wechat ? '1' : '0';
                str += this.payType.alipay ? '1' : '0';
                str += this.payType.visal ? '1' : '0';
                this.$ajax.setPayType({data: str}, res => {
                    this.$message.success('修改成功');
                })
            },
            addBtn() {
                this.addBol = true;
                this.addData = {};
            },
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addData.starttime = this.addData.time[0];
                        this.addData.endtime = this.addData.time[1];
                        this.addData.price = this.addData.price * 100;
                        if (this.addData.id) {
                            this.$ajax.updatePayOption(this.addData,res=>{
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!'
                                });
                                this.queryPayOptionList();
                            })
                        } else {
                            this.$ajax.addPayOption(this.addData, res => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.queryPayOptionList();
                            })
                        }
                        this.addBol = false;
                    }
                })
            },
            edit(data) {
                this.addBol = true;
                this.addData = data;
                this.$set(this.addData, 'time', [data.starttime, data.endtime]);
            },
            del(){
                this.$ajax.deletePayOption({idlst:this.multipleSelection},res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.queryPayOptionList();
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val.map(n=>n.id);
            },
            // handleSizeChange(val) {
            //     this.query.count = val;
            //     this.queryLeaseRecords();
            // },
            // handleCurrentChange(val) { // 切换元页
            //     this.query.page = val;//.toString()
            //     this.resLoading = true;
            //     this.queryLeaseRecords()
            // }
        }
    }
</script>

<style scoped lang="scss">
    .addBtn {
        margin-right: 150px;
        float: right;
    }

    .toolbar {
        display: flex;
        justify-content: flex-end;
        position: relative;
        height: 52px;
        .allControl {
            position: absolute;
            left: 15px;
        }
    }
</style>
