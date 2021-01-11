<template>
  <div class="classificationPage">
    <el-input
      placeholder="用户名、账号"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <span>类型：</span>
    <el-select placeholder="全部类型" v-model="query">
      <el-option
        v-for="n in eventdata"
        :key="n.id"
        :label="n.caption"
        :value="n.id"
      ></el-option>
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
      <el-table-column prop="num" label="积分数量" align="center">
      </el-table-column>
      <el-table-column prop="parcularsType" label="类型" align="center">
      </el-table-column>
      <el-table-column prop="intro" label="说明" align="center">
      </el-table-column>
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
        type: 1,
      },
      multipleSelection: [],
      eventdata: [],
    };
  },
  mounted() {
    this.scoreList();
  },
  methods: {
    scoreList() {
      console.log(this.query);
      this.$ajax.scoreList(this.query, (res) => {
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
