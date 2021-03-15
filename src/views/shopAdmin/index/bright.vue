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
      <el-table-column
        prop="parkName"
        label="园区"
        align="center"
      ></el-table-column>
      <el-table-column
        label="商品名"
        prop="mallName"
        align="center"
      ></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.putAwayStatus == 1 ? "上架" : "下架"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 1)"
            v-show="scope.row.putAwayStatus == 0"
            >上架</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="enableState(scope.row.id, 0)"
            v-show="scope.row.putAwayStatus == 1"
            >下架</el-button
          >
          <el-button type="text" size="small" @click="delAll1(scope.row.id)"
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
    <!--商品新增-->
    <div class="el-dialog__wrapper" v-show="Addshow">
      <div class="el-dialog el-dialogadd" style="width: 600px">
        <div class="el-dialog__header">
          <span class="el-dialog__title">新增商品上架</span>
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
            <el-form-item label="请选择所属平台" prop="belong">
              <el-radio-group v-model="newdata.belong">
                <el-radio label="2">园区所属</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="园区名称" prop="parkName">
              <el-select
                v-model="newdata1"
                value-key="parkName"
                @change="changehandle"
              >
                <el-option
                  v-for="item in list"
                  :key="item.parkid"
                  :label="item.caption"
                  :value="{ parkId: item.parkid, parkName: item.caption }"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称" prop="mallName">
              <el-select
                v-model="newdata2"
                value-key="mallName"
                @change="changehandle1"
              >
                <el-option
                  v-for="item in showList"
                  :key="item.id"
                  :label="item.caption"
                  :value="{
                    mallId: item.id,
                    mallName: item.caption,
                    mallType: item.productClass,
                  }"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="商品名" prop="mallName">
              <el-select
                v-model="newdata.mallName"
                @change="getSiteTypeName($event)"
              >
                <el-option
                  v-for="item in NameList"
                  :value="item.caption"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="上架/下架" prop="putAwayStatus">
              <el-radio-group v-model="newdata.putAwayStatus">
                <el-radio label="1" checked="checked">上架</el-radio>
                <el-radio label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button @click="cancel('newdata')">取 消</el-button>
            <el-button type="primary" @click="add('newdata')">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "list",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      query: {
        parkid: sessionStorage.getItem("parkid")
          ? sessionStorage.getItem("parkid")
          : "",
        condition: "",
        page: 1,
        count: 10,
      },
      Addshow: false,
      Detailshow: false,

      newdata: {
        belong: "2", //园区所属
        mallName: "", //商品名称
        mallId: "", //商品id
        mallType: "", //商品类型
        parkId: "", //园区ID
        parkName: "", //园区名称
        putAwayStatus: "1", //状态
      },
      newdata1: {},
      newdata2: {},
      rules: {
        caption: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        mallName: [{ required: true, message: "必填项", trigger: "blur" }],
        putAwayStatus: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        parkName: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      sitelist: [],
      list: [], //获取园区
      showList: [], //获取所有商品
      NameList: [], //商品名称
    };
  },
  mounted() {
    window.v = this;
    this.querystoneMallList();
    // this.getsitelist();
    this.queryParkList();
    this.queryMallGoodsList();
    this.mallList();
  },
  methods: {
    //获取园区下拉
    queryParkList() {
      this.$ajax.queryParkList(this.query, (res) => {
        this.list = res.data;
        console.log("查询园区列表", res.data);
      });
    },
    //获取所有商品
    mallList() {
      this.$ajax.mallList({}, (res) => {
        this.showList = res.data;
        console.log("查询所有商品", res.data);
      });
    },
    //获取园区下拉
    queryMallGoodsList() {
      this.$ajax.queryMallGoodsList(
        {
          condition: "",
          productClass: "",
          type: "虚拟商品",
        },
        (res) => {
          this.NameList = res.data;
          console.log("优惠券", res.data);
        }
      );
    },
    getSiteTypeName(val) {},
    //一二级联动
    changehandle(event) {
      console.log(event);
      this.newdata.parkName = event.parkName;
    },
    changehandle1(event) {
      console.log(event);
      this.newdata.mallName = event.mallName;
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.querystoneMallList();
    },
    search() {
      this.querystoneMallList();
    },
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      this.newdata = {
        belong: "2", //园区所属
        mallName: "", //商品名称
        mallId: "", //商品id
        mallType: "", //商品类型
        parkId: "", //园区ID
        parkName: "", //园区名称
        putAwayStatus: "1", //状态
      };
      this.newdata1 = {};
      this.newdata2 = {};
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
    },
    //添加五彩石商品
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.addStoneMall(
            {
              putAwayStatus: this.newdata.putAwayStatus,
              belong: this.newdata.belong,
              mallId: this.newdata2.mallId,
              mallName: this.newdata2.mallName,
              mallType: this.newdata2.mallType,
              parkId: this.newdata1.parkId,
              parkName: this.newdata1.parkName,
            },
            (res) => {
              if (res.resbCode == 200) {
                console.log("newdata", this.newdata);
                this.$message({
                  type: "success",
                  message: "提交成功!",
                });
                this.Addshow = false;
                this.querystoneMallList();
              }
            }
          );
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.querystoneMallList();
    },
    enableState(id, val) {
      this.$ajax.MallPutAway({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.querystoneMallList();
      });
    },
    //删除
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
            this.$ajax.deleteStoneMall({ idlst: idlst }, (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.querystoneMallList();
            });
          })
          .catch(() => {});
      }
    },
    //删除
    delAll1(list) {
      if (!list.length) list = [list];
      this.$confirm("您确定要删除当前选中用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deleteStoneMall({ idlst: list }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.querystoneMallList();
          });
        })
        .catch(() => {});
      // this.getlist();
    },
    querystoneMallList() {
      this.$ajax.querystoneMallList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>
<style>
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
#uppic {
  padding: 2px;
}
</style>
<style lang="scss" scoped>
.addBtn {
  float: right;
  margin-right: 100px;
  margin-bottom: 30px;
}
.el-dialog__wrapper {
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  .el-dialogadd {
    width: 500px;
    margin-top: 15vh;
  }
  .el-dialogedit {
    width: 1000px;
    margin-top: 15vh;
  }
}
.pic {
  position: relative;
  display: inline-block;
  height: 60px;
  width: 80px;
  margin-right: 10px;
  .close {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
  }
}
</style>
