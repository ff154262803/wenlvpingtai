<template>
  <div class="classificationPage">
    <!--        <el-input placeholder="请输入手机号" v-model="query.phone" clearable style="width: 300px"></el-input>-->
    <!--        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>-->
    <el-button class="addBtn" type="primary" @click="addBtn">分配</el-button>
    <div class="filter">
      <strong>物品：</strong>
      <span
        @click="query.leaseresid = ''"
        :class="query.leaseresid == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="item in leaseresidList"
        :key="item.id"
        :class="query.leaseresid == item.id ? 'active' : ''"
        @click="query.leaseresid = item.id"
        >{{ item.caption }}</span
      >
    </div>
    <div class="filter">
      <strong>租赁地点：</strong>
      <span
        @click="query.servicecenterid = ''"
        :class="query.servicecenterid == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="item in servicecenteridList"
        :key="item.id"
        :class="query.servicecenterid == item.id ? 'active' : ''"
        @click="query.servicecenterid = item.id"
        >{{ item.caption }}</span
      >
    </div>
    <!--表格内容-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="leaserescaption" label="物品"> </el-table-column>
      <el-table-column prop="servicecentercaption" label="租赁地点">
      </el-table-column>
      <el-table-column prop="unused" label="剩余"> </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
      <!--            <div class="allControl">-->
      <!--                <el-button size="small" @click="enableState(1)">启用</el-button>-->
      <!--                <el-button size="small" @click="enableState(0)">禁用</el-button>-->
      <!--            </div>-->
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
    <!--弹窗内容-->
    <el-dialog
      title="添加分类"
      :visible.sync="addBol"
      :close-on-click-modal="false"
      @close="addshow = true"
    >
      <el-form :model="addData" :rules="rules" ref="addData">
        <el-form-item label="物品" label-width="120px" prop="leaseresid">
          <el-select
            v-model="addData.leaseresid"
            placeholder="请选择分类"
            @change="change"
          >
            <el-option
              :label="item.caption"
              :value="item.id"
              v-for="(item, index) in leaseresidList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地点" label-width="120px" prop="servicecenterid">
          <el-select
            v-model="addData.servicecenterid"
            placeholder="请选择分类"
            @change="change"
          >
            <el-option
              :label="item.caption"
              :value="item.id"
              v-for="(item, index) in servicecenteridList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" label-width="120px" prop="unused">
          <el-input
            v-model.number="addData.unused"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-button type="text" v-if="!addshow">该地点的物品已经存在</el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="(addshow = true), (addBol = false)">取 消</el-button>
        <el-button
          type="primary"
          @click="subAdd('addData')"
          v-if="send == '' && addshow"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="submit('addData')"
          v-if="send == 'change'"
          >修 改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "leaseDistribution",
  data() {
    return {
      leaseresidList: [],
      servicecenteridList: [],
      total: 0,
      addBol: false,
      addshow: true,
      send: "",
      typenamae: {},
      query: {
        page: 1,
        count: 10,
        leaseresid: "",
        servicecenterid: "",
        parkid: sessionStorage.getItem("parkid"),
      },
      rules: {
        leaseresid: [
          { required: true, message: "请选择物品", trigger: "change" },
        ],
        servicecenterid: [
          { required: true, message: "请选择地点", trigger: "change" },
        ],
        unused: [
          {
            type: "number",
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
      },
      addData: {},
      tableData: [],
      multipleSelection: [],
    };
  },
  mounted() {
    this.getServiceCenterList();
    this.getLeaseResNames();
    this.queryLeaseResManagement();
  },
  methods: {
    //获取物品
    getLeaseResNames() {
      this.$ajax.getLeaseResNames(
        { id: sessionStorage.getItem("parkid") },
        (res) => {
          this.leaseresidList = res.data;
        }
      );
    },
    //获取服务中心
    getServiceCenterList() {
      this.$ajax.getServiceCenterList(
        { id: sessionStorage.getItem("parkid") },
        (res) => {
          this.servicecenteridList = res.data;
        }
      );
    },
    //查询
    queryLeaseResManagement() {
      this.$ajax.queryLeaseResManagement(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    //改变分类
    change(val) {
      if (this.addData.leaseresid && this.addData.servicecenterid) {
        var data = { ...this.query, ...this.addData };
        this.$ajax.queryLeaseResManagement(data, (res) => {
          this.addshow = !res.data.length;
        });
      }
    },

    addBtn() {
      this.addBol = true;
      this.addData = {};
      this.send = "";
    },
    edit(data) {
      console.log(data);
      this.addBol = true;
      this.addData = data;
      this.send = "change";
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid, this.addData);
        if (valid) {
          this.addData.parkid = sessionStorage.getItem("parkid");
          this.$ajax.updateLeaseResManagement(this.addData, (res) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.addBol = false;
            this.queryLeaseResManagement();
          });
        } else {
          return false;
        }
      });
    },
    subAdd(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid, this.addData);
        if (valid) {
          this.addData.parkid = sessionStorage.getItem("parkid");
          this.$ajax.allocationLeaseRes(this.addData, (res) => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.addBol = false;
            this.queryLeaseResManagement();
          });
        } else {
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // enableState(val) {
    //     if (this.multipleSelection.length == 0) {
    //         this.$message({
    //             type: 'warning',
    //             message: '尚未选择任何内容!'
    //         });
    //     } else {
    //         let idlst = []
    //         for (let i = 0; i < this.multipleSelection.length; i++) {
    //             idlst.push(this.multipleSelection[i].id)
    //         }
    //         this.$ajax.setTypeEnableState({idlst: idlst, isenable: val}, res => {
    //             this.$message({
    //                 type: 'success',
    //                 message: '设置成功!'
    //             });
    //             this.queryLeaseResManagement()
    //         })
    //     }
    // },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.queryLeaseResManagement();
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val; //.toString()
      this.resLoading = true;
      this.queryLeaseResManagement();
    },
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        this.queryLeaseResManagement();
      },
      deep: true,
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
    margin-left: 80px;
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

  .toolbar {
    display: flex;
    justify-content: flex-end;
    position: relative;

    .allControl {
      position: absolute;
      left: 15px;
    }
  }

  .pic {
    position: relative;
    display: inline-block;
    height: 100px;
    width: 100px;
    margin-right: 10px;

    .close {
      position: absolute;
      right: -10px;
      top: -10px;
      width: 20px;
    }
  }
}
</style>
