<template>
  <div>
    <el-card class="box-card">
      <div class="titles">头图信息</div>
      <el-form ref="form" :model="form" label-width="80px" class="form">
        <el-form-item label="头图标题" prop="themeName">
          <el-input :disabled="disabled" v-model="form.themeName"></el-input>
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
      // rules: {
      //   themeName: [
      //     { required: true, message: "请输入头图标题", trigger: "blur" },
      //     {
      //       min: 1,
      //       max: 10,
      //       message: "长度在 1 到 10 个字符",
      //       trigger: "blur",
      //     },
      //   ],
      //   themeImgUrl: [
      //     { required: true, message: "请输入头图链接", trigger: "blur" },
      //   ],
      // },
    };
  },
  mounted() {
    this.form.parkId = sessionStorage.getItem("parkid");
    this.getheadPic();
  },
  methods: {
    //修改
    updatafn() {
      this.disabled = false;
    },
    //获取头图信息
    getheadPic() {
      //let pkid = sessionStorage.getItem("parkid");
      this.$ajax.getHeadPic(
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
          this.$ajax.addheadPic(this.form, (res) => {
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