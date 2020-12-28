<template>
  <div class="classificationPage">
    <el-input
      placeholder="角色名"
      v-model="query.condition"
      clearable
      @clear="search"
      style="width: 300px"
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
    </div>
    <!-- <div class="filter">
      <strong>权限：</strong>
      <el-select v-model="query.roleid" clearable @change="search">
        <el-option value label="无限制"></el-option>
        <el-option v-for="item in dataList" :value="item.id" :key="item.id" :label="item.name"></el-option>
      </el-select>
    </div> -->
    <!--表格内容-->
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 30px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column
        prop="name"
        label="角色名"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.isenable == 0 ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column prop="account" label="权限">
        <template slot-scope="scope">{{
          scope.row.permissions.map((n) => n.name).join("、")
        }}</template>
      </el-table-column>

      <el-table-column prop="parkName" label="所属园区" align="center">
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createtime"
        show-overflow-tooltips
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="Del(scope.row.id)"
            >删除</el-button
          >
          <el-button type="text" size="small" @click="UpDown(scope.row)">{{
            scope.row.isenable == 1 ? "禁用" : "启用"
          }}</el-button>
          <el-button type="text" size="small" @click="Edit(scope.row)"
            >修改</el-button
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
      ></el-pagination>
      <el-button size="small">确定</el-button>
    </el-col>
    <!--角色新增-->
    <el-dialog
      :title="newdata.id ? '修改角色' : '添加角色'"
      :visible.sync="Addshow"
      v-if="Addshow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form
        :model="newdata"
        :rules="rules"
        ref="newdata"
        label-width="100px"
      >
        <el-form-item label="园区" prop="garden">
          <el-select
            v-model="newdata.parkid"
            @change="getSiteType($event)"
            placeholder="请选择园区"
          >
            <el-option
              v-for="item in ParkTypeList"
              :value="item.parkid"
              :label="item.caption"
              :key="item.parkid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input
            v-model="newdata.name"
            placeholder="请输入角色名"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item label="账号" prop="name">
          <el-tree
            :default-expand-all="true"
            :data="roleTree"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('newdata')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/vuex/store";

export default {
  name: "user",
  data() {
    return {
      total: 0,
      dataList: [],
      roleList: [],
      //查询园区列表
      ParkList: [],
      query: {
        condition: "",
        page: 1,
        count: 10,
      },
      ParkTypeList: [],
      multipleSelection: [],
      Addshow: false,
      newdata: {},
      rules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }],
      },
      roleTree: [
        {
          id: "1",
          name: "园区管理",
          children: [],
        },
      ],
      defaultProps: {
        children: "children",
        label: "name",
      },
      parkId: "",
    };
  },

  mounted() {
    this.queryRole();
    this.queryParkList();
    //this.getParkDetails();
    //this.queryManageUserList();
  },
  methods: {
    //实现选择园区以后，对应的权限就会发生改变
    getSiteType(val) {
      //园区的parkId = 选择的 parkid
      this.parkId = val;
      //权限选择树 设为空
      this.roleTree[0].children = [];
      //重新调用接口 获取权限上树
      this.getParkDetails();
      console.log("val", val);
    },
    beginshow() {
      this.Addshow = true;
      this.newdata = {
        id: "",
        name: "",
        parkid: "",
        pemissions: "",
      };
      this.$refs.tree && this.$refs.tree.setCheckedKeys([]);
    },
    search() {
      this.query.page = 1;
      //this.queryManageUserList();
      this.queryRole();
    },
    //获取园区权限树形
    getParkDetails() {
      this.$ajax.getParkDetails({ id: this.parkId * 1 }, (res) => {
        console.log("res", res);
        for (let i = 0; i < res.data.menu.length; i++) {
          let obj = {};
          obj.id = res.data.menu[i].menuid;
          obj.name = res.data.menu[i].caption;
          this.roleTree[0].children.push(obj);
        }
        console.log("this.dataList", this.roleTree[0].children);
      });
    },
    //查询角色
    queryRole() {
      this.$ajax.queryRole(this.query, (res) => {
        this.dataList = res.data;
        this.total = res.total;
        console.log("查询角色", this.dataList);
      });
    },
    //获取平台用户列表（查询列表）
    queryManageUserList() {
      this.$ajax.queryManageUserList(this.query, (res) => {
        this.dataList = res.data;
        this.total = res.total;
        console.log(this.dataList, ".....");
      });
    },
    //查询园区列表
    queryParkList() {
      this.$ajax.queryParkList(this.query, (res) => {
        this.ParkTypeList = res.data;
        console.log("查询园区列表", this.ParkTypeList);
      });
    },
    //批量删除
    delAll() {
      if (this.multipleSelection.length > 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
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
          this.$ajax.deleteRole({ idlst: list }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.queryRole();
          });
        })
        .catch(() => {});
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    cancel() {
      this.Addshow = false;
      this.newdata = {};
      this.$refs.tree.setCheckedKeys([]);
    },
    //增加
    add(formName) {
      let pemissions = this.$refs.tree.getCheckedKeys();
      if (!pemissions.length) {
        this.$message({ type: "warning", message: "请至少选择一项权限!" });
        return false;
      }
      this.newdata.pemissions = pemissions.filter((n) => n >>> 0);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.id) {
            this.$ajax.updateRole(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.Addshow = false;
              this.queryRole();
            });
          } else {
            console.log(this.newdata);
            this.$ajax.addRole(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.Addshow = false;
              this.queryRole();
            });
          }
        } else {
          return false;
        }
      });
    },
    //禁用启用
    UpDown(item) {
      let val = item.isenable == "1" ? "0" : "1";
      this.$ajax.setRoleEnableState(
        { idlst: [item.id], isenable: val },
        (res) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.queryRole();
        }
      );
    },
    //修改
    Edit(item) {
      console.log("item", item);
      //权限选择树 设为空
      this.roleTree[0].children = [];
      this.Addshow = true;
      this.parkId = item.parkid;
      this.getParkDetails();
      this.newdata = item;
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(item.permissions.map((n) => n.id));
      }, 100);
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.query.page = 1;
      this.queryRole();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.resLoading = true;
      this.queryRole();
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
}
</style>
