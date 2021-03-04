<template>
  <div>
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入商品名称"
      v-model="query.condition"
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click="beginshow()"
      >添加</el-button
    >
    <div class="filter">
      <strong>景点类型：</strong>
      <span @click="changelevel('all')" :class="num == 999 ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="(item, index) in list"
        :key="index"
        :class="num == index ? 'active' : ''"
        @click="changelevel(item.typeName, index)"
        >{{ item.typeName }}</span
      >
    </div>
    <!-- 表格区 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column prop="mallName" label="商品名"></el-table-column>
      <el-table-column prop="siteType" label="景点类型"></el-table-column>
      <el-table-column prop="siteName" label="景点名"></el-table-column>
      <el-table-column prop="siteName" label="取货地点"></el-table-column>
      <el-table-column prop="siteName" label="商家电话"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="del(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--底部工具条-->
    <el-col
      :span="24"
      class="toolbar"
      style="display: flex; justify-content: flex-end; position: relative"
    >
      <div style="position: absolute; left: 10px; top: 5px">
        <el-button @click="delAll()">删除</el-button>
        <el-button @click="enableState(1)">启用</el-button>
        <el-button @click="enableState(0)">禁用</el-button>
      </div>
      <el-pagination
        background
        layout="total,sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 20, 30, 50]"
        :current-page.sync="query.page"
        :page-size="query.count"
        :total="total"
      >
      </el-pagination>
      <el-button size="small">确定</el-button>
    </el-col>
    <!--景点新增-->
    <div class="el-dialog__wrapper" v-show="Addshow">
      <div class="el-dialog">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            newdata.id ? "修改商品分布信息" : "添加商品分布信息"
          }}</span>
          <button
            class="el-dialog__headerbtn"
            aria-label="Close"
            type="button"
            @click="cancel('newdata')"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <el-form
            :model="newdata"
            :rules="rules"
            ref="newdata"
            label-width="120px"
          >
            <el-form-item label="商品" prop="mallName">
              <el-select v-model="newdata.mallName">
                <el-option
                  v-for="(item, index) in GoodsList"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="景点类型" prop="siteType">
              <el-select
                v-model="newdata.siteType"
                @change="getSiteType($event)"
              >
                <el-option
                  v-for="item in list"
                  :label="item.typeName"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="景点名称" prop="siteName">
              <el-select
                v-model="newdata.siteName"
                @change="getSiteTypeName($event)"
              >
                <el-option
                  v-for="(item, index) in NameList"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="取货地点" prop="siteName">
              <el-select v-model="newdata" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商家电话" prop="siteName">
              <el-input
                :disabled="disabled"
                v-model="newdata.mobile"
                placeholder="请输入手机号"
                style="width: 217px"
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="amend"
              ></el-button>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer">
            <div class="dialog-footer">
              <el-button @click="cancel('newdata')">取 消</el-button>
              <el-button type="primary" @click="add('newdata')"
                >确 定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabled: false,
      num: 999,
      obj: {},
      parkid: sessionStorage.getItem("parkid"),
      tableData: [],
      multipleSelection: [],
      total: 0,
      GoodsList: [], //获取商品名称
      list: [], //获取景点信息
      NameList: [], //景点下景点名称
      //查询商品分布管理列表
      query: {
        parkid: sessionStorage.getItem("parkid"),
        page: 1,
        count: 10,
        condition: "",
        productClass: "",
        type: "",
        typelist: [],
      },
      Addshow: false,
      newdata: {
        parkId: sessionStorage.getItem("parkid"),
        mallName: "",
        siteName: "",
        siteType: "",
        status: "1",
        mobile: "15131045042",
      },
      rules: {
        mallName: [{ required: true, message: "请选择商品", trigger: "burl" }],
        siteType: [
          { required: true, message: "请选择景点类型", trigger: "burl" },
        ],
        siteName: [
          { required: true, message: "请选择景点名称", trigger: "burl" },
        ],
      },
    };
  },
  mounted() {
    if (!this.parkid) {
      this.$router.push({ path: "/parklist" });
      return false;
    }
    this.get();
    this.getlist();
    this.queryMallGoodsList();
  },
  methods: {
    //删除多条数据
    delAll() {
      if (this.multipleSelection.length != 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$confirm("您确定要删除选中商品吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$ajax.deleteSiteDistributed({ idlst: idlst }, (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.get();
            });
          })
          .catch(() => {});
      }
    },
    //删除一行数据
    del(id) {
      this.$confirm("您确定要删除选中景点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deleteSiteDistributed({ idlst: [id] }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.get();
          });
        })
        .catch(() => {});
    },
    //一二级联动
    getSiteType(val) {
      this.NameList = [];
      this.query.typelist = [val];
      this.$ajax.querySiteList(this.query, (res) => {
        for (let i = 0; i < res.data.length; i++) {
          console.log("res", res.data[i].caption);
          this.NameList.push(res.data[i].caption);
        }
      });
      this.obj = this.list.find((item) => {
        //这里的就是上面遍历的数据源
        return item.id === val; //筛选出匹配数据
      });
      this.newdata.siteName = null;
    },
    getSiteTypeName(val) {},
    amend() {
      this.disabled = false;
    },
    beginshow(data) {
      this.disabled = true;
      this.Addshow = true;
      if (data) {
        this.newdata = { ...data };
        this.newdata.mobile = "15131045042";
        this.NameList = this.NameList;
      } else {
        this.NameList = [];
        this.newdata = {
          parkId: sessionStorage.getItem("parkid"),
          mallName: "",
          siteName: "",
          siteType: "",
          status: "1",
          mobile: "15131045042",
        };
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.newdata = {
        parkId: sessionStorage.getItem("parkid"),
        mallName: "",
        siteName: "",
        siteType: "",
        status: "1",
        mobile: "15131045042",
      };
      this.$refs[formName].resetFields(); //关闭弹框后清除表单验证
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.id) {
            this.newdata.siteType = this.obj.typeName;
            this.$ajax.updateSiteDistributed(
              {
                id: this.newdata.id,
                parameters: {
                  mallName: this.newdata.mallName,
                  siteName: this.newdata.siteName,
                  siteType: this.newdata.siteType,
                  status: this.newdata.status,
                },
              },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.Addshow = false;
                this.query.typelist = [];
                this.get();
              }
            );
          } else {
            this.newdata.siteType = this.obj.typeName;
            this.$ajax.addSiteDistributed(this.newdata, (res) => {
              this.Addshow = false;
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.query.typelist = [];
              this.get();
            });
          }
        } else {
          return false;
        }
      });
    },
    changelevel(item, ind) {
      if (item == "all") {
        this.num = 999;
        this.query.typelist = [];
      } else {
        this.num = ind;
        this.query.typelist = [item];
      }
      this.query.page = 1;
      this.get();
    },
    getlist() {
      this.$ajax.getSiteTypeList({}, (res) => {
        this.list = res.data;
      });
    },
    search() {
      this.query.page = 1;
      this.get();
    },
    //启用禁用
    enableState(val) {
      if (this.multipleSelection.length != 0) {
        let idlst = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          idlst.push(this.multipleSelection[i].id);
        }
        this.$ajax.setSiteDistributedEnableState(
          { idlst: idlst, isenable: val },
          (res) => {
            this.$message({
              type: "success",
              message: "设置成功!",
            });
            this.get();
          }
        );
      }
    },
    //获取商品名称
    queryMallGoodsList() {
      this.$ajax.queryMallGoodsList(this.query, (res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.GoodsList.push(res.data[i].caption);
        }
      });
    },
    //获取景点列表
    get() {
      this.$ajax.querySiteDistributedList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = parseInt(val);
      this.get();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.get();
    },
  },
};
</script>
<style lang="scss" scoped>
.addBtn {
  float: right;
  margin-right: 100px;
}
/deep/ .el-input {
  width: 450px;
}
.filter {
  line-height: 40px;
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
.el-dialog__wrapper {
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  .el-dialog {
    width: 600px;
    margin-top: 15vh;
  }
}
</style>
