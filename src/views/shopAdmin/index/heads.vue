<template>
  <div>
    <el-card class="box-card">
      <div class="titles">头图一信息</div>
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
        class="form"
      >
        <el-form-item label="头图标题" prop="title">
          <el-input :disabled="disabled" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图一" prop="banner">
          <el-input
            v-model="form.banner"
            style="width: 200px; display: none"
          ></el-input>
          <el-button
            size="small"
            :disabled="disabled"
            type="primary"
            @click="uploading('uppict')"
            >点击上传</el-button
          >
          <el-upload
            class="upload-demo"
            style="display: none"
            :data="uploaddata"
            :action="$store.state.ip + '/manage/ferriswheel/resources/upload'"
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
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb，图片推荐750*470
            </div> </el-upload
          ><span class="hint"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图片推荐750*470</span
          >
          <div style="margin-top: 20px">
            <img
              :src="form.banner"
              alt=""
              class="pic"
              v-if="form.banner"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="url">
          <el-input :disabled="disabled" v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="disabled"
            @click="onSubmit('form')"
            >确认添加</el-button
          >
          <el-button :disabled="!disabled" @click="updatafn">修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="titles">头图二信息</div>
      <el-form
        ref="form1"
        :rules="rules"
        :model="form1"
        label-width="80px"
        class="form"
      >
        <el-form-item label="头图标题" prop="title">
          <el-input :disabled="disabled1" v-model="form1.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图二" prop="banner">
          <el-input
            v-model="form1.banner"
            style="width: 200px; display: none"
          ></el-input>
          <el-button
            size="small"
            :disabled="disabled1"
            type="primary"
            @click="uploading('uppict1')"
            >点击上传</el-button
          >
          <el-upload
            class="upload-demo"
            style="display: none"
            :data="uploaddata"
            :action="$store.state.ip + '/manage/ferriswheel/resources/upload'"
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
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb，图片推荐750*470
            </div>
          </el-upload>
          <span class="hint"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图片推荐750*470</span
          >
          <div style="margin-top: 20px">
            <img
              :src="form1.banner"
              alt=""
              class="pic"
              v-if="form1.banner"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="url">
          <el-input :disabled="disabled1" v-model="form1.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="disabled1"
            @click="onSubmit('form1')"
            >确认添加</el-button
          >
          <el-button :disabled="!disabled1" @click="updatafn1">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="empty('form1')"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="titles">头图三信息</div>
      <el-form
        ref="form2"
        :rules="rules"
        :model="form2"
        label-width="80px"
        class="form"
      >
        <el-form-item label="头图标题" prop="title">
          <el-input :disabled="disabled2" v-model="form2.title"></el-input>
        </el-form-item>
        <el-form-item label="轮播图三" prop="banner">
          <el-input
            v-model="form2.banner"
            style="width: 200px; display: none"
          ></el-input>
          <el-button
            size="small"
            :disabled="disabled2"
            type="primary"
            @click="uploading('uppict2')"
            >点击上传</el-button
          >
          <el-upload
            class="upload-demo"
            style="display: none"
            :data="uploaddata"
            :action="$store.state.ip + '/manage/ferriswheel/resources/upload'"
            :on-progress="handleLoading"
            accept="image/jpeg,image/jpg,image/png"
            :on-success="onsuccsess2"
            :before-upload="beforeUploadpic"
            :on-error="onerror"
            list-type="picture"
          >
            <el-button size="small" type="primary" id="uppict2"
              >点击上传</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb，图片推荐750*470
            </div>
          </el-upload>
          <span class="hint"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图片推荐750*470</span
          >
          <div style="margin-top: 20px">
            <img
              :src="form2.banner"
              alt=""
              class="pic"
              v-if="form2.banner"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="url">
          <el-input :disabled="disabled2" v-model="form2.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="disabled2"
            @click="onSubmit('form2')"
            >确认添加</el-button
          >
          <el-button :disabled="!disabled2" @click="updatafn2">修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="empty('form2')"
          ></el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "heads",
  data() {
    return {
      disabled: false,
      disabled1: false,
      disabled2: false,
      form: {
        title: "",
        url: "",
        banner: "",
        id: "",
      },
      form1: {
        title: "",
        url: "",
        banner: "",
        id: "",
      },
      form2: {
        title: "",
        url: "",
        banner: "",
        id: "",
      },
      fileList: [], //轮播图一
      fileList2: [], //轮播图一
      fileList3: [], //轮播图一
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      rules: {
        title: [
          { required: true, message: "请输入头图标题", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        // url: [{ required: true, message: "请输入头图连接", trigger: "blur" }],
        banner: [
          { required: true, message: "请输入头图链接", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.form.parkId = sessionStorage.getItem("parkid");
    this.bannerList();
  },
  methods: {
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // successPic(response, file, fileList) {
    //   console.log(fileList);
    //   if (fileList.lenght > 1) {
    //     this.disabled = ture;
    //   } else {
    //     this.disabled = false;
    //   }
    // },
    uploading(id) {
      console.log("id", id);
      document.getElementById(id).click();
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.form, "banner", response.data.url);
      }
    },
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.form1, "banner", response.data.url);
      }
    },
    onsuccsess2(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.form2, "banner", response.data.url);
      }
    },
    beforeUploadpic(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
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
    onerror() {
      this.fullscreenLoading = false;
    },
    //修改
    updatafn() {
      this.disabled = false;
      console.log("form", this.form);
    },
    updatafn1() {
      this.disabled1 = false;
      console.log("form", this.form1);
    },
    updatafn2() {
      this.disabled2 = false;
      console.log("form", this.form2);
    },
    //获取头图信息
    bannerList() {
      //let pkid = sessionStorage.getItem("parkid");
      this.$ajax.bannerList(
        { parkId: sessionStorage.getItem("parkid") * 1 },
        (res) => {
          if (res.data.length == 1) {
            this.form = res.data[0];
          } else if (res.data.length == 2) {
            this.form = res.data[0];
            this.form1 = res.data[1];
          } else if (res.data.length == 3) {
            this.form = res.data[0];
            this.form1 = res.data[1];
            this.form2 = res.data[2];
          }
          console.log(this.form1);
          if (res.data.title !== "") {
            this.disabled = true;
            this.disabled1 = true;
            this.disabled2 = true;
          }
          // sessionStorage.getItem("parkid");
        }
      );
    },
    //清空
    empty(val) {
      if (val === "form1") {
        (this.form1.title = ""),
          (this.form1.url = ""),
          (this.form1.banner = "");
        this.disabled1 = false;
      } else if (val === "form2") {
        (this.form2.title = ""),
          (this.form2.url = ""),
          (this.form2.banner = "");
        this.disabled2 = false;
      }
    },
    // 新增
    onSubmit(form) {
      console.log("form", form);
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (form === "form") {
            if (this.form.id) {
              console.log("valid", this.form);
              this.$ajax.updateBanner(this.form, (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.disabled = true;
                // sessionStorage.getItem("parkid");
              });
            }
            return;
            this.$ajax.addBanner(this.form, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.disabled = true;
              // sessionStorage.getItem("parkid");
            });
          } else if (form === "form1") {
            if (this.form1.id) {
              console.log("valid", this.form1);
              this.$ajax.updateBanner(this.form1, (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.disabled1 = true;
                // sessionStorage.getItem("parkid");
              });
            }
            return;
            this.$ajax.addBanner(this.form1, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.disabled1 = true;
              // sessionStorage.getItem("parkid");
            });
          } else if (form === "form2") {
            if (this.form2.id) {
              console.log("valid", this.form2);
              this.$ajax.updateBanner(this.form2, (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.disabled2 = true;
                // sessionStorage.getItem("parkid");
              });
            }
            return;
            this.$ajax.addBanner(this.form2, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.disabled2 = true;
              // sessionStorage.getItem("parkid");
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });

      // console.log(this.form);
    },
  },
};
</script>

<style  scoped>
.box-card {
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  width: 480px;
}
.titles {
  font-size: 19px;
  font-weight: bold;
}
.form {
  margin-top: 10px;
}
</style>