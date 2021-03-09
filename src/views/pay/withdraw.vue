<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入手机号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" circle></el-button>
    <el-button class="refresh" type="primary" @click="refresh">刷新</el-button>
    <div class="filter">
      <strong>订单日期：</strong>
      <el-date-picker
        v-model="query.createtime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="clearNullTime(query.createtime)"
      >
      </el-date-picker>
    </div>
    <!--表格内容-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column prop="stoneRefundNo" label="提现单号" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="account" label="提现账户" align="center">
      </el-table-column>
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">{{
          scope.row.stoneNum + "五彩石"
        }}</template>
      </el-table-column>
      <el-table-column prop="amount" label="提现金额" align="center">
        <template slot-scope="scope">{{ scope.row.amount + "元" }}</template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="申请时间"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{
            scope.row.status == "00"
              ? "待支付"
              : scope.row.status == "01"
              ? "已支付"
              : scope.row.status == "02"
              ? "已取消"
              : scope.row.status == "03"
              ? "已超时"
              : scope.row.status == "04"
              ? "已退款"
              : scope.row.status == "05"
              ? "已完成"
              : scope.row.status == "06"
              ? "待提现"
              : scope.row.status == "07"
              ? "提现失败"
              : scope.row.status == "08"
              ? "审核失败"
              : scope.row.status == "09"
              ? "已关闭"
              : scope.row.status == "10"
              ? "退款中"
              : scope.row.status == "11"
              ? "待取货"
              : scope.row.status == "12"
              ? "已取货"
              : "暂无"
          }}</template
        >
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.status == '06' ? !disabled : disabled"
            @click="withdraw(scope.row)"
            >提现</el-button
          >
          <el-button type="text" size="small" @click="details(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <!-- <el-button size="small">退款</el-button> -->
        <el-button size="small" @click="">导出</el-button>
      </div>
      <el-pagination
        background
        layout="total,sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 20, 30, 50]"
        :current-page.sync="query.page"
        :page-size="query.count"
        :total="total"
      >
      </el-pagination>
      <el-button size="small">确定</el-button>
    </el-col>
    <el-dialog title="审核详情" :visible.sync="detail" width="1000px">
      <el-form
        :model="formData"
        ref="formData"
        label-width="100px"
        class="form"
      >
        <table
          border="1"
          cellspacing="0"
          width="800px"
          align="center"
          style="margin-top: 30px"
        >
          <tr>
            <td colSpan="4" align="center" style="background-color: #9d9d9d">
              提现信息
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">提现单号：</td>
            <td colSpan="3" align="center">{{ formData.stoneRefundNo }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">提现账户：</td>
            <td align="center">{{ formData.account }}</td>
            <td align="center" style="background-color: #bbbbbb">支付金额：</td>
            <td align="center">{{ formData.stoneNum + "五彩石" }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">用户名：</td>
            <td align="center">{{ formData.username }}</td>
            <td align="center" style="background-color: #bbbbbb">提现金额：</td>
            <td align="center">{{ formData.amount + "元" }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">状态：</td>
            <td align="center">
              {{
                formData.status == "00"
                  ? "待支付"
                  : formData.status == "01"
                  ? "已支付"
                  : formData.status == "02"
                  ? "已取消"
                  : formData.status == "03"
                  ? "已超时"
                  : formData.status == "04"
                  ? "已退款"
                  : formData.status == "05"
                  ? "已完成"
                  : formData.status == "06"
                  ? "待提现"
                  : formData.status == "07"
                  ? "提现失败"
                  : formData.status == "08"
                  ? "审核失败"
                  : formData.status == "09"
                  ? "已关闭"
                  : formData.status == "10"
                  ? "退款中"
                  : formData.status == "11"
                  ? "待取货"
                  : formData.status == "12"
                  ? "已取货"
                  : "暂无"
              }}
            </td>
            <td align="center" style="background-color: #bbbbbb">申请日期：</td>
            <td align="center">{{ formData.createTime }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">到期日期：</td>
            <td colSpan="3" align="center">{{ formData.updatetime }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">执行人：</td>
            <td colSpan="3" align="center">{{ formData.operator }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">是否驳回：</td>
            <td colSpan="3" align="center">暂无</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">驳回理由：</td>
            <td colSpan="3" align="center">暂无</td>
          </tr>
        </table>
      </el-form>
    </el-dialog>
    <el-dialog title="提现审核" :visible.sync="deposit" width="500px">
      <el-form :model="newdata" ref="newdata" label-width="100px" class="form">
        <el-form :model="newdata" ref="newdata">
          <el-form-item label="提现金额：" label-width="120px" prop="caption">
            {{ newdata.amount + "元" }}
          </el-form-item>
          <el-form-item label="提现账户：" label-width="120px" prop="price">
            {{ newdata.account }}
          </el-form-item>
          <el-form-item label="提现通道：" label-width="120px" prop="discount">
            {{ newdata.system == "web" ? "微信" : "微信" }}
          </el-form-item>
          <el-form-item label="是否驳回：" label-width="120px" prop="discount">
            <el-radio v-model="newdata.reject" label="1">否</el-radio>
            <el-radio v-model="newdata.reject" label="2">是</el-radio>
          </el-form-item>
          <el-form-item
            label="驳回原因："
            label-width="120px"
            prop="point"
            v-if="newdata.reject == 2"
          >
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="newdata.reason"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <div class="foot">
              <el-button type="primary" @click="onSubmit('newdata')"
                >确定</el-button
              >
              <el-button @click="cancel">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-form>
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
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };
    return {
      options: [{ value: "1", label: "微信" }],
      typeNamelist: [], //商品分类名称
      total: 0,
      unused: 0,
      disabled: true,
      deposit: false,
      detail: false,
      query: {
        page: 1,
        count: 10,
        condition: "",
        endDate: "",
        startDate: "",
      },
      newdata: {
        operator: JSON.parse(sessionStorage.getItem("user")).name,
        reason: "",
        refundNo: "",
        reject: "1",
        uid: 79,
      },
      addData: {
        operator: JSON.parse(sessionStorage.getItem("user")).name,
        reason: "",
        refundNo: "",
        reject: "1",
        uid: 79,
      },
      GiveBackData: {},
      formData: {
        amount: "",
        mobile: "",
      },
      tableData: [],
      multipleSelection: [],
      isadmin: JSON.parse(sessionStorage.getItem("user")).isadmin,
    };
  },
  mounted() {
    // this.queryTypeList();
    this.queryOrderList();
  },
  methods: {
    //刷新
    refresh() {
      this.queryOrderList();
    },
    //详情
    details(row) {
      this.detail = true;
      this.formData = row;
      console.log("row", row);
    },
    //提现弹框
    withdraw(row) {
      this.deposit = true;
      this.newdata = row;
      console.log(row);
    },
    //取消
    cancel() {
      this.deposit = false;
    },
    //提交提现按钮
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        this.$ajax.stoneRefund(
          {
            operator: JSON.parse(sessionStorage.getItem("user")).name,
            reason: this.newdata.reason,
            reject: this.newdata.reject,
            refundNo: this.newdata.stoneRefundNo,
            uid: this.newdata.systemPayOrder[0].userId,
          },
          (res) => {
            this.$message({
              type: "success",
              message: "审核成功!",
            });
            this.deposit = false;
          }
        );
      });
    },
    //获取商品分类名称
    queryTypeList() {
      this.$ajax.queryTypeList({ groupId: 5 }, (res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.typeNamelist.push(res.data[i].typeName);
        }
      });
    },
    //查询
    queryOrderList() {
      this.$ajax.backRMB(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    //改变分类
    change(callback) {
      if (this.addData.leaseresid && this.addData.servicecenterid) {
        let data = { ...this.query, ...this.addData };
        this.$ajax.queryLeaseResManagement(data, (res) => {
          if (res.data.length) {
            this.unused = res.data[0].unused;
            callback && callback();
          } else {
            this.unused = 0;
            this.addData.num = 0;
          }
        });
      }
    },

    //改变时间
    clearNullTime(time) {
      this.query.startDate = time ? time[0] : "";
      this.query.endDate = time ? time[1] : "";
      this.queryOrderList();
    },
    //退款操作单行
    refund(orderNo) {
      console.log(orderNo);
      this.$confirm("您确定要退款选中商品订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.refund(orderNo, (res) => {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
            this.queryOrderList();
          });
        })
        .catch(() => {});
    },
    //核销操作单行
    enableState(id) {
      console.log(id);
      this.$confirm("您确定要核销选中商品订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.completeOrder({ idlst: [id] }, (res) => {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
            this.queryOrderList();
          });
        })
        .catch(() => {});
    },
    //核销操作单行多行
    setenableState(id, val) {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.completeOrder({ idlst: idlst }, (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.queryOrderList();
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.queryOrderList();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val; //.toString()
      this.resLoading = true;
      this.queryOrderList();
    },
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        this.queryOrderList();
      },
      deep: true,
    },
  },
};
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
    margin-bottom: 20px;
    span {
      display: inline-block;
      line-height: 30px;
      margin-left: 10px;
      background-color: rgba(64, 158, 255, 0.1);
      padding: 0 10px;
      font-size: 12px;
      color: #409eff;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid rgba(64, 158, 255, 0.2);
      white-space: nowrap;
    }

    .active {
      background-color: #409eff;
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
  .form {
    font-size: 18px;
    color: black;
  }
  .form > table > tr {
    height: 40px;
  }
  .refresh {
    margin-left: 80px;
    // float: right;
  }
}
.foot {
  float: right;
}
</style>
