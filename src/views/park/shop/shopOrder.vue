<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入手机号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <div class="filter">
      <strong>分类：</strong>
      <span
        @click="query.productClass = ''"
        :class="query.productClass == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="item in typeNamelist"
        :key="item"
        :class="query.productClass == item ? 'active' : ''"
        @click="query.productClass = item"
        >{{ item }}</span
      >
    </div>
    <div class="filter">
      <strong>时间：</strong>
      <el-date-picker
        v-model="query.createtime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="clearNullTime(query.createtime)"
      >
      </el-date-picker>
    </div>
    <div class="filter">
      <strong>状态：</strong>
      <span
        @click="query.completeStatus = ''"
        :class="query.completeStatus == '' ? 'active' : ''"
        >不限</span
      >
      <span
        @click="query.completeStatus = '0'"
        :class="query.completeStatus == '0' ? 'active' : ''"
        >待核销</span
      >
      <span
        @click="query.completeStatus = '1'"
        :class="query.completeStatus == '1' ? 'active' : ''"
        >已核销</span
      >
      <span
        @click="query.completeStatus = '2'"
        :class="query.completeStatus == '2' ? 'active' : ''"
        >已退款</span
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
      <el-table-column prop="orderno" label="订单号" align="center">
      </el-table-column>
      <el-table-column prop="caption" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="productClass" label="分类" align="center">
      </el-table-column>
      <el-table-column prop="userid" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center">
      </el-table-column>
      <el-table-column
        prop="createtime"
        label="下单时间"
        width="150"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="center">
      </el-table-column>
      <el-table-column prop="num" label="数量" align="center">
      </el-table-column>
      <el-table-column prop="system" label="注册平台" align="center">
      </el-table-column>
      <el-table-column prop="QRcode" label="提货码" align="center">
      </el-table-column>
      <el-table-column label="支付状态" prop="statusName" align="center">
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.completeStatus == "0"
            ? "待核销"
            : scope.row.completeStatus == "1"
            ? "已核销"
            : "已退款"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            :disabled="scope.row.completeStatus == 2 ? disabled : !disabled"
            >{{ scope.row.completeStatus == 2 ? "已退款" : "退款" }}</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id)"
            :disabled="
              scope.row.completeStatus == 2
                ? disabled
                : scope.row.completeStatus == 1
                ? disabled
                : !disabled
            "
            >{{ scope.row.completeStatus == 1 ? "已核销" : "核销" }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <el-button size="small">退款</el-button>
        <el-button size="small" @click="setenableState">核销</el-button>
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
      list: [],
      total: 0,
      addBol: false,
      GiveBackBol: false,
      leaseResIdList: [],
      serviceCenterIdList: [],
      unused: 0,
      disabled: true,
      detail: false,
      query: {
        page: 1,
        count: 10,
        parkid: sessionStorage.getItem("parkid"),
        completeStatus: "",
        condition: "",
        endDate: "",
        productClass: "",
        startDate: "",
      },
      rules: {
        leaseresid: [
          { required: true, message: "请选择物品", trigger: "change" },
        ],
        servicecenterid: [
          { required: true, message: "请选择地点", trigger: "change" },
        ],
        num: [
          {
            validator: (rule, val, callback) => {
              val ? callback() : callback(new Error("数量必须大于0"));
            },
            trigger: "change",
          },
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        number: [{ required: true, message: "请输入证件号", trigger: "blur" }],
        cash: [
          {
            type: "number",
            required: true,
            message: "请输入押金",
            trigger: "blur",
          },
        ],
      },
      addData: {},
      GiveBackData: {},
      tableData: [],
      multipleSelection: [],
    };
  },
  mounted() {
    this.queryOrderList();
    this.getLeaseResNames();
    this.getServiceCenterList();
    this.queryTypeList();
  },
  methods: {
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
        this.tableData = res.data;
        this.total = res.total;
        console.log("this.tableData", this.tableData);
      });
    },
    //获取物品
    getLeaseResNames() {
      this.$ajax.getLeaseResNames(
        { id: sessionStorage.getItem("parkid") },
        (res) => {
          this.leaseResIdList = res.data;
        }
      );
    },
    //获取服务中心
    getServiceCenterList() {
      this.$ajax.getServiceCenterList(
        { id: sessionStorage.getItem("parkid") },
        (res) => {
          this.serviceCenterIdList = res.data;
        }
      );
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
    //核销操作单行
    enableState(id) {
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
}
</style>
