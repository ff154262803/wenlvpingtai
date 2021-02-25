<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入手机号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" circle></el-button>
    <el-input
      placeholder="请输入商品名"
      v-model="query.condition"
      clearable
      style="width: 300px; margin-left: 30px"
    ></el-input>
    <el-button icon="el-icon-search" circle></el-button>
    <el-button class="refresh" type="primary" @click="refresh">刷新</el-button>
    <div class="filter">
      <strong>支付类型：</strong>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <strong style="margin-left: 80px">订单日期：</strong>
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
    <div class="filter">
      <strong>订单状态：</strong>
      <span
        @click="query.status = ''"
        :class="query.status == '' ? 'active' : ''"
        >全部</span
      >
      <span
        @click="query.status = '05'"
        :class="query.status == '05' ? 'active' : ''"
        >待付款</span
      >
      <span
        @click="query.status = '01'"
        :class="query.status == '01' ? 'active' : ''"
        >已取消</span
      >
      <span
        @click="query.status = '04'"
        :class="query.status == '04' ? 'active' : ''"
        >待取货</span
      >
      <span
        @click="query.status = '10'"
        :class="query.status == '10' ? 'active' : ''"
        >已取货</span
      >
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
      <el-table-column prop="orderNo" label="订单号" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center">
      </el-table-column>
      <el-table-column prop="caption" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="productClass" label="支付类型" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="交易单价" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="交易量" align="center">
      </el-table-column>
      <el-table-column prop="amount" label="总价" align="center">
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status == "01"
            ? "待核销"
            : scope.row.status == "10"
            ? "退款中"
            : scope.row.status == "05"
            ? "已核销"
            : scope.row.status == "04"
            ? "已退款"
            : ""
        }}</template>
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="150"
        align="center"
      >
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            type="text"
            size="small"
            v-if="isadmin == true"
            @click="refund(scope.row.orderNo)"
            :disabled="scope.row.status == '05' ? !disabled : disabled"
            >退款</el-button
          > -->
          <el-button type="text" size="small" @click="enableState(scope.row.id)"
            >核销</el-button
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
    <el-dialog title="订单详情" :visible.sync="detail" width="1000px">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="form"
      >
        <table border="1" cellspacing="0" width="800px" align="center">
          <tr style="background-color: #9d9d9d">
            <td colSpan="4">商品属性</td>
          </tr>
          <tr style="background-color: #bbbbbb">
            <td align="center">商品名称</td>
            <td align="center">单价</td>
            <td align="center">购买数量</td>
            <td align="center">小计</td>
          </tr>
          <tr>
            <td align="center">{{ formData.caption }}</td>
            <td align="center">{{ formData.amount + "元" }}</td>
            <td align="center">{{ formData.num }}</td>
            <td align="center">{{ formData.amount }}</td>
          </tr>
        </table>
        <table
          border="1"
          cellspacing="0"
          width="800px"
          align="center"
          style="margin-top: 30px"
        >
          <tr>
            <td colSpan="4" style="background-color: #9d9d9d">订单信息</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">买家：</td>
            <td align="center">{{ formData.username }}</td>
            <td align="center" style="background-color: #bbbbbb">订单编号：</td>
            <td align="center">{{ formData.orderNo }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">
              买家手机号：
            </td>
            <td align="center">{{ formData.mobile }}</td>
            <td align="center" style="background-color: #bbbbbb">下单时间：</td>
            <td align="center">{{ formData.updatetime }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">支付类型：</td>
            <td align="center">{{ formData.mobile }}</td>
            <td align="center" style="background-color: #bbbbbb">支付状态：</td>
            <td align="center">{{ formData.updatetime }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">订单状态：</td>
            <td align="center">{{ formData.mobile }}</td>
            <td align="center" style="background-color: #bbbbbb">取货时间：</td>
            <td align="center">{{ formData.updatetime }}</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">取货码：</td>
            <td colSpan="3" align="center">暂无</td>
          </tr>
          <tr>
            <td align="center" style="background-color: #bbbbbb">备注：</td>
            <td colSpan="3" align="center">暂无</td>
          </tr>
        </table>
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
      typeNamelist: [], //商品分类名称
      total: 0,
      unused: 0,
      disabled: true,
      detail: false,
      query: {
        page: 1,
        count: 10,
        // parkid: sessionStorage.getItem("parkid"),
        status: "",
        condition: "",
        endDate: "",
        productClass: "",
        startDate: "",
      },
      addData: {},
      GiveBackData: {},
      formData: {},
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
      this.$ajax.queryOrderList(this.query, (res) => {
        console.log(res.data);
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
  .refresh {
    margin-left: 80px;
    // float: right;
  }
}
</style>
