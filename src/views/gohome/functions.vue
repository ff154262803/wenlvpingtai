<template>
  <div>
    <div class="filter">
      <el-button class="addBtn" type="primary" @click="beginshow()"
        >添加</el-button
      >
    </div>
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="themeName" label="功能名称"> </el-table-column>
        <el-table-column prop="themeImgUrl" label="功能链接"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="delectClick(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-dialog
      title="新增"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="功能名称" label-width="100px" prop="themeName">
          <el-input v-model="form.themeName" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="功能链接" label-width="100px" prop="themeImgUrl">
          <el-input v-model="form.themeImgUrl" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="缩略图" prop="imgUrl" class="imgurl">
          <el-upload
            class="avatar-uploader"
            :action="$store.state.ip + '/manage/ferriswheel/resources/upload'"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrModifyTheme('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "functions",
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        type: 2,
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
        imgUrl: [{ required: true, message: "请选择图片" }],
        themeImgUrl: [
          { required: true, message: "请输入头图链接", trigger: "blur" },
        ],
      },
      headers: { Authorization: JSON.parse(sessionStorage.user).uKey },
      formLabelWidth: "120px",
    };
  },
  mounted() {
    this.form.parkId = sessionStorage.getItem("parkid");
    this.getTheme();
  },
  methods: {
    //图片上传
    beforeAvatarUpload(file) {
      const isJPG =
        !!~file.type.indexOf("jpeg") ||
        !!~file.type.indexOf("jpg") ||
        !!~file.type.indexOf("png");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) this.$message.error("上传图片只能是 JPG/PNG/JPEG 格式!");
      if (!isLt2M) this.$message.error("上传图片大小不能超过 2MB!");
      // console.log(file);
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(val) {
      // console.log(val);
      this.$set(this.form, "imgUrl", val.data.url);
      this.$refs.form.validate();
    },
    //删除
    delectClick(id) {
      this.$confirm("您确定要删除该类型吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$ajax.deleteTheme({ id: id }, (res) => {
          this.getTheme();
        });
      });
    },
    //新增/修改确定
    addOrModifyTheme(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.addOrModifyTheme(this.form, (res) => {
            this.$message({
              type: "success",
              message: "提交成功!",
            });
            this.form = {
              type: 2,
              parkId: sessionStorage.getItem("parkid"),
            };
            this.dialogFormVisible = false;
            this.getTheme();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //
    getTheme() {
      this.$ajax.getTheme(this.form, (res) => {
        // console.log(res);
        this.tableData = res.data;
      });
    },
    //修改
    handleClick(row) {
      this.form = row;
      this.dialogFormVisible = true;
      this.getTheme();
    },
    beginshow() {
      this.form = {};
      this.dialogFormVisible = true;
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
.avatar {
  width: 100px;
  height: 100px;
}
.imgurl {
  position: relative;
  left: 20px;
}
</style>