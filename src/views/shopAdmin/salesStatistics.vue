<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入商品名称"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button class="refresh" type="primary" @click="refresh">刷新</el-button>
    <div class="filter">
      <strong>统计时间：</strong>
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
      <el-table-column prop="mallName" label="商品名称" align="center">
      </el-table-column>
      <el-table-column prop="mallType" label="商品分类" align="center">
      </el-table-column>
      <el-table-column prop="orderNum" label="日销量" align="center">
      </el-table-column>
      <el-table-column prop="total" label="总销量" align="center">
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <!-- <el-button size="small">退款</el-button> -->
        <!-- <el-button size="small" @click="">导出</el-button> -->
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
      total: 0,
      unused: 0,
      disabled: true,
      detail: false,
      query: {
        // page: 1,
        // count: 10,
        condition: "",
        endTate: "",
        productClass: "",
        startDate: "",
      },
      addData: {},
      GiveBackData: {},
      tableData: [],
      multipleSelection: [],
      isadmin: JSON.parse(sessionStorage.getItem("user")).isadmin,
    };
  },
  mounted() {
    // this.queryTypeList();
    this.sales();
  },
  methods: {
    //刷新
    refresh() {
      this.sales();
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
    sales() {
      this.$ajax.sales(this.query, (res) => {
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
      this.query.endTate = time ? time[1] : "";
      this.sales();
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
            this.sales();
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
            this.sales();
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
          this.sales();
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.sales();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val; //.toString()
      this.resLoading = true;
      this.sales();
    },
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        this.sales();
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
.refresh {
  float: right;
  margin-right: 100px;
}
</style>
