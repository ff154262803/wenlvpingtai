<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入手机号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <div class="filter">
      <strong>时间：</strong>
      <el-date-picker
        v-model="query.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        @change="clearNullTime(query.time)"
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
      <el-table-column prop="propsId" label="道具ID" align="center">
      </el-table-column>
      <el-table-column prop="propsName" label="道具名" align="center">
      </el-table-column>
      <el-table-column prop="userName" label="用户" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center">
      </el-table-column>
      <el-table-column prop="bindTime" label="绑定时间" align="center">
      </el-table-column>
      <el-table-column label="绑定状态" align="center">
        <template slot-scope="scope">{{
          scope.row.bindStatus === "0" ? "未绑定" : "绑定"
        }}</template>
      </el-table-column>
      <el-table-column label="启用状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status === "0" ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="enableState1(scope.row.id, 1)"
            v-show="scope.row.status == 0"
            >启用</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState1(scope.row.id, 0)"
            v-show="scope.row.status == 1"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <el-button size="small" @click="enableState(1)">启用</el-button>
        <el-button size="small" @click="enableState(0)">禁用</el-button>
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
    return {
      total: 0,
      query: {
        page: 1,
        phone: "",
        count: 10,
        status: "",
        endDate: "",
        startDate: "",
        leaseresid: "",
        parkid: sessionStorage.getItem("parkid"),
      },
      tableData: [],
      multipleSelection: [],
    };
  },
  mounted() {
    this.queryPropsBind();
  },
  methods: {
    //查询
    queryPropsBind() {
      this.$ajax.queryPropsBind(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    //改变时间
    clearNullTime(time) {
      this.query.startDate = time ? time[0] : "";
      this.query.endDate = time ? time[1] : "";
      this.queryPropsBind();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //行内禁用
    enableState1(id, val) {
      this.$ajax.setStatus({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.queryPropsBind();
      });
    },
    //全部禁用
    enableState(val) {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "尚未选择任何内容!",
        });
      } else {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.setStatus({ idlst: idlst, isenable: val }, (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.queryPropsBind();
        });
      }
    },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.queryPropsBind();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val; //.toString()
      this.resLoading = true;
      this.queryPropsBind();
    },
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        this.queryPropsBind();
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
