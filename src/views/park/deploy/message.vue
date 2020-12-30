<template>
  <div>
    <!-- 表格区 -->
    <el-form :model="newdata" ref="newdata" label-width="120px">
      <el-form-item label="目标平台" prop="plats">
        <el-checkbox-group v-model="newdata.type">
          <el-checkbox label="3">小程序</el-checkbox>
          <el-checkbox label="1">安卓</el-checkbox>
          <el-checkbox label="2">ios</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="通知标题" prop="title">
        <el-input
          v-model="newdata.title"
          placeholder="不填写时默认软件名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="通知内容" prop="content">
        <el-input
          v-model="newdata.content"
          placeholder="请填写您要推送的内容，中文120字以内"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="后续动作" prop="nextab">
        <el-radio-group v-model="newdata.nextab">
          <el-radio label="1">启动首页</el-radio>
          <el-radio label="2">打开链接</el-radio>
          <el-radio label="3">应用内跳转</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- 应用内跳转显示 -->
      <!-- <el-form-item label="Scheme地址" prop="scheme" v-if="newdata.nextab == 3">
        <el-input
          v-model="newdata.scheme"
          placeholder="以http:// 或者https://开头"
        ></el-input>
      </el-form-item> -->
      <!-- 应用内跳转显示 -->
      <!-- <el-form-item label="链接地址" prop="data" v-if="newdata.nextab == 2">
        <el-input
          v-model="newdata.data"
          placeholder="以http:// 或者https://开头"
        ></el-input>
      </el-form-item>
      <el-form-item label="推送方式" prop="workType">
        <el-radio-group v-model="newdata.workType">
          <el-radio label="0">即时</el-radio>
          <el-radio label="1">定时</el-radio>
        </el-radio-group>
        <el-date-picker
          style="margin-left: 50px"
          v-model="newdata.workdate"
          type="datetime"
          placeholder="选择日期时间"
          v-if="newdata.workType == 1"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="离线消息" prop="outline">
        <el-radio-group v-model="newdata.outline">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
        <el-select
          v-model="newdata.unlineTime"
          style="margin-left: 50px"
          v-if="newdata.outline == 1"
        >
          <el-option v-for="n in 10" :label="n" :value="n" :key="n"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附加字段" prop="extra">
        <div
          style="width: 600px; margin-bottom: 20px"
          v-for="(key, val) in newdata.extras"
          :key="val"
        >
          <el-input v-model="key.key" style="width: 150px"></el-input>
          <span>：</span>
          <el-input v-model="key.val" style="width: 150px"></el-input>
          <el-button type="primary" @click="add(val)">添加</el-button>
        </div>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "list",
  data() {
    return {
      newdata: {
        type: [],
        title: "",
        content: "",
      },
      rules: {
        plats: [{ required: true, message: "目标平台不能为空" }],
        title: [{ max: 20, message: "最多20个字符", trigger: "blur" }],
        content: [
          { required: true, message: "内容不能为空" },
          { max: 120, message: "最多120个字符", trigger: "blur" },
        ],
        nextab: [{ required: true, message: "后续动作不能为空" }],
        workType: [{ required: true, message: "推送方式不能为空" }],
        outline: [{ required: true, message: "离线消息不能为空" }],
      },
    };
  },
  methods: {
    add(add) {},
    onSubmit(formName) {
      this.newdata.type = this.newdata.type[0];
      // var data = {
      //   city: "",
      //   target: 1,
      // };
      // if (this.newdata.plats.length == 0) {
      //   this.$message.error("至少一个目标平台");
      //   return false;
      // } else {
      //   data.plats = this.newdata.plats;
      // }
      // if (this.newdata.title.length > 20) {
      //   this.$message.error("通知标题不可超过20字");
      //   return false;
      // } else {
      //   data.title = this.newdata.title;
      // }
      // if (!this.newdata.content || this.newdata.content.length > 120) {
      //   this.$message.error("通知内容为必填项且不可超过120字");
      //   return false;
      // } else {
      //   data.content = this.newdata.content;
      // }
      // if (this.newdata.nextab == 1) {
      //   data.scheme = "";
      //   data.data = "";
      // } else if (this.newdata.nextab == 3) {
      //   data.data = "";
      //   data.scheme = this.newdata.scheme;
      //   if (!this.newdata.scheme || this.newdata.scheme.length > 120) {
      //     this.$message.error("scheme地址为必填项且不可超过120字");
      //     return false;
      //   }
      // } else {
      //   this.$message.error("后续动作为必填项");
      //   return false;
      // }
      // if (this.newdata.workType == 0) {
      //   data.workType = 0;
      //   data.taskTime = 0;
      // } else if (this.newdata.workType == 1 && !this.newdata.workdate) {
      //   this.$message.error("推送日期为必填项");
      //   return false;
      // } else {
      //   data.workType = 1;
      //   data.taskTime = new Date(this.newdata.workdate).getTime();
      // }
      // if (this.newdata.outline == 0) {
      //   data.unlineTime = 0;
      // } else if (this.newdata.outline == 1 && !this.newdata.unlineTime) {
      //   this.$message.error("有效天数为必填");
      //   return false;
      // } else {
      //   data.unlineTime = this.newdata.unlineTime;
      // }
      // let json = {};
      // for (let i = 0; i < this.newdata.extras.length; i++) {
      //   if (
      //     this.newdata.extras[i].key != "" &&
      //     this.newdata.extras[i].val != ""
      //   ) {
      //     json[this.newdata.extras[i].key] = this.newdata.extras[i].val;
      //   }
      // }
      // json.scheme = data.scheme;
      // json.data = data.data;
      // data.extras = JSON.stringify(json);
      this.$ajax.pushNoticeForWeChat(this.newdata, (res) => {
        this.$message({
          type: "success",
          message: "发送成功!",
        });
        this.newdata = { type: [], title: "", content: "" };
        console.log("res", res);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 600px;
}
</style>
