<template>
  <div>
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="newdata"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="24">
          <el-form-item label="目标平台" prop="type">
            <el-checkbox-group v-model="newdata.type" size="medium">
              <el-checkbox
                v-for="(item, index) in typeOptions"
                :key="index"
                :label="item.value"
                :disabled="item.disabled"
                >{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item label="通知标题" prop="title">
            <el-input
              v-model="newdata.title"
              placeholder="请输入通知标题，最多10个字符"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="通知内容" prop="content">
            <el-input
              v-model="newdata.content"
              type="textarea"
              placeholder="请输入通知内容，最多40个字符"
              :autosize="{ minRows: 4, maxRows: 4 }"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <!-- <el-button @click="resetForm">重置</el-button> -->
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
      newdata: {
        type: [],
        title: "",
        content: "",
      },
      rules: {
        type: [
          {
            required: true,
            type: "array",
            message: "请至少选择一个平台",
            trigger: "blur",
          },
        ],
        title: [
          { max: 10, message: "最多10个字符", trigger: "blur" },
          {
            required: true,
            message: "请输入通知标题",
            trigger: "blur",
          },
        ],
        content: [
          { max: 40, message: "最多40个字符", trigger: "blur" },
          {
            required: true,
            message: "请输入通知内容",
            trigger: "blur",
          },
        ],
      },
      typeOptions: [
        {
          label: "微信小程序",
          value: 3,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.newdata.type = this.newdata.type[0];
          this.$ajax.pushNoticeForWeChat(this.newdata, (res) => {
            if (res.resbCode == 200) {
              this.$message({
                type: "success",
                message: "发送成功!",
              });
              console.log("res", res);
            }
          });
          this.newdata = { type: [], title: "", content: "" };
        }
      });
    },
    // resetForm() {
    //   this.$refs["elForm"].resetFields();
    // },
  },
};
</script>
<style>
</style>
