<template>
  <div>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="18">
          <el-form-item label="上传" prop="field109" required>
            <el-upload ref="field109" :file-list="field109fileList" :action="field109Action" :auto-upload="false"
              :before-upload="field109BeforeUpload" list-type="picture" accept="audio/*">
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
  export default {
    components: {},
    props: [],
    data() {
      return {
        formData: {
          field109: null,
        },
        rules: {},
        field109Action: 'https://jsonplaceholder.typicode.com/posts/',
        field109fileList: [],
      }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          // TODO 提交表单
        })
      },
      resetForm() {
        this.$refs['elForm'].resetFields()
      },
      field109BeforeUpload(file) {
        let isRightSize = file.size / 1024 / 1024 < 2
        if (!isRightSize) {
          this.$message.error('文件大小超过 2MB')
        }
        let isAccept = new RegExp('audio/*').test(file.type)
        if (!isAccept) {
          this.$message.error('应该选择audio/*类型的文件')
        }
        return isRightSize && isAccept
      },
      submitUpload() {
        this.$refs['field109'].submit()
      },
    }
  }

</script>
<style>
  .el-upload__tip {
    line-height: 1.2;
  }
</style>