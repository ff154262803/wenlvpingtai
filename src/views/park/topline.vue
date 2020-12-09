<template>
  <div class="classificationPage">
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入标题"
      v-model="query.title"
      style="width: 300px"
      clearable
      @clear="queryParkNoticeList"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click="addBtn"
      >发布公告</el-button
    >
    <br />
    <div class="screenTime">
      <span class="demonstration">时间：</span>
      <el-date-picker
        v-model="changeTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="clearNullTime"
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
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="title" label="标题" width="200"> </el-table-column>
      <el-table-column label="内容" width="300">
        <template slot-scope="scope">
          <p style="cursor: pointer" @click="Detail(scope.row)">
            {{ scope.row.content }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="starttime" label="有效期" width="200">
        <template slot-scope="scope">{{
          scope.row.starttime + "—" + scope.row.endtime
        }}</template>
      </el-table-column>
      <el-table-column prop="createtime" label="发布时间"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{
          scope.row.isenable == 0 ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Detail(scope.row, true)"
            >复制重发</el-button
          >
          <el-button type="text" size="small" @click="seeNew(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <el-button size="small" @click="Del()">删除</el-button>
        <el-button @click="enableState(1)">启用</el-button>
        <el-button @click="enableState(0)">禁用</el-button>
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
    <!--弹窗内容-->
    <div class="el-dialog__wrapper" v-show="addBol">
      <div class="el-dialog el-dialogedit">
        <div class="el-dialog__header">
          <span class="el-dialog__title">发布公告</span>
          <button
            class="el-dialog__headerbtn"
            aria-label="Close"
            type="button"
            @click="reset('')"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-form :model="addData" :rules="rules" ref="addData">
            <el-form-item label="标题" label-width="65px" prop="title">
              <el-input v-model="addData.title" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="有效期" label-width="65px" prop="time">
              <el-date-picker
                v-model="addData.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="内容" label-width="65px" prop="content">
              <el-input
                v-model="addData.content"
                style="width: 350px"
              ></el-input>
            </el-form-item>
            <el-form-item label="详情" label-width="65px" prop="h5id">
              <div style="height: 500px">
                <tinymce-editor
                  ref="editor"
                  v-model="h5.content"
                ></tinymce-editor>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button @click="reset('addData')">取 消</el-button>
            <el-button type="primary" v-if="detail1" @click="submit('addData')"
              >确 定</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TinymceEditor from "../../components/editor";

export default {
  name: "list",
  components: {
    TinymceEditor,
  },
  data() {
    return {
      total: 0,
      addBol: false,
      detail1: true,
      query: {
        title: "",
        startDate: "",
        endDate: "",
        parkid: sessionStorage.getItem("parkid"),
        page: 1,
        count: 10,
      },
      rules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            max: 20,
            message: "最多20个字符",
            trigger: "blur",
          },
        ],
        time: [{ required: true, message: "请选择时间", trigger: "blur" }],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            max: 50,
            message: "最多50个字符",
            trigger: "blur",
          },
        ],
        siteid: [
          { required: true, message: "请选择商家名称", trigger: "change" },
        ],
      },
      addData: {},
      tableData: [],
      multipleSelection: [],
      h5: {
        caption: "",
        content: "",
      },
      changeTime: [],
      newdata: {
        isenable: "1",
        //"parkid": sessionStorage.getItem('parkid')
      },
    };
  },
  mounted() {
    this.queryParkNoticeList();
  },
  methods: {
    //启用 禁用按钮
    enableState(val) {
      if (this.multipleSelection.length != 0) {
        let idlst = [];
        console.log(this.multipleSelection);
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.setRouteEnableState(
          { idlst: idlst, isenable: val },
          (res) => {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
            this.get();
          }
        );
      }
    },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.queryParkNoticeList();
    },
    //添加公告
    addBtn() {
      this.addBol = true;
      this.addData = {};
      this.h5.content = "";
    },
    //详情或者复制重发
    Detail(data, detail1) {
      this.getH5Details(data.h5id, (res) => {
        this.h5 = res;
      });
      this.detail1 = !!detail1;
      this.addBol = true;
      this.addData = { ...data };
      this.$set(this.addData, "time", [data.starttime, data.endtime]);
    },
    seeNew(data) {
      this.getH5Details(data.h5id, (res) => {
        var OpenWindow = window.open("", "newwin", "toolbar=no,menubar=no");
        OpenWindow.document.write("<HTML>");
        OpenWindow.document.write("<TITLE>富文本内容</TITLE>");
        OpenWindow.document.write("<BODY>");
        OpenWindow.document.write(res.content);
        OpenWindow.document.write("</BODY>");
        OpenWindow.document.write("</HTML>");
      });

      // OpenWindow.document.close();
    },
    // //修改时间
    // chooseDate(time){
    //     this.addData.time = time;
    // },
    //关闭
    reset(formName) {
      this.addBol = false;
      this.detail1 = true;
      this.addData = {};
    },
    //查询内容
    queryParkNoticeList() {
      this.$ajax.queryParkNoticeList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    //确定上传
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.h5.content) {
            this.$ajax.addH5(this.h5, (res) => {
              if (res.resb == 200) {
                this.addData.h5id = res.data.id;
                this.addData.starttime = this.addData.time[0];
                this.addData.endtime = this.addData.time[1];
                this.addData.parkid = sessionStorage.getItem("parkid");

                this.$ajax.addParkNotice(this.addData, (res) => {
                  this.$message({
                    type: "success",
                    message: "添加成功!",
                  });
                  this.queryParkNoticeList();
                  this.addBol = false;
                });
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "请填写富文本内容!",
            });
          }
        } else {
          return false;
        }
      });
    },
    //清除时间
    clearNullTime() {
      this.query.startDate = this.changeTime ? this.changeTime[0] : "";
      this.query.endDate = this.changeTime ? this.changeTime[1] : "";
      this.queryParkNoticeList();
    },
    search() {
      this.queryParkNoticeList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map((n) => n.id);
    },
    Del(id) {
      this.$confirm("您确定要删除该类型吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deleteParkNotice(
            { idlst: this.multipleSelection },
            (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.queryParkNoticeList();
            }
          );
        })
        .catch(() => {});
    },

    //获取H5内容
    getH5Details(id, callback) {
      this.$ajax.getH5Details({ id: id }, function (res) {
        callback(res.data);
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.queryParkNoticeList();
    },
  },
};
</script>

<style scoped lang="scss">
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

.classificationPage {
  .btn {
    margin-left: 20px;
  }

  .addBtn {
    float: right;
    margin-right: 100px;
  }

  .screenTime {
    padding: 20px 0;
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
