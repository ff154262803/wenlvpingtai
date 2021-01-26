<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入手机号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <span>类型：</span>
    <el-select
      placeholder="请选择"
      @change="search"
      clearable
      v-model="query.type"
      @clear="setValueNull"
    >
      <el-option value=" " label="不限"></el-option>
      <el-option value="1" label="奖励"></el-option>
      <el-option value="2" label="兑换"></el-option>
    </el-select>
    <!--表格内容-->
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="userName" label="用户名" align="center">
      </el-table-column>
      <el-table-column prop="account" label="手机号" align="center">
      </el-table-column>
      <el-table-column label="积分数量" align="center">
        <template slot-scope="scope">{{
          scope.row.addOrReduce == 1
            ? "+ " + scope.row.num
            : "- " + scope.row.num
        }}</template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{
          scope.row.addOrReduce == 1 ? "奖励" : "兑换"
        }}</template>
      </el-table-column>
      <!-- <el-table-column prop="intro" label="说明" align="center">
      </el-table-column> -->
      <el-table-column label="创建时间" prop="createtime" align="center">
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        background
        layout="total,sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 20, 30, 50]"
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
  name: "classificationPage",
  data() {
    return {
      total: 0,
      dataList: [],
      query: {
        condition: "",
        page: 1,
        size: 10,
        type: " ",
      },
      multipleSelection: [],
    };
  },
  mounted() {
    this.scoreList();
  },
  methods: {
    setValueNull() {
      this.query.type = " ";
    },
    scoreList() {
      this.$ajax.scoreList(this.query, (res) => {
        console.log("res", res.data);
        this.dataList = res.data;
        this.total = res.total;
      });
    },
    search() {
      this.query.page = 1;
      this.scoreList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.query.page = 1;
      this.scoreList();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val.toString();
      this.resLoading = true;
      this.scoreList();
    },
  },
};
</script>

<style scoped lang="scss">
.classificationPage {
  .btn {
    margin: 0 20px;
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
}
</style>
