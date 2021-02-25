<template>
  <div>
    <el-card class="box-card">
      <div class="titles">头图一信息</div>
      <el-form ref="form" :model="form" label-width="80px" class="form">
        <el-form-item label="头图标题" prop="themeName">
          <el-input :disabled="disabled" v-model="form.themeName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="轮播图一" prop="themeName">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="successPic"
            list-type="picture"
            :disabled="disabled"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb，图片推荐750*470
            </div>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="缩略图" prop="thumbnail">
          <el-input
            v-model="form.thumbnail"
            style="width: 200px; display: none"
          ></el-input>
          <el-button size="small" type="primary" @click="uploading('uppict')"
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
            </div>
          </el-upload>
          <div style="margin-top: 20px">
            <img
              :src="form.thumbnail"
              alt=""
              class="pic"
              v-if="form.thumbnail"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="themeImgUrl">
          <el-input :disabled="disabled" v-model="form.themeImgUrl"></el-input>
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
      <el-form ref="form" :model="form" label-width="80px" class="form">
        <el-form-item label="头图标题" prop="themeName">
          <el-input :disabled="disabled" v-model="form.themeName"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnail">
          <el-input
            v-model="form.thumbnail"
            style="width: 200px; display: none"
          ></el-input>
          <el-button size="small" type="primary" @click="uploading('uppict')"
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
            </div>
          </el-upload>
          <div style="margin-top: 20px">
            <img
              :src="form.thumbnail"
              alt=""
              class="pic"
              v-if="form.thumbnail"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="themeImgUrl">
          <el-input :disabled="disabled" v-model="form.themeImgUrl"></el-input>
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
      <div class="titles">头图三信息</div>
      <el-form ref="form" :model="form" label-width="80px" class="form">
        <el-form-item label="头图标题" prop="themeName">
          <el-input :disabled="disabled" v-model="form.themeName"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="thumbnail">
          <el-input
            v-model="form.thumbnail"
            style="width: 200px; display: none"
          ></el-input>
          <el-button size="small" type="primary" @click="uploading('uppict')"
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
            </div>
          </el-upload>
          <div style="margin-top: 20px">
            <img
              :src="form.thumbnail"
              alt=""
              class="pic"
              v-if="form.thumbnail"
              style="width: 80px"
              ref="pic"
            />
          </div>
        </el-form-item>
        <el-form-item label="头图链接" prop="themeImgUrl">
          <el-input :disabled="disabled" v-model="form.themeImgUrl"></el-input>
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
  </div>
</template>

<script>
export default {
  name: "heads",
  data() {
    return {
      disabled: false,
      form: {
        themeName: "",
        themeImgUrl: "",
        type: "1",
      },
      fileList: [], //轮播图一
      fileList2: [], //轮播图一
      fileList3: [], //轮播图一
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      rules: {
        themeName: [
          { required: true, message: "请输入头图标题", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        themeImgUrl: [
          { required: true, message: "请输入头图链接", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.form.parkId = sessionStorage.getItem("parkid");
    this.getheadPic();
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
      document.getElementById(id).click();
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.form, "thumbnail", response.data.url);
      }
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
    onerror() {
      this.fullscreenLoading = false;
    },
    //修改
    updatafn() {
      this.disabled = false;
    },
    //获取头图信息
    getheadPic() {
      //let pkid = sessionStorage.getItem("parkid");
      this.$ajax.getHeadPic1(
        { parkId: sessionStorage.getItem("parkid") * 1 },
        (res) => {
          console.log("res", res);
          this.form = res.data;
          // console.log(this.form);
          if (res.data.themeName !== "") {
            this.disabled = true;
          }
          // sessionStorage.getItem("parkid");
        }
      );
    },

    // 新增
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$ajax.addheadPic1(this.form, (res) => {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
            this.disabled = true;
            // sessionStorage.getItem("parkid");
          });
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