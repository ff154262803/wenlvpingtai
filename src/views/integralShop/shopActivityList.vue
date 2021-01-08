<template>
  <div>
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入名称"
      v-model="query.condition"
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click="beginshow()"
      >添加活动</el-button
    >
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
        prop="activetitle"
        label="活动标题"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.account == 1 ? "启用" : "禁用"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="begintime"
        label="开始时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="endtime"
        label="结束时间"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)"
            >详情</el-button
          >
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 1)"
            v-show="scope.row.account == 0"
            >启用</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 0)"
            v-show="scope.row.account == 1"
            >禁用</el-button
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
      <div class="el-dialog el-dialogadd" style="width: 560px">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            newdata.id ? "修改活动" : "新增活动"
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
            label-width="120px"
          >
            <el-form-item label="活动标题" prop="activetitle">
              <el-input v-model="newdata.activetitle"></el-input>
            </el-form-item>
            <el-form-item label="开始结束时间" prop="time">
              <el-date-picker
                v-model="newdata.time"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="活动地址" prop="activeaddress">
              <el-input v-model="newdata.activeaddress"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="pictureurl">
              <el-input
                v-model="newdata.pictureurl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="uploading('uppict')"
                >点击上传</el-button
              >
              <el-upload
                class="upload-demo"
                style="display: none"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                accept="image/jpeg,image/jpg,image/png"
                :on-success="onsuccsess"
                :before-upload="beforeUploadpic"
                :on-error="onerror"
                list-type="picture"
              >
                <el-button size="small" type="primary" id="uppict"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <img
                  :src="newdata.pictureurl"
                  alt=""
                  class="pic"
                  v-if="newdata.pictureurl"
                  style="width: 80px"
                  ref="pic"
                />
              </div>
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
import TinymceEditor from "../../components/editor";
export default {
  name: "list",
  components: {
    TinymceEditor,
  },
  data() {
    return {
      fileList: [],
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
        account: "1",
        activeaddress: "",
        activetitle: "",
        begintime: "",
        endtime: "",
        pictureurl: "",
      },
      rules: {
        activetitle: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        activeaddress: [
          { required: true, message: "地址不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        pictureurl: [{ required: true, message: "必填项", trigger: "blur" }],

        videoPicture: [
          { required: true, message: "视频封面不能为空", trigger: "blur" },
        ],
        time: [
          { required: true, message: "起始日期不能为空", trigger: "blur" },
        ],
      },
      sitelist: [],
      h5: {
        content: "",
      },
    };
  },
  mounted() {
    window.v = this;
    this.queryActiveList();
    this.getsitelist();
  },
  methods: {
    close(i) {
      this.fileList.splice(i, 1);
      this.newdata.pictureurl = this.fileList.join();
    },
    detail(data) {
      this.Addshow = true;
      this.Detailshow = false;
      this.newdata = { ...data };
      this.fileList = data.pictureurl.split(",");
      this.$set(this.newdata, "time", [
        new Date(
          data.begintime.split("-")[0],
          data.begintime.split("-")[1],
          data.begintime.split("-")[2].split(" ")[0],
          data.begintime.split(" ")[1].split(":")[0],
          data.begintime.split(" ")[1].split(":")[1],
          data.begintime.split(" ")[1].split(":")[2]
        ),
        new Date(
          data.endtime.split("-")[0],
          data.endtime.split("-")[1],
          data.endtime.split("-")[2].split(" ")[0],
          data.endtime.split(" ")[1].split(":")[0],
          data.endtime.split(" ")[1].split(":")[1],
          data.endtime.split(" ")[1].split(":")[2]
        ),
      ]);
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.queryActiveList();
    },
    timeform: function (format, time) {
      //转化时间格式传输给后台
      var d = new Date(time);
      var date = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S+": d.getMilliseconds(),
      };
      // 正则替换文本
      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (d.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? date[k]
              : ("00" + date[k]).substr(("" + date[k]).length)
          );
        }
      }
      return format;
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    beforeUploadpic(file) {
      const isLt5M = file.size / 1024 / 1024 < 10;
      const accept =
        file.type.indexOf("jpeg") > -1 ||
        file.type.indexOf("png") > -1 ||
        file.type.indexOf("jpg") > -1;
      const limit = this.fileList.length < 10;
      if (!accept) this.$message.error("上传文件只能是图片格式!");
      if (!isLt5M) this.$message.error("上传文件大小不能超过 5MB!");
      if (!limit) this.$message.error("最多上传10张图片！");
      return accept && isLt5M && limit;
    },
    onsuccsesspic(response, file, fileList) {
      if (this.fileList.length < 10 && response.resb == 200) {
        this.fileList.push(response.data.url);
        this.newdata.pictureurl = this.fileList.join();
        this.fullscreenLoading = false;
      } else {
        this.$message.error("最多上传10个");
      }
    },
    onremove(file, fileList) {
      console.log(file);
    },
    uploading(id) {
      document.getElementById(id).click();
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resb == 200) {
        this.$set(this.newdata, "pictureurl", response.data.url);
      }
    },
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resb == 200) {
        this.$set(this.newdata, "videoPicture", response.data.url);
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    search() {
      this.queryActiveList();
    },
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      if (data) {
        this.newdata = { ...data };
        console.log("this.newdata", this.newdata);
        this.fileList = data.pictureurl.split(",");
        this.$set(this.newdata, "time", [
          new Date(
            data.begintime.split("-")[0],
            data.begintime.split("-")[1],
            data.begintime.split("-")[2].split(" ")[0],
            data.begintime.split(" ")[1].split(":")[0],
            data.begintime.split(" ")[1].split(":")[1],
            data.begintime.split(" ")[1].split(":")[2]
          ),
          new Date(
            data.endtime.split("-")[0],
            data.endtime.split("-")[1],
            data.endtime.split("-")[2].split(" ")[0],
            data.endtime.split(" ")[1].split(":")[0],
            data.endtime.split(" ")[1].split(":")[1],
            data.endtime.split(" ")[1].split(":")[2]
          ),
        ]);
      } else {
        this.fileList = [];
        this.newdata = {
          // account: "1",
          // activeaddress: "",
          // activetitle: "",
          // begintime: "",
          // endtime: "",
          // pictureurl: "",
        };
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.time[0]) {
            this.newdata.begintime = this.timeform(
              "yyyy-MM-dd hh:mm:ss",
              this.newdata.time[0]
            );
          }
          if (this.newdata.time[1]) {
            this.newdata.endtime = this.timeform(
              "yyyy-MM-dd hh:mm:ss",
              this.newdata.time[1]
            );
          }
          if (this.newdata.id) {
            this.$ajax.editActive(
              { id: this.newdata.id, parameters: { ...this.newdata } },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.Addshow = false;
                this.queryActiveList();
              }
            );
          } else {
            this.$ajax.addMallActive(this.newdata, (res) => {
              console.log("newdata", this.newdata);
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.Addshow = false;
              this.queryActiveList();
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
      this.queryActiveList();
    },
    enableState(id, val) {
      this.$ajax.status({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.queryActiveList();
      });
    },
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
            this.$ajax.deleteActive({ idlst: idlst }, (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.queryActiveList();
            });
          })
          .catch(() => {});
      }
    },
    //查询列表
    queryActiveList() {
      this.$ajax.queryActiveList(this.query, (res) => {
        console.log("res", res.data);
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    getsitelist() {
      this.$ajax.querySiteList(
        {
          count: 999,
          page: 1,
          parkid: sessionStorage.getItem("parkid"),
          typelist: [6],
        },
        (res) => {
          this.sitelist = res.data;
        }
      );
    },
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
.addBtn {
  float: right;
  margin-right: 100px;
  margin-bottom: 30px;
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
</style>
