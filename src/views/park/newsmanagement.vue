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
        >添加新闻</el-button
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
        label="新闻标题"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status == 1 ? "启用" : "禁用"
        }}</template>
      </el-table-column>
      <el-table-column
        label="简介"
        prop="summary"
        align="center"
      ></el-table-column>
      <el-table-column label="详情类型" align="center">
        <template slot-scope="scope">{{
          scope.row.detailType == 1 ? "链接" : "编辑器"
        }}</template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 1)"
            v-show="scope.row.status == 0"
            >启用
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 0)"
            v-show="scope.row.status == 1"
            >禁用
          </el-button>
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="Del(scope.row.id)"
            >删除</el-button
          >
          <!-- <el-button type="text" size="small" @click="detail(scope.row)"
            >详情</el-button
          > -->
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
      <div class="el-dialog el-dialogadd" style="width: 1000px">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            detailBol ? "新闻详情" : newdata.id ? "修改新闻" : "新增新闻"
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
            <el-form-item label="标题" prop="title">
              <el-input
                v-model="newdata.title"
                style="width: 600px"
                :disabled="detailBol"
              ></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                v-model="newdata.summary"
                style="width: 600px"
                :disabled="detailBol"
              ></el-input>
            </el-form-item>
            <el-form-item label="请选择类型" prop="banner">
              <el-radio-group v-model="newdata.banner">
                <el-radio :label="1">轮播图</el-radio>
                <el-radio :label="2">视频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="轮播图"
              label-width="120px"
              prop="picurl"
              v-if="newdata.banner == 1"
            >
              <el-input
                v-model="newdata.picurl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button size="small" type="primary" @click="uploading('uppic')"
                >点击上传</el-button
              >
              <el-upload
                :disabled="detailBol"
                class="upload-demo"
                style="display: none"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                :on-success="onsuccsesspic"
                accept="image/jpeg,image/jpg,image/png"
                :before-upload="beforeUploadpic"
                :on-error="onerror"
                multiple
                list-type="picture-card"
              >
                <el-button size="small" type="primary" id="uppic"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <div
                  class="pic"
                  v-for="(n, i) in fileList"
                  :key="n"
                  v-if="fileList.length"
                >
                  <img :src="n" alt="" class="pic" />
                  <img
                    :disabled="detailBol"
                    src="../../../static/img/close.png"
                    alt=""
                    class="close"
                    @click="close(i)"
                  />
                </div>
              </div>
            </el-form-item>
            <!-- <el-form-item label="语音讲解" prop="voiceUrl">
              <el-input
                v-model="newdata.voiceUrl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button size="small" type="primary" @click="uploading('upmp3')"
                >点击上传</el-button
              >
              <el-upload
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                accept=".mp3"
                :data="uploaddata"
                :on-success="onsuccsessmp3"
                :on-progress="handleLoading"
                :before-upload="beforeUploadmp3"
                :disabled="detailBol"
                style="display: none"
              >
                <el-button size="small" type="primary" id="upmp3"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px" v-if="newdata.voiceUrl != ''">
                {{ newdata.voiceUrl }}
                <img
                  src="../../../static/img/del.png"
                  alt=""
                  style="width: 25px"
                  @click="deling('voiceurl')"
                  v-if="newdata.voiceUrl != ''"
                />
              </div>
            </el-form-item> -->
            <el-form-item
              label="视频讲解"
              prop="videoUrl"
              v-if="newdata.banner == 2"
            >
              <el-input
                v-model="newdata.voiceUrl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button size="small" type="primary" @click="uploading('upmp4')"
                >点击上传</el-button
              >
              <el-upload
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :data="uploaddata"
                :on-progress="handleLoading1"
                :show-file-list="true"
                accept="video/mp4"
                :on-success="onsuccsessmp4"
                :before-upload="beforeUploadmp4"
                :disabled="detailBol"
                style="display: none"
              >
                <el-button size="small" type="primary" id="upmp4"
                  >点击上传</el-button
                >
              </el-upload>
              <el-progress
                v-if="fullscreenLoading == true"
                :percentage="uploadRate"
                type="line"
                style="width: 600px"
              ></el-progress>
              <div style="margin-top: 20px" v-if="newdata.videoUrl != ''">
                {{ newdata.videoUrl }}
                <img
                  src="../../../static/img/del.png"
                  alt=""
                  style="width: 25px"
                  @click="deling('videoUrl')"
                  v-if="newdata.videoUrl != ''"
                />
              </div>
            </el-form-item>
            <el-form-item
              label="视频封面"
              prop="videoPicture"
              v-if="newdata.banner == 2"
            >
              <el-input
                v-model="newdata.videoPicture"
                style="width: 200px; display: none"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="uploading('uppict1')"
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
                :on-success="onsuccsess1"
                :before-upload="beforeUploadpic"
                :on-error="onerror"
                list-type="picture"
              >
                <el-button size="small" type="primary" id="uppict1"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <img
                  :src="newdata.videoPicture"
                  alt=""
                  class="pic"
                  v-if="newdata.videoPicture"
                  style="width: 80px"
                  ref="pic"
                />
              </div>
            </el-form-item>
            <el-form-item label="缩略图" prop="thumbnail">
              <el-input
                v-model="newdata.thumbnail"
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
                  :src="newdata.thumbnail"
                  alt=""
                  class="pic"
                  v-if="newdata.thumbnail"
                  style="width: 80px"
                  ref="pic"
                />
              </div>
            </el-form-item>
            <el-form-item
              label="详情类型"
              prop="detailType"
              :disabled="detailBol"
            >
              <el-radio-group
                v-model="newdata.detailType"
                @change="agreeChange"
              >
                <el-radio :label="1" :disabled="detailBol">链接</el-radio>
                <el-radio :label="2" :disabled="detailBol">编辑器</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="详情链接"
              prop="details"
              v-if="newdata.detailType == 1"
            >
              <el-input
                v-model="newdata.details"
                style="width: 600px"
                :disabled="detailBol"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="详情"
              prop="details"
              v-model="newdata.details"
              v-if="newdata.detailType == 2"
            >
              <div style="height: 500px">
                <tinymce-editor
                  ref="editor"
                  v-model="h5.content"
                  :disabled="detailBol"
                ></tinymce-editor>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-dialog__footer" v-if="!detailBol">
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
import TinymceEditor from "@/components/editor";
export default {
  name: "list",
  components: {
    TinymceEditor,
  },
  data() {
    return {
      uploadRate: 0,
      mp3List: [],
      detailBol: false,
      //详情类型
      linktype: [],
      fileList: [],
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      tableData: [],
      multipleSelection: [],
      total: 0,
      query: {
        parkId: sessionStorage.getItem("parkid")
          ? sessionStorage.getItem("parkid") * 1
          : "",
        condition: "",
        page: 1,
        count: 10,
      },
      Addshow: false,
      Detailshow: false,
      newdata: {
        banner: 1,
        detailType: 1,
        details: "",
        parkId: sessionStorage.getItem("parkid")
          ? sessionStorage.getItem("parkid")
          : "",
        picurl: "",
        status: 1,
        summary: "",
        thumbnail: "",
        videoPicture: "",
        title: "",
        videoUrl: "",
        voiceUrl: "",
      },
      rules: {
        title: [
          { required: true, message: "活动标题不能为空", trigger: "blur" },
        ],
        summary: [{ required: true, message: "简介不能为空", trigger: "blur" }],
        picurl: [{ required: true, message: "简介不能为空", trigger: "blur" }],
        detailType: [
          { required: true, message: "请选择详情类型", trigger: "blur" },
        ],
        // details: [{ required: true, message: "详情不能为空", trigger: "blur" }],
      },
      headers: { Authorization: JSON.parse(sessionStorage.user).uKey },
      sitelist: [],
      h5: {
        content: "",
      },
      fullscreenLoading: false,
    };
  },
  mounted() {
    window.v = this;
    this.getlist();
  },
  methods: {
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resb == 200) {
        this.$set(this.newdata, "videoPicture", response.data.url);
      }
    },
    agreeChange() {
      if (this.newdata.detailType == 1) {
        this.newdata.details = "";
      } else {
        this.h5.content = "";
      }
      console.log("cccccc");
    },
    //文件上传成功
    uploadResource() {
      this.$ajax.uploadResource({}, (res) => {
        //this.roleList = res.data;
        console.log("res", res);
      });
    },
    //上传mp3文件之前的钩子函数
    beforeUploadmp3(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;

      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 50MB!");
      }
      return isLt50M;
    },
    //上传mp3文件成功的钩子函数
    onsuccsessmp3(response, file, fileList) {
      this.newdata.voiceUrl = response.data.url;
    },
    deling(val) {
      if (val == "voiceurl") {
        this.newdata.voiceUrl = "";
      }
      if (val == "videoUrl") {
        this.newdata.videoUrl = "";
        if (this.newdata.videoUrl == "") {
          this.fullscreenLoading = false;
        }
      }
    },
    //上传图片成功后的钩子函数
    onsuccsesspic(response, file, fileList) {
      console.log("pic", this.fileList);
      if (this.fileList.length < 10 && response.resb == 200) {
        this.fileList.push(response.data.url);
        this.newdata.picurl = this.fileList.join();
        this.fullscreenLoading = false;
      } else {
        this.$message.error("最多上传10个");
      }
    },
    //上传mp4文件之前的钩子函数
    beforeUploadmp4(file) {
      const isLt50M = file.size / 1024 / 1024 < 500;
      const accept = file.type.indexOf("mp4") > -1;
      if (!accept) {
        this.$message.error("上传文件只能是mp4格式!");
      }
      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 500MB!");
      }
      return accept && isLt50M;
    },
    //上传mp4文件成功的钩子函数
    onsuccsessmp4(response, file, fileList) {
      if (this.fileList.length < 10 && response.resb == 200) {
        this.uploadRate = 100;
        this.newdata.videoUrl = response.data.url;
      } else {
        this.$message.error("最多上传1个");
      }
      console.log("this.newdata.videoUrl", this.newdata.videoUrl);
    },
    close(i) {
      this.fileList.splice(i, 1);
      this.newdata.picurl = this.fileList.join();
    },
    submith5() {
      if (this.h5.id) {
        this.$ajax.updateH5(
          { id: this.h5.id, parameters: { content: this.h5.content } },
          (res) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.Detailshow = false;
          }
        );
      } else {
        this.$ajax.addH5(this.h5, (res) => {
          if (res.resb == 200) {
            let linkh5url = res.data.id;
            this.$ajax.updateEvents(
              { id: this.newdata.id, parameters: { h5id: linkh5url } },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.Detailshow = false;
                this.getlist();
              }
            );
          }
        });
      }
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.getlist();
    },
    handleLoading1(event, file, fileList) {
      this.fullscreenLoading = true;
      // console.log("event", event);
      // console.log("file", file);
      // console.log("fileList", fileList);
      this.uploadRate = Number(((event.loaded / event.total) * 100).toFixed(2));
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
    // onsuccsesspic(response, file, fileList) {
    //   if (this.fileList.length < 5 && response.resb == 200) {
    //     this.fileList.push(response.shortUrl)
    //     this.newdata.picurl = this.fileList.join()
    //     this.fullscreenLoading = false;
    //   } else {
    //     this.$message.error('最多上传5个')
    //   }
    // },
    onremove(file, fileList) {
      console.log(file);
    },
    uploading(id) {
      document.getElementById(id).click();
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resb == 200) {
        this.$set(this.newdata, "thumbnail", response.data.url);
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    search() {
      this.getlist();
    },
    //详情
    detail(item) {
      console.log("item", item);
      this.detailBol = true;
      this.Addshow = true;
      this.newdata = { ...item };
      this.fileList = item.picurl.length ? item.picurl.split(",") : [];
      this.mp3List = data.picurl.voiceUrl ? data.voiceUrl.split(",") : [];
      console.log("mp3List", this.mp3List);
      this.h5.content = item.details;
    },
    //修改表单
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      if (data) {
        console.log("this.newdata", this.newdata);
        console.log("data", data);
        console.log("this.fileList", this.fileList);
        this.newdata = { ...data };
        // if (data.detailType == 2) {

        // }
        this.h5.content = data.details;
        this.fileList = data.picurl.length ? data.picurl.split(",") : [];
        this.detailBol = false;
      } else {
        this.newdata = {
          banner: 1,
          detailType: 1,
          details: "",
          parkId: sessionStorage.getItem("parkid")
            ? sessionStorage.getItem("parkid")
            : "",
          picurl: "",
          status: 1,
          summary: "",
          thumbnail: "",
          videoPicture: "",
          title: "",
          videoUrl: "",
          voiceUrl: "",
        };
        (this.uploadRate = 0),
          // this.newdata.title = "";
          // this.newdata.voiceUrl = "";
          (this.mp3List = []);
        this.fileList = [];
        this.h5 = { content: "" };
        this.detailBol = false;
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
          this.$ajax.deleteById({ idlst: list }, (res) => {
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
          if (this.newdata.id) {
            console.log("进入修改");
            this.$ajax.updateNewManage(
              {
                id: this.newdata.id,
                parameters: {
                  parkId: sessionStorage.getItem("parkid")
                    ? sessionStorage.getItem("parkid") * 1
                    : "",
                  thumbnail: this.newdata.thumbnail,
                  videoPicture: this.newdata.videoPicture,
                  picurl: this.newdata.picurl,
                  details: this.h5.content
                    ? this.h5.content
                    : this.newdata.details,
                  detailType: this.newdata.detailType,
                  summary: this.newdata.summary,
                  title: this.newdata.title,
                  status: 1,
                  videoUrl: this.newdata.videoUrl,
                  voiceUrl: this.newdata.voiceUrl,
                  banner: this.newdata.banner,
                },
              },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                console.log("data", this.newdata);
                this.Addshow = false;
                this.getlist();
              }
            );
          } else {
            console.log("进入添加");

            this.$ajax.addNewManage(
              {
                parkId: sessionStorage.getItem("parkid")
                  ? sessionStorage.getItem("parkid") * 1
                  : "",
                thumbnail: this.newdata.thumbnail,
                videoPicture: this.newdata.videoPicture,
                picurl: this.newdata.picurl,
                details: this.h5.content
                  ? this.h5.content
                  : this.newdata.details,
                detailType: this.newdata.detailType,
                summary: this.newdata.summary,
                title: this.newdata.title,
                status: 1,
                videoUrl: this.newdata.videoUrl,
                voiceUrl: this.newdata.voiceUrl,
                banner: this.newdata.banner,
              },
              (res) => {
                this.$message({
                  type: "success",
                  message: "提交成功!",
                });
                this.Addshow = false;
                this.getlist();
              }
            );
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
    //启用禁用单行
    enableState(id, val) {
      console.log(id, val);
      this.$ajax.openOrClose({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.getlist();
      });
    },
    //多行启用禁用
    setenableState(val) {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.openOrClose({ idlst: idlst, isenable: val }, (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.getlist();
        });
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
            this.$ajax.deleteById({ idlst: idlst }, (res) => {
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
    //获取新闻管理列表
    getlist() {
      this.$ajax.queryNewManagePage(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
        console.log("this.tableData", this.tableData);
        console.log("this.total", this.total);
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