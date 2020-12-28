<template>
  <div>
    <!-- 过滤区 -->
    <div class="filter">
      <el-button class="addBtn" type="primary" @click="beginshow()"
        >添加</el-button
      >
    </div>
    <!-- 表格区 -->
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
      <el-table-column prop="caption" label="类型名"></el-table-column>
      <el-table-column label="地址" prop="link"></el-table-column>
      <el-table-column prop="updatetime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--底部工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="display: flex; justify-content: flex-end; position: relative"
    >
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :page-size="query.count"
        :total="total"
      >
      </el-pagination>
      <el-button size="small">确定</el-button>
    </el-col>
    <!--页面链接新增-->
    <div class="el-dialog__wrapper" v-show="Addshow">
      <div class="el-dialog">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            newdata.id ? "修改链接" : "添加链接"
          }}</span>
          <button
            class="el-dialog__headerbtn"
            aria-label="Close"
            type="button"
            @click="cancel('newdata')"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-form
            :model="newdata"
            :rules="rules"
            ref="newdata"
            label-width="100px"
          >
            <el-form-item label="地址" prop="link">
              <el-input v-model="newdata.link"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="type">
              <el-select v-model="newdata.type">
                <el-option
                  :label="n.typeName"
                  :value="n.id"
                  :key="n.id"
                  v-for="n in typelist"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button @click="cancel('newdata')">取 消</el-button>
            <el-button type="primary" @click="add('newdata')">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      typelist: [],
      query: {
        condition: "",
        type: 0,
        page: 1,
        count: 10,
      },
      Addshow: false,
      newdata: {},
      rules: {
        link: [
          { required: true, message: "请输入地址名", trigger: "blur" },
          { max: 100, message: "最多100个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.get();
    this.gettypelist();
  },
  methods: {
    beginshow(data) {
      this.Addshow = true;
      if (data) {
        this.newdata = { ...data };
      } else {
        this.newdata = {};
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.newdata = {};
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.id) {
            this.$ajax.updatePageLink(
              {
                id: this.newdata.id,
                parameters: {
                  link: this.newdata.link,
                  type: this.newdata.type,
                },
              },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.Addshow = false;
                this.get();
              }
            );
          } else {
            this.newdata.parkId = 0;
            this.$ajax.addPageLink(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.Addshow = false;
              this.get();
            });
          }
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val.toString();
      this.get();
    },
    get() {
      this.$ajax.queryPageLinkList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
        console.log("tableData", res.data);
      });
    },
    gettypelist() {
      this.$ajax.queryTypeList({ count: 999, page: 1, groupId: 4 }, (res) => {
        this.typelist = res.data;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style lang="scss" scoped>
.filter {
  position: relative;
  height: 50px;
}
.addBtn {
  float: right;
  margin-right: 100px;
}
.el-dialog__wrapper {
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  .el-dialog {
    width: 400px;
    margin-top: 15vh;
  }
}
</style>
