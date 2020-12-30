<template>
  <div class="classificationPage">
    <el-input
      placeholder="账号、用户名"
      v-model="query.condition"
      clearable
      @clear="search"
      style="width: 330px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click.native="beginshow()"
      >添加</el-button
    >
    <div class="filter">
      <strong>园区：</strong>
      <el-select v-model="query.parkid" clearable @change="search">
        <el-option
          v-for="item in ParkTypeList"
          :value="item.parkid"
          :key="item.parkid"
          :label="item.caption"
        ></el-option>
      </el-select>
      <strong class="role">角色：</strong>
      <el-select v-model="query.roleid" clearable @change="search">
        <el-option
          v-for="item in roleList"
          :value="item.id"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
    </div>
    <!--表格内容-->
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="managename"
        label="用户名"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.isenable == 0 ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="account"
        label="账号"
        align="center"
      ></el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">{{
          scope.row.parkRoles == null
            ? "系统管理员"
            : scope.row.parkRoles[0].roleName
        }}</template>
      </el-table-column>
      <el-table-column label="所属园区" align="center"
        ><template slot-scope="scope">{{
          scope.row.parkRoles == null ? "无" : scope.row.parkRoles[0].parkName
        }}</template>
      </el-table-column>
      <el-table-column
        prop="companyname"
        label="所属企业"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createtime"
        show-overflow-tooltips
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Del(scope.row.uid)"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="UpDown(scope.row)">
            {{ scope.row.isenable == 1 ? "禁用" : "启用" }}
          </el-button>
          <el-button type="text" size="small" @click="Edit(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="detail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <div class="allControl">
        <el-button size="small" @click="delAll">删除</el-button>
        <!--<el-button size="small" @click="enableState(1)">启用</el-button>-->
        <!--<el-button size="small" @click="enableState(0)">冻结</el-button>-->
      </div>
      <el-pagination
        background
        layout="total,sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 20, 30, 50]"
        :page-size="query.count"
        :total="total"
      >
      </el-pagination>
      <el-button size="small">确定</el-button>
    </el-col>
    <!--角色新增-->
    <el-dialog
      :title="
        detailBol ? '元素详情' : forminfo.uid ? '修改管理员' : '添加管理员'
      "
      :visible.sync="Addshow"
      v-if="Addshow"
      class="demo-box"
      width="670px"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form :model="forminfo" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="类型" prop="isadmin">
          <el-select
            style="width: 220px"
            v-model="forminfo.isadmin"
            placeholder="请选择类型"
            :disabled="detailBol"
          >
            <el-option label="系统管理员" :value="true"></el-option>
            <el-option label="园区管理员" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="companyid">
          <el-select
            v-model="forminfo.companyid"
            placeholder="请选择企业"
            :disabled="detailBol"
            style="width: 220px"
          >
            <el-option label="中科视维" :value="1"></el-option>
            <el-option label="融创" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="managename">
          <el-input
            style="width: 220px"
            v-model="forminfo.managename"
            placeholder="请输入用户名"
            maxlength="20"
            οnkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
            :disabled="detailBol"
          ></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input
            style="width: 220px"
            v-model="forminfo.account"
            placeholder="请输入账号"
            maxlength="20"
            :disabled="detailBol"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            style="width: 220px"
            v-model="forminfo.password"
            placeholder="请输入密码"
            maxlength="20"
            minlength="6"
            :disabled="detailBol"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="园区和角色"
          prop="ParkRoles"
          v-if="forminfo.isadmin == false"
        >
          <div
            style="margin-bottom: 20px"
            v-for="(key, val) in forminfo.parkRoles"
            :key="val"
          >
            <el-select
              v-model="key.parkid"
              style="width: 180px"
              :disabled="detailBol"
              @change="changeSelect($event)"
            >
              <el-option
                v-for="item in ParkTypeList"
                :value="item.parkid"
                :key="item.id"
                :label="item.caption"
              ></el-option>
            </el-select>
            <el-select
              v-model="key.roleid"
              style="width: 180px"
              :disabled="detailBol"
            >
              <el-option
                v-for="item in roleList"
                :value="item.id"
                :key="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-button type="primary" @click="addSelect()"> 添加</el-button>
            <el-button
              @click="delSelect(key)"
              v-if="forminfo.parkRoles.length != 1"
              >删除</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!detailBol">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let defaultItem = {
  account: "", //用户账号
  isadmin: true, //t系统管理员，f园区管理员
  managename: "", //用户名
  companyid: "",
  parkRoles: [
    {
      parkid: "", //园区id
      roleid: "", //角色id
    },
  ],
  password: "", //用户密码
};
let resetItem = {
  ...defaultItem,
};
export default {
  name: "user",
  data() {
    let pass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error("密码不能输入汉字!"));
      } else if ((value + "").length < 6) {
        return callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    let acccont = (rule, value, callback) => {
      let reg = /[^\a-\z\A-\Z0-9\@\.`~!@#$%^&*()_+<>?:"{},\/;'[\]]/;
      console.log();
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else if (reg.test(value)) {
        return callback(new Error("只能输入数字/字母/符号"));
        // }else if((value+'').length<6){
        //     return callback(new Error('密码不能少于6位'));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      dataList: [],
      roleList: [],
      roleSelect: "",
      query: {
        condition: "",
        page: 1,
        count: 10,
      },
      ParkTypeList: [],
      multipleSelection: [],
      Addshow: false,
      detailBol: false,
      newdata: {},
      rules: {
        managename: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        account: [{ required: true, validator: acccont, trigger: "blur" }],
        password: [{ required: true, validator: pass, trigger: "blur" }],
        isadmin: [{ required: true, trigger: "blur" }],
        companyid: [{ required: true, trigger: "blur", message: "请选择企业" }],
      },
      forminfo: { ...defaultItem },
    };
  },
  mounted() {
    this.queryManageUserList();
    this.queryRole();
    this.queryParkList();
    // this.add()
  },
  methods: {
    beginshow() {
      this.Addshow = true;
      this.forminfo.parkRoles = [];
      this.forminfo = { ...resetItem };
    },
    //添加弹框中下拉框上下级联动
    changeSelect(item) {
      console.log("item", item);
      this.query.parkid = item;
      this.$ajax.queryRole(this.query, (res) => {
        this.roleList = res.data;
        console.log(this.roleList, "roleList");
      });
      if (this.forminfo.parkRoles.length) {
        console.log("存在");
        for (let i = 1; i < this.forminfo.parkRoles.length; i++) {
          console.log("roleid", this.forminfo.parkRoles[i]);
          // this.forminfo.parkRoles[i].roleid = null;
        }
      }
      // this.roleList = [];
    },
    //角色查询
    queryRole() {
      this.$ajax.queryRole(this.query, (res) => {
        this.roleList = res.data;
        console.log(this.roleList, "roleList");
      });
    },
    //查询园区列表
    queryParkList() {
      this.$ajax.queryParkList(this.query, (res) => {
        this.ParkTypeList = res.data;
        console.log(this.ParkTypeList, "ParkTypeList");
      });
    },
    changetype(val) {
      this.query.page = 1;
      this.queryManageUserList();
    },
    search() {
      this.query.page = 1;
      this.queryManageUserList();
    },
    search1(e) {
      let ParkTypeList = this.ParkTypeList;
      ParkTypeList.forEach((item) => {
        if (item.parkid == e) {
          this.query.condition = item.caption;
        }
      });
      this.queryManageUserList();
      this.queryRole();
    },
    //查询列表
    queryManageUserList() {
      this.$ajax.queryManageUserList(this.query, (res) => {
        this.dataList = res.data;
        this.total = res.total;
        console.log(this.dataList, "查询管理员列表");
      });
    },
    //批量删除
    delAll() {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].uid);
        }
        this.Del(idlst);
      }
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
          this.$ajax.deleteManageUser({ idlst: list }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.queryManageUserList();
          });
        })
        .catch(() => {});
      this.queryManageUserList();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    cancel() {
      this.Addshow = false;
      this.newdata = {};
      setTimeout(() => {
        this.detailBol = false;
        this.forminfo = {
          ...defaultItem,
        };
      }, 200);
    },
    //添加弹框中园区和角色的下拉框
    addSelect() {
      if (5 > this.forminfo.parkRoles.length) {
        this.forminfo.parkRoles.push({ city: "", roleid: "" });
      }
    },
    //删除弹框中园区和角色的下拉框
    delSelect(item) {
      var index = this.forminfo.parkRoles.indexOf(item);
      if (index !== -1) {
        this.forminfo.parkRoles.splice(index, 1);
      }
    },
    add() {
      //console.log(this.$refs.form);
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.forminfo.uid) {
            this.forminfo.id = this.forminfo.uid;
            this.$ajax.updateManageUser(this.forminfo, (res) => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.queryManageUserList();
              console.log(this.forminfo, "修改成功");
            });
          } else {
            //
            this.$ajax.addManageUser(this.forminfo, (res) => {
              console.log(this.forminfo, "添加角色");
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.queryManageUserList();
              console.log(this.forminfo, "提交成功");
            });
          }

          this.Addshow = false;
          this.forminfo = {};
        } else {
          return false;
        }
      });
    },

    //禁用/启用
    UpDown(item) {
      let val = item.isenable == "1" ? "0" : "1";
      this.$ajax.setManageUserEnableState(
        { idlst: [item.uid], isenable: val },
        (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.queryManageUserList();
        }
      );
    },

    //修改
    Edit(item) {
      console.log(item, "修改");
      this.$set(item, "roleid", item.authRole && item.authRole.id);
      this.Addshow = true;
      //this.newdata = item;
      this.forminfo = item;
    },
    //详情
    detail(item) {
      console.log(item);
      this.detailBol = true;
      this.Addshow = true;
      this.forminfo = item;
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.query.page = 1;
      this.queryManageUserList();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.resLoading = true;
      this.queryManageUserList();
    },
  },
};
</script>

<style scoped lang="scss">
.classificationPage {
  .btn {
    margin-left: 20px;
  }

  .addBtn {
    margin-right: 50px;
    float: right;
  }

  .filter {
    line-height: 40px;
    margin: 20px 0;

    span {
      display: inline-block;
      line-height: 30px;
      margin-left: 10px;
      background-color: rgba(64, 158, 255, 0.1);
      padding: 0 10px;
      font-size: 12px;
      color: #409eff;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid rgba(64, 158, 255, 0.2);
      white-space: nowrap;
    }

    .active {
      background-color: #409eff;
      color: #fff;
    }
  }
  .toolbar {
    display: flex;
    justify-content: flex-end;
    position: relative;

    .allControl {
      position: absolute;
      left: 15px;
    }
  }
  .role {
    margin-left: 30px;
  }
}
</style>
