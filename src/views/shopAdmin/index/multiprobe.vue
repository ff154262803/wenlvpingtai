<template>
  <div>
    <el-card class="box-card">
      <div class="titles">兑换说明</div>

      <el-form
        :model="formData"
        ref="formData"
        label-width="80px"
        class="form-dynamic"
      >
        <el-form-item
          v-for="(domain, index) in formData.domains"
          :label="'条例' + (index + 1)"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
          :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
        >
          <el-input v-model="domain.value"></el-input>
          <a
            class="remove-item"
            v-show="formData.domains.length > 1"
            @click.prevent="removeDomain(domain)"
            ><i class="el-icon-delete"></i
          ></a>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button type="primary" @click="submitForm('formData')"
            >提交</el-button
          >
          <el-button @click="addDomain">新增一项</el-button>
          <!-- <el-button @click="resetForm('formData')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
import ip from "../../../vuex/store";
let base = ip.state.ip;
export default {
  name: "Form",
  data() {
    return {
      formData: {
        domains: [
          {
            value: "",
          },
        ],
      },
      id1: "",
    };
  },
  mounted() {
    this.descriptionList();
  },
  methods: {
    /*增加表单项*/
    addDomain() {
      this.formData.domains.push({
        value: "",
      });
    },
    /*删除表单项*/
    removeDomain(item) {
      var index = this.formData.domains.indexOf(item);
      if (index !== -1) {
        this.formData.domains.splice(index, 1);
      }
    },
    /*格式化表单数据*/
    formatData(data) {
      //动态表单生成的是一个对象数组，需要把对象数组转成一个对象
      console.log("data", JSON.stringify(data));
      var sty = "";
      data.forEach((item, index) => {
        sty += item.value + ",";
      });
      if (sty.length > 0) {
        sty = sty.substr(0, sty.length - 1);
      }
      console.log("sty", sty);
      return sty;
    },
    /*提交表单*/
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("此操作将会提交兑换说明, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$ajax.addDescription(
                {
                  desiription: this.formatData(this.formData.domains),
                  id: this.id1,
                },
                (res) => {
                  this.$message({
                    type: "success",
                    message: "提交成功!",
                  });
                  console.log("查询五彩石商城列表", res);
                  this.formData.domains.value = res.data;
                  // this.descriptionList();
                }
              );
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消提交",
              });
              // this.descriptionList();
            });
        } else {
          alert("表单项不能为空！！！");
          return false;
        }
      });
    },
    /*重置表单*/
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //查询列表
    descriptionList() {
      this.$ajax.descriptionList({}, (res) => {
        if (res.data[0] == null) {
          this.id1 = 0;
        } else {
          let arr = res.data[0].content.split(",");
          for (let i = 0; i < arr.length; i++) {
            this.formData.domains.push({ value: arr[i] });
          }
          this.formData.domains.shift();
          this.id1 = res.data[0].id;
        }
        // console.log(res.data[0].id);
      });
    },
  },
};
</script>
<style  scoped>
.form-dynamic {
  width: 650px;
  background: #fff;
  padding: 20px;
  padding-top: 40px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  text-align: left;
}
.el-input {
  width: 95%;
}
.remove-item {
  color: red;
}
.submit-btn {
  text-align: center;
  margin-left: -60px;
}
.box-card {
  float: left;
  margin-right: 30px;
  margin-bottom: 30px;
  width: 750px;
}
.titles {
  font-size: 19px;
  font-weight: bold;
}
.form {
  margin-top: 10px;
}
</style>