<template>
  <div>
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入名称"
      v-model="query.condition"
      style="width: 300px"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click="beginshow()"
      >添加优惠券</el-button
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
          <span class="el-dialog__title">{{
            newdata.id ? "修改优惠券" : "新增优惠券"
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
            <el-form-item label="请选择所属平台" prop="belong">
              <el-radio-group v-model="newdata.belong">
                <!-- <el-radio label="1">平台通用</el-radio> -->
                <el-radio label="2">园区所属</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="商品名"
              prop="caption"
              v-if="newdata.belong == '1'"
            >
              <el-input v-model="newdata.caption"></el-input>
            </el-form-item>
            <el-form-item
              label="分类"
              prop="siteid"
              v-if="newdata.belong == '1'"
            >
              <el-select v-model="newdata.siteid">
                <el-option
                  :label="n.caption"
                  :value="n.id"
                  :key="n.id"
                  v-for="n in sitelist"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="园区" prop="parkName">
              <el-select
                v-model="newdata"
                @change="changehandle($event)"
                value-key="parkName"
              >
                <el-option
                  v-for="item in list"
                  :key="item.parkid"
                  :label="item.caption"
                  :value="{ parkId: item.parkid, parkName: item.caption }"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="积分"
              prop="address"
              v-if="newdata.belong == '1'"
            >
              <el-input v-model="newdata.address"></el-input>
            </el-form-item>
            <el-form-item
              label="总数量"
              prop="address"
              v-if="newdata.belong == '1'"
            >
              <el-input v-model="newdata.address"></el-input>
            </el-form-item>
            <el-form-item
              label="限制数量"
              prop="address"
              v-if="newdata.belong == '1'"
            >
              <el-input v-model="newdata.address"></el-input>
            </el-form-item>

            <el-form-item label="图片" prop="picurl" v-if="newdata.belong == 1">
              <el-input
                v-model="newdata.picurl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button size="small" type="primary" @click="uploading('uppic')"
                >点击上传</el-button
              >
              <el-upload
                class="upload-demo"
                style="display: none"
                :on-remove="onremove"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                :on-success="onsuccsesspic"
                accept="image/jpeg,image/jpg,image/png"
                :before-upload="beforeUploadpic"
                :on-error="onerror"
                multiple
                list-type="picture-card"
              >
                <el-button size="small" type="primary" id="uppic"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <div class="pic" v-for="(n, i) in fileList" :key="n">
                  <img :src="n" alt="" class="pic" />
                  <img
                    src="../../../static/img/close.png"
                    alt=""
                    class="close"
                    @click="close(i)"
                  />
                </div>
              </div>
            </el-form-item>

            <el-form-item label="商品名" prop="mallName">
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
            </el-form-item>
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
import axios from "../../api/axios";
export default {
  name: "list",
  data() {
    return {
      fileList: [],
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
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
        belong: "2",
        mallName: "",
        parkId: "",
        parkName: "",
        putAwayStatus: "1",
      },
      rules: {
        caption: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        address: [
          { required: true, message: "地址不能为空" },
          { max: 20, message: "最多20个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
        issubscribe: [{ required: true, message: "必选", trigger: "blur" }],
        picurl: [{ required: true, message: "必填项", trigger: "blur" }],
        thumbnail: [{ required: true, message: "必填项", trigger: "blur" }],
        mallName: [{ required: true, message: "必填项", trigger: "blur" }],
        putAwayStatus: [{ required: true, message: "必填项", trigger: "blur" }],
        parkName: [{ required: true, message: "必填项", trigger: "blur" }],
        videoPicture: [
          { required: true, message: "视频封面不能为空", trigger: "blur" },
        ],
        time: [
          { required: true, message: "起始日期不能为空", trigger: "blur" },
        ],
      },
      sitelist: [],
      list: [], //获取园区
      NameList: [], //商品名称
    };
  },
  mounted() {
    window.v = this;
    this.queryCoupList();
    // this.getsitelist();
    this.queryParkList();
    this.queryMallGoodsList();
  },
  methods: {
    //获取园区下拉
    queryParkList() {
      this.$ajax.queryParkList(this.query, (res) => {
        this.list = res.data;
        console.log("查询园区列表", res.data);
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
      this.newdata.parkId = event.parkId;
      this.newdata.parkName = event.parkName;
      this.newdata.belong = "2";

      // this.NameList = [];
      // this.query.typelist = [val];
      // this.$ajax.querySiteList(this.query, (res) => {
      //   for (let i = 0; i < res.data.length; i++) {
      //     console.log("res", res.data[i].caption);
      //     this.NameList.push(res.data[i].caption);
      //   }
      // });
      // this.obj = this.list.find((item) => {
      //   //这里的就是上面遍历的数据源
      //   return item.id === val; //筛选出匹配数据
      // });
      // this.newdata.mallName = null;
    },

    close(i) {
      this.fileList.splice(i, 1);
      this.newdata.picurl = this.fileList.join();
    },
    handleSizeChange(val) {
      this.query.count = val;
      this.queryCoupList();
    },
    timeform: function (format, time) {
      //转化时间格式传输给后台
      var d = new Date(time);
      var date = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        "S+": d.getMilliseconds(),
      };
      // 正则替换文本
      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (d.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? date[k]
              : ("00" + date[k]).substr(("" + date[k]).length)
          );
        }
      }
      return format;
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    beforeUploadpic(file) {
      const isLt5M = file.size / 1024 / 1024 < 10;
      const accept =
        file.type.indexOf("jpeg") > -1 ||
        file.type.indexOf("png") > -1 ||
        file.type.indexOf("jpg") > -1;
      const limit = this.fileList.length < 10;
      if (!accept) this.$message.error("上传文件只能是图片格式!");
      if (!isLt5M) this.$message.error("上传文件大小不能超过 5MB!");
      if (!limit) this.$message.error("最多上传10张图片！");
      return accept && isLt5M && limit;
    },
    onsuccsesspic(response, file, fileList) {
      if (this.fileList.length < 10 && response.resbCode == 200) {
        this.fileList.push(response.data.url);
        this.newdata.picurl = this.fileList.join();
        this.fullscreenLoading = false;
      } else {
        this.$message.error("最多上传10个");
      }
    },
    onremove(file, fileList) {
      console.log(file);
    },
    uploading(id) {
      document.getElementById(id).click();
    },
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "thumbnail", response.data.url);
      }
    },
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "videoPicture", response.data.url);
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    search() {
      this.queryCoupList();
    },
    beginshow(data) {
      this.Addshow = true;
      this.Detailshow = false;
      this.fileList = [];
      this.newdata = {
        belong: "2",
        putAwayStatus: "1",
        mallName: "",
        parkId: "",
        parkName: "",
      };
    },
    cancel(formName) {
      this.Addshow = false;
      this.Detailshow = false;
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.addCoup(this.newdata, (res) => {
            if (res.resbCode == 200) {
              console.log("newdata", this.newdata);
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              this.Addshow = false;
              this.queryCoupList();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val;
      this.queryCoupList();
    },
    enableState(id, val) {
      this.$ajax.putAway({ idlst: [id], isenable: val }, (res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.queryCoupList();
      });
    },
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
            this.$ajax.deleteCoup({ idlst: idlst }, (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.queryCoupList();
            });
          })
          .catch(() => {});
      }
    },
    queryCoupList() {
      this.$ajax.queryCoupList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },
    // getsitelist() {
    //   this.$ajax.querySiteList(
    //     {
    //       count: 999,
    //       page: 1,
    //       parkid: sessionStorage.getItem("parkid"),
    //       typelist: [6],
    //     },
    //     (res) => {
    //       this.sitelist = res.data;
    //     }
    //   );
    // },
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
