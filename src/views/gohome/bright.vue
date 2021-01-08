<template>
  <div>
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入名称"
      v-model="query.condition"
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <div class="filter">
      <el-button class="addBtn" type="primary" @click="beginshow()"
        >添加亮点</el-button
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
      <el-table-column
        prop="title"
        label="名称"
        align="center"
      ></el-table-column>
      <el-table-column
        label="排序"
        prop="sort"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status == 1 ? "启用" : "禁用"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Del(scope.row.id)"
            >删除</el-button
          >
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
      <div style="position: absolute; left: 10px; top: 5px">
        <el-button @click="delAll()">删除</el-button>
        <el-button @click="setenableState(1)">启用</el-button>
        <el-button @click="setenableState(0)">禁用</el-button>
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
    <!--商品新增-->
    <div class="el-dialog__wrapper" v-show="Addshow">
      <div class="el-dialog el-dialogadd" style="width: 600px">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            newdata.nid ? "修改亮点" : "新增亮点"
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
            label-width="80px"
          >
            <el-form-item label="新闻" prop="id">
              <el-select
                v-model="newdata"
                value-key="title"
                @change="changehandle($event)"
                placeholder="请选择新闻标题"
              >
                <el-option
                  v-for="item in getNewsLists"
                  :key="item.id"
                  :label="item.title"
                  :value="{ id: item.id, title: item.title }"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input v-model="newdata.sort"></el-input>
            </el-form-item>
            <el-form-item label="详情类型" prop="status">
              <el-radio v-model="newdata.status" :label="1">启用</el-radio>
              <el-radio v-model="newdata.status" :label="0">禁用</el-radio>
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
  name: "list",
  data() {
    return {
      detailBol: false,
      //详情类型
      linktype: [],
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      query: {
        parkid: sessionStorage.getItem("parkid")
          ? sessionStorage.getItem("parkid")
          : "",
        condition: "",
        page: 1,
        count: 10,
      },
      Addshow: false,
      Detailshow: false,
      newdata: {
        id: "",
        sort: "",
        title: "",
        status: "",
      },
      rules: {
        //title: [{ required: true, message: '活动标题不能为空' }],
        sort: [{ required: true, message: "请输入排序" }],
      },
      headers: { Authorization: JSON.parse(sessionStorage.user).uKey },
      //新闻下拉列表
      getNewsLists: {},
    };
  },
  mounted() {
    window.v = this;
    this.getlist();
    this.getNewsList();
  },
  methods: {
    //添加弹框中的change事件
    //v-model传多个值
    changehandle(event) {
      console.log(event);
      this.newdata.id = event.id;
      this.newdata.title = event.title;
    },
    //详情
    detail(item) {
      this.detailBol = true;
      this.Addshow = true;
      this.newdata = item;
    },
    //底部分页栏
    handleSizeChange(val) {
      this.query.count = val;
      this.getlist();
    },
    //查找按钮
    search() {
      this.getlist();
    },
    //修改表单
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      if (data) {
        console.log("this.newdata", this.newdata);
        console.log("data", data);
        this.newdata.id = data.nid;
        this.newdata.nid = data.id;
        this.newdata.title = data.title;
        this.newdata.sort = data.sort;
        this.newdata.status = data.status;
      } else {
        this.newdata = {
          id: "",
          sort: "",
          status: 1,
        };
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
    },
    //删除
    Del(list) {
      if (!list.length) list = [list];
      this.$confirm("您确定要删除当前选中用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deleteHighLight({ idlst: list }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getlist();
          });
        })
        .catch(() => {});
      this.getlist();
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.newdata.parkId = sessionStorage.getItem("parkid") * 1;
          if (this.newdata.nid) {
            console.log("进入修改");
            this.$ajax.editHighLight(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              console.log("data", res.data);
              this.Addshow = false;
              this.getlist();
            });
            console.log("进入修改", this.newdata);
          } else {
            console.log("进入添加");
            this.$ajax.addHighLight(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.Addshow = false;
              this.getlist();
            });
          }
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.getlist();
    },
    //多选启用禁用
    setenableState(id, val) {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.openOrCloseHighLight(
          { idlst: idlst, status: val },
          (res) => {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
            this.getlist();
          }
        );
      }
    },
    //多选删除
    delAll() {
      if (this.multipleSelection.length != 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$confirm("您确定要删除选中商品吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$ajax.deleteHighLight({ idlst: idlst }, (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getlist();
            });
          })
          .catch(() => {});
      }
    },
    //获取亮点管理列表
    getlist() {
      this.$ajax.queryHighLightPage(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
        console.log("this.tableData", this.tableData);
        console.log("this.total", this.total);
      });
    },
    getNewsList() {
      this.$ajax.queryNewManage(this.query, (res) => {
        this.getNewsLists = res.data;
        console.log(this.getNewsLists, "this.getNewsLists");
      });
    },
    //当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style>
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}

.el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

#uppic {
  padding: 2px;
}
</style>
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

  .el-dialogadd {
    width: 500px;
    margin-top: 15vh;
  }

  .el-dialogedit {
    width: 1000px;
    margin-top: 15vh;
  }
}

.pic {
  position: relative;
  display: inline-block;
  height: 60px;
  width: 80px;
  margin-right: 10px;

  .close {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
  }
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>