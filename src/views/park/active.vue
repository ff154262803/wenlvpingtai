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
        >添加活动</el-button
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
        prop="caption"
        label="活动标题"
        align="center"
      ></el-table-column>
      <el-table-column
        label="地点"
        prop="siteName"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.isenable == 1 ? "启用" : "禁用"
        }}</template>
      </el-table-column>
      <el-table-column label="是否需要预约" align="center" width="120">
        <template slot-scope="scope">{{
          scope.row.issubscribe == 1 ? "需要预约" : "不需要预约"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="starttime"
        label="开始时间"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="endtime"
        label="结束时间"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="gotodetail(scope.row)"
            v-show="scope.row.issubscribe == 1"
            >预约管理</el-button
          >
          <el-button type="text" size="small" @click="detail(scope.row)"
            >编辑详情</el-button
          >
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
      <div class="el-dialog el-dialogadd" style="width: 1000px">
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
            <el-form-item label="活动名" prop="caption">
              <el-input v-model="newdata.caption"></el-input>
            </el-form-item>
            <el-form-item label="地点" prop="siteid">
              <el-select v-model="newdata.siteid">
                <el-option
                  :label="n.caption"
                  :value="n.id"
                  :key="n.id"
                  v-for="n in sitelist"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="address">
              <el-input v-model="newdata.address"></el-input>
            </el-form-item>
            <el-form-item label="开始结束时间" prop="time">
              <el-date-picker
                v-model="newdata.time"
                @change="dateChangebirthday1"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="是否需要预约" prop="issubscribe">
              <el-radio-group v-model="newdata.issubscribe">
                <el-radio label="1" checked="checked">可预约</el-radio>
                <el-radio label="0">不可预约</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="请选择类型" prop="banner">
              <el-radio-group v-model="newdata.banner">
                <el-radio label="1" checked="checked">轮播图</el-radio>
                <el-radio label="0">视频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="轮播图"
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
                class="upload-demo"
                style="display: none"
                :on-remove="onremove"
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
                <div class="pic" v-for="(n, i) in fileList" :key="n">
                  <img :src="n" alt="" class="pic" />
                  <img
                    src="../../../static/img/close.png"
                    alt=""
                    class="close"
                    @click="close(i)"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="视频讲解"
              prop="videoUrl"
              v-if="newdata.banner == 0"
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
                accept="video/mp4"
                :on-success="onsuccsessmp4"
                :before-upload="beforeUploadmp4"
              >
                <el-button
                  size="small"
                  type="primary"
                  style="display: none"
                  id="upmp4"
                  >点击上传</el-button
                >
              </el-upload>
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
              v-if="newdata.banner == 0"
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
    <!--详情查看-->
    <div class="el-dialog__wrapper" v-show="Detailshow">
      <div class="el-dialog el-dialogedit">
        <div class="el-dialog__header">
          <span class="el-dialog__title">编辑详情</span>
          <button
            class="el-dialog__headerbtn"
            aria-label="Close"
            type="button"
            @click="cancel('')"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <tinymce-editor ref="editor" v-model="h5.content"> </tinymce-editor>
        </div>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button @click="cancel('')">取 消</el-button>
            <el-button type="primary" @click="submith5('')">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let starttime = "";
let endtime = "";
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
        banner: "1",
        issubscribe: "1",
        picurl: "",
        address: "",
        caption: "",
        endtime: "",
        intro: "",
        issubscribe: "1",
        parkid: "",
        picurl: "",
        starttime: "",
        thumbnail: "",
        videoPicture: "",
        videoUrl: "",
      },
      rules: {
        caption: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        address: [
          { required: true, message: "地址不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        issubscribe: [{ required: true, message: "必选", trigger: "blur" }],
        picurl: [{ required: true, message: "必填项", trigger: "blur" }],
        thumbnail: [{ required: true, message: "必填项", trigger: "blur" }],
        videoUrl: [
          { required: true, message: "视频不能为空", trigger: "blur" },
        ],
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
    this.getlist();
    this.getsitelist();
  },
  methods: {
    dateChangebirthday1(val) {
      console.log("val", this.newdata.time);
    },
    deling(val) {
      if (val == "videoUrl") {
        this.newdata.videoUrl = "";
      }
    },
    //上传mp4文件成功的钩子函数
    onsuccsessmp4(response, file, fileList) {
      this.newdata.videoUrl = response.data.url;
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
          if (res.resbCode == 200) {
            let linkh5url = res.data.id;
            this.newdata.intro = this.h5.content;
            this.$ajax.updateEvents(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.Detailshow = false;
              this.getlist();
            });
          }
        });
      }
      this.$nextTick(() => {
        this.$refs["newdata"].resetFields();
      });
    },
    detail(res) {
      console.log(res);
      this.Detailshow = true;

      if (res.h5id) {
        this.h5.id = res.h5id;
        this.$ajax.getH5Details({ id: res.h5id }, (res) => {
          this.h5 = res.data;
        });
      } else {
        this.newdata = { ...res };
        this.h5.content = this.newdata.intro;
        this.h5.caption = "";

        if (this.newdata.intro == null) {
          this.h5 = { caption: "", content: "" };
        }
        console.log("newdata", this.newdata);
      }
    },
    gotodetail(row) {
      this.$router.push({ path: "/partdetail", query: { id: row.id } });
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.getlist();
    },
    timeform: function (format, time) {
      //转化时间格式传输给后台
      var d = new Date(time);
      var date = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "H+": d.getHours(),
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
      if (this.fileList.length < 10 && response.resbCode == 200) {
        this.fileList.push(response.data.url);
        this.newdata.picurl = this.fileList.join();
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
      if (response.resbCode == 200) {
        this.$set(this.newdata, "thumbnail", response.data.url);
      }
    },
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "videoPicture", response.data.url);
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    search() {
      this.getlist();
    },
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      if (data) {
        this.newdata = { ...data };
        console.log("this.newdata", this.newdata);
        this.fileList = data.picurl.split(",");
        this.$set(this.newdata, "time", [
          new Date(
            data.starttime.split("-")[0],
            data.starttime.split("-")[1] - 1,
            data.starttime.split("-")[2].split(" ")[0],
            data.starttime.split(" ")[1].split(":")[0],
            data.starttime.split(" ")[1].split(":")[1],
            data.starttime.split(" ")[1].split(":")[2]
          ),
          new Date(
            data.endtime.split("-")[0],
            data.endtime.split("-")[1] - 1,
            data.endtime.split("-")[2].split(" ")[0],
            data.endtime.split(" ")[1].split(":")[0],
            data.endtime.split(" ")[1].split(":")[1],
            data.endtime.split(" ")[1].split(":")[2]
          ),
        ]);
      } else {
        this.fileList = [];
        this.newdata = {
          banner: "1",
          issubscribe: "1",
          picurl: "",
          address: "",
          caption: "",
          starttime: "",
          endtime: "",
          intro: "",
          issubscribe: "1",
          parkid: "",
          picurl: "",
          thumbnail: "",
          videoPicture: "",
          videoUrl: "",
        };
        this.$refs["newdata"].resetFields();
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.banner == "1") {
            this.newdata.videoUrl = "";
            this.newdata.videoPicture = "";
          } else {
            this.newdata.picurl = "";
          }
          if (this.newdata.time[0]) {
            this.newdata.starttime = this.timeform(
              "yyyy-MM-dd HH:mm:ss",
              this.newdata.time[0]
            );
          }
          if (this.newdata.time[1]) {
            this.newdata.endtime = this.timeform(
              "yyyy-MM-dd HH:mm:ss",
              this.newdata.time[1]
            );
          }
          if (this.newdata.id) {
            this.$ajax.updateEvents(
              {
                videoPicture: this.newdata.videoPicture
                  ? this.newdata.videoPicture
                  : "",
                parkid: sessionStorage.getItem("parkid"),
                id: this.newdata.id,
                intro: this.newdata.intro ? this.newdata.intro : "",
                videoUrl: this.newdata.videoUrl ? this.newdata.videoUrl : "",
                caption: this.newdata.caption,
                endtime: this.newdata.endtime,
                picurl: this.newdata.picurl ? this.newdata.picurl : "",
                address: this.newdata.address,
                thumbnail: this.newdata.thumbnail,
                issubscribe: this.newdata.issubscribe,
                starttime: this.newdata.starttime,
                siteid: this.newdata.siteid,
                banner: this.newdata.banner,
                isenable: "1",
              },
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
            this.$ajax.addEvents(
              {
                parkid: sessionStorage.getItem("parkid"),
                isenable: "1",

                videoPicture: this.newdata.videoPicture
                  ? this.newdata.videoPicture
                  : "",
                intro: this.newdata.intro ? this.newdata.intro : "",
                videoUrl: this.newdata.videoUrl ? this.newdata.videoUrl : "",
                caption: this.newdata.caption,
                endtime: this.newdata.endtime,
                picurl: this.newdata.picurl ? this.newdata.picurl : "",
                address: this.newdata.address,
                thumbnail: this.newdata.thumbnail,
                issubscribe: this.newdata.issubscribe,
                starttime: this.newdata.starttime,
                siteid: this.newdata.siteid,
                banner: this.newdata.banner,
              },
              (res) => {
                console.log("newdata", this.newdata);
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
    enableState(id, val) {
      this.$ajax.setEventsEnableState({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.getlist();
      });
    },
    setenableState(id, val) {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.setEventsEnableState(
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
            this.$ajax.deleteEvents({ idlst: idlst }, (res) => {
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
    getlist() {
      this.$ajax.queryEventsList(this.query, (res) => {
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
</style>
