<template>
  <div>
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
      <el-table-column prop="caption" label="标题"></el-table-column>
      <el-table-column label="景点" prop="siteName"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{
          scope.row.isenable == 1 ? "已启用" : "已禁用"
        }}</template>
      </el-table-column>
      <el-table-column prop="picurl" label="地址"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >修改</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 1)"
            v-show="scope.row.isenable == 0"
            >启用</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 0)"
            v-show="scope.row.isenable == 1"
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
      <div class="el-dialog el-dialogadd">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            newdata.id ? "修改全景图" : "新增全景图"
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
            <el-form-item label="名称" prop="caption">
              <el-input v-model="newdata.caption"></el-input>
            </el-form-item>
            <el-form-item label="场馆" prop="site">
              <el-select v-model="newdata.site">
                <el-option
                  v-for="item in sitelist"
                  :label="item.caption"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="缩略图" prop="picurl">
              <el-input
                v-model="newdata.picurl"
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
                  :src="$store.state.resip + newdata.picurl"
                  alt=""
                  class="pic"
                  v-if="newdata.picurl"
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
export default {
  name: "list",
  data() {
    return {
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      tableData: [],
      multipleSelection: [],
      sitelist: [],
      total: 0,
      query: {
        parkid: sessionStorage.getItem("parkid"),
        page: 1,
        count: 10,
      },
      Addshow: false,
      Detailshow: false,
      newdata: {},
      rules: {
        caption: [
          { required: true, message: "必填项" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        site: [{ required: true, message: "请选择类型", trigger: "change" }],
        picurl: [{ required: true, message: "必填项" }],
      },
    };
  },
  mounted() {
    this.getlist();
    this.getsitelist();
  },
  methods: {
    uploading(id) {
      document.getElementById(id).click();
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
    enableState(id, val) {
      this.$ajax.setPanoramaEnableState(
        { idlst: [id], isenable: val },
        (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.getlist();
        }
      );
    },
    setenableState(val) {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.setPanoramaEnableState(
          { idlst: idlst, isenable: val },
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
            this.$ajax.deletePanorama({ idlst: idlst }, (res) => {
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
    beforeUploadpic(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      const accept =
        file.type.indexOf("jpeg") > -1 ||
        file.type.indexOf("png") > -1 ||
        file.type.indexOf("jpg") > -1;
      if (!accept) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return accept && isLt5M;
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "picurl", response.shortUrl);
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.getlist();
    },
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      this.fileList1 = [];
      if (data) {
        this.newdata = { ...data };
        this.newdata.site = data.siteid;
        this.fileList1 = [
          { url: this.$store.state.resip + data.picurl, shortUrl: data.picurl },
        ];
      } else {
        this.newdata = {};
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
      this.newdata = {};
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.id) {
            let data = {
              caption: this.newdata.caption,
              picurl: this.newdata.picurl,
              siteid: this.newdata.site,
            };
            this.$ajax.updatePanorama(
              { id: this.newdata.id, parameters: data },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.Addshow = false;
                this.getlist();
              }
            );
          } else {
            let data = {
              caption: this.newdata.caption,
              picurl: this.newdata.picurl,
              siteid: this.newdata.site,
            };
            this.$ajax.addPanorama(data, (res) => {
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
    getlist() {
      this.$ajax.queryPanoramaList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    // 分页相关
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.getlist();
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
  .el-dialogadd {
    width: 520px;
    margin-top: 15vh;
  }
  .el-dialogedit {
    width: 1000px;
    margin-top: 15vh;
  }
}
</style>