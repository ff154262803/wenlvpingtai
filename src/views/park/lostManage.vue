<template>
  <div class="classificationPage">
    <el-input
      placeholder="请输入内容"
      v-model="query.condition"
      clearable
      style="width: 300px"
    ></el-input>
    <el-button
      icon="el-icon-search"
      class="btn"
      @click="queryLostPropertyList"
    ></el-button>
    <el-button class="addBtn" type="primary" @click="addBtn"
      >添加失物</el-button
    >
    <el-button class="addBtn" type="primary" @click="mustKnow"
      >领取须知</el-button
    >
    <div class="filter">
      <strong>分类：</strong>
      <span
        @click="changetype('')"
        :class="query.typelist == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="item in list"
        :key="item.id"
        :class="~query.typelist.indexOf(item.id) ? 'active' : ''"
        @click="changetype(item.id)"
        >{{ item.typeName }}</span
      >
    </div>
    <div class="filter">
      <strong>时间：</strong>
      <el-date-picker
        v-model="query.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="clearNullTime(query.time)"
      >
      </el-date-picker>
    </div>
    <div class="filter">
      <strong>状态：</strong>
      <span
        @click="query.status = ''"
        :class="query.status == '' ? 'active' : ''"
        >不限</span
      >
      <span
        @click="query.status = '1'"
        :class="query.status == '1' ? 'active' : ''"
        >已认领</span
      >
      <span
        @click="query.status = '0'"
        :class="query.status == '0' ? 'active' : ''"
        >未认领</span
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
      <el-table-column prop="caption" label="失物简述" width="200">
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="scope">{{ typenamae[scope.row.type] }}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{
          scope.row.status == "0" ? "未认领" : "已认领"
        }}</template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailLost(scope.row)"
            >详情</el-button
          >
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

    <!--添加失物弹窗内容-->
    <el-dialog
      :title="['添加失物', '修改失物', '失物详情'][changeBol]"
      v-if="addBol"
      :visible.sync="addBol"
      :close-on-click-modal="false"
      @close="cancel()"
    >
      <el-form :model="addData" :rules="rules" ref="addData">
        <el-form-item
          :label="['分类名', '失物简述', '失物简述'][changeBol]"
          label-width="120px"
          prop="caption"
        >
          <el-input v-model="addData.caption" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="120px" prop="type">
          <el-select v-model="addData.type" placeholder="请选择分类">
            <el-option
              :label="item.typeName"
              :value="item.id"
              v-for="(item, index) in list"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="失物描述" label-width="120px" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入未认领失物描述"
            v-model="addData.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="图片：" label-width="120px" prop="picurl">
          <el-input
            v-model="addData.picurl"
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
            :action="$store.state.ip + '/manage/ferriswheel/resources/upload'"
            :on-progress="handleLoading"
            :on-success="onsuccsesspic"
            accept="image/jpeg,image/jpg,image/png"
            :before-upload="beforeUploadpic"
            :on-error="onerror"
            :limit="addData.upName || 3"
            multiple
            list-type="picture-card"
          >
            <el-button size="small" type="primary" id="uppic"
              >点击上传</el-button
            >
          </el-upload>
          <div style="margin-top: 20px">
            <div
              class="pic"
              v-for="(n, i) in fileList"
              :key="n"
              v-if="fileList.length"
            >
              <img :src="$store.state.resip + n" alt="" class="pic" />
              <img
                src="../../../static/img/close.png"
                alt=""
                class="close"
                @click="close(i)"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        :model="claimData"
        :rules="rules"
        ref="claimData"
        v-if="claimerBol"
        style="overflow: hidden"
      >
        <div class="el-dialog__header">
          <span class="el-dialog__title">认领人信息</span>
        </div>
        <el-form-item label="姓名" label-width="120px" prop="claimName">
          <el-input
            v-model="claimData.claimName"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" label-width="120px" prop="claimPhone">
          <el-input
            v-model="claimData.claimPhone"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="证件" label-width="120px" prop="claimCard">
          <el-input
            v-model="claimData.claimCard"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="claim('claimData')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!claimerBol">
        <el-button @click="addBol = false" v-if="!detailLostBol"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submit('addData')"
          v-if="!detailLostBol"
          >确 定</el-button
        >
        <el-button type="primary" @click="claimClick()" v-else>认 领</el-button>
      </div>
    </el-dialog>
    <!--领取须知-->
    <el-dialog
      title="领取须知"
      :visible.sync="mustKnowBol"
      :close-on-click-modal="false"
    >
      <el-form :model="mustKnowData" :rules="rules" ref="mustKnowData">
        <el-form-item label="领取须知" label-width="120px" prop="content">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入领取时必须的条件"
            v-model="mustKnowData.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="领取地点" label-width="120px" prop="address">
          <el-input
            v-model="mustKnowData.address"
            style="width: 200px"
          ></el-input>
          <el-button
            type="primary"
            plain
            icon="el-icon-location-outline"
            class="btn"
            @click="mapBol = true"
          ></el-button>
        </el-form-item>
        <el-form-item label="咨询电话" label-width="120px" prop="number">
          <el-input
            v-model="mustKnowData.number"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mustKnowBol = false">取 消</el-button>
        <el-button type="primary" @click="mustKnowSubmit('mustKnowData')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--地图-->
    <div class="el-dialog__wrapper" v-show="mapBol">
      <div class="el-dialog el-dialogadd">
        <div class="el-dialog__header">
          <span class="el-dialog__title">选择地址</span>
          <button
            class="el-dialog__headerbtn"
            aria-label="Close"
            type="button"
            @click="mapBol = false"
          >
            <i class="el-dialog__close el-icon el-icon-close"></i>
          </button>
        </div>
        <div class="el-dialog__body">
          <div style="height: 400px" id="myMap"></div>
          <el-input
            type="text"
            id="tipinput"
            v-model="tipinput"
            placeholder="请输入您想查询的位置"
            style="width: 200px"
          ></el-input>
        </div>
        <div class="el-dialog__footer">
          <div class="dialog-footer">
            <el-button @click="mapBol = false">取 消</el-button>
            <el-button type="primary" @click="setMap">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "lostManage",
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
      const phoneReg2 = /0\d{2}-\d{7,8}/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (phoneReg.test(value) || phoneReg2.test(value)) {
          callback();
        } else {
          callback(new Error("电话号码格式不正确"));
        }
      }, 100);
    };
    let checkCard = (rule, val, callback) => {
      const card = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!val) {
        return callback(new Error("证件号码不能为空"));
      }
      setTimeout(() => {
        if (card.test(val)) {
          callback();
        } else {
          callback(new Error("身份证号码格式不正确"));
        }
      }, 100);
    };
    return {
      list: [],
      total: 0,
      addBol: false,
      detailLostBol: false,
      mapBol: false,
      changeBol: 0,
      claimerBol: false,
      typenamae: {},
      query: {
        page: 1,
        count: 10,
        typelist: [],
        condition: "",
        groupId: "9",
        time: [],
        startDate: "",
        endDate: "",
        status: "",
        parkid: sessionStorage.getItem("parkid"),
      },
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      rules: {
        caption: [
          { required: true, message: "请输入失物简述", trigger: "blur" },
          { max: 50, message: "最多50个字符", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择失物分类", trigger: "change" },
        ],
        content: [
          { required: true, message: "请输入失物描述", trigger: "blur" },
          { max: 500, message: "最多500个字符", trigger: "blur" },
        ],
        // content1: [{required: true, message: '请输入未认领失物描述', trigger: 'blur'}, {max: 500, message: '最多500个字符', trigger: 'blur'}],
        address: [
          { required: true, message: "请输入领取地点", trigger: "blur" },
          { max: 50, message: "最多50个字符", trigger: "blur" },
        ],
        number: [{ required: true, validator: checkPhone, trigger: "blur" }], //{required: true,message: '请输入电话', trigger: 'blur'},
        claimPhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ],
        claimName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        claimCard: [{ required: true, validator: checkCard, trigger: "blur" }],
      },
      fileList: [],
      addData: {},
      claimData: {},
      mustKnowData: {},
      mustKnowBol: false,
      tableData: [],
      multipleSelection: [],
      map: "",
      tipinput: "",
      marker: "",
      geocoder: "",
    };
  },
  mounted() {
    this.queryTypeList();
    this.queryLostPropertyList();
  },
  methods: {
    //查询失物的分类
    queryTypeList() {
      this.$ajax.queryTypeList(
        { condition: "", count: 999, groupId: "9", page: 1 },
        (res) => {
          this.list = res.data;
          res.data.forEach((n, i) => {
            this.typenamae[n.id] = n.typeName;
          });
        }
      );
    },
    //查询
    queryLostPropertyList() {
      this.$ajax.queryLostPropertyList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
        console.log("this.tableData", this.tableData);
        // if (res.totalPage < this.query.page) {//过滤时页数bug
        //     this.query.page = 1
        //     this.queryLostPropertyList()
        // }
      });
    },
    //改变分类
    changetype(val) {
      if (val)
        ~this.query.typelist.indexOf(val)
          ? this.query.typelist.splice(this.query.typelist.indexOf(val), 1)
          : this.query.typelist.push(val);
      else this.query.typelist = [];
      this.queryLostPropertyList();
    },
    //改变时间
    clearNullTime(time) {
      this.query.startDate = time ? time[0] : "";
      this.query.endDate = time ? time[1] : "";
      // this.queryLostPropertyList();
    },
    //分页
    handleSizeChange(val) {
      this.query.count = val;
      this.queryLostPropertyList();
    },
    //详情
    detailLost(item) {
      this.changeBol = 2;
      this.addBol = true;
      this.detailLostBol = true;
      this.addData = item;
      this.fileList = item.picurl.length ? item.picurl.split(",") : [];
    },
    //修改
    edit(data) {
      this.changeBol = 1;
      this.addBol = true;
      this.addData = data;
      this.fileList = data.picurl.length ? data.picurl.split(",") : [];
    },
    cancel() {
      this.changeBol = 0;
      this.claimData = {};
      this.addBol = false;
      this.claimerBol = false;
      this.detailLostBol = false;
    },
    //认领
    claimClick(data) {
      if (+this.addData.status) {
        this.$message.error("该物品已经被认领");
      } else {
        this.claimerBol = true;
      }
    },
    claim(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.claimData.id = this.addData.id;
          this.$ajax.reclaim(this.claimData, (res) => {
            this.cancel();
            this.$message.success("认领成功");
            this.queryLostPropertyList();
          });
        }
      });
    },

    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            this.$ajax.updateLostProperty(
              { id: this.addData.id, parameters: this.addData },
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.addBol = false;
                this.queryLostPropertyList();
              }
            );
          } else {
            this.addData.parkid = sessionStorage.getItem("parkid");
            this.$ajax.addLostProperty(this.addData, (res) => {
              this.$message({
                type: "success",
                message: "添加成功!",
              });
              this.addBol = false;
              this.queryLostPropertyList();
            });
          }
        } else {
          return false;
        }
      });
    },
    setMap() {
      let position = this.marker.getPosition();
      this.mustKnowData.lat = position.lat;
      this.mustKnowData.lon = position.lng;
      AMap.plugin(["AMap.Geocoder"], () => {
        this.geocoder = new AMap.Geocoder({
          city: "", //城市设为北京，默认：“全国”
          radius: 1000, //范围，默认：500
        });
      });
      this.geocoder.getAddress(
        [position.lng, position.lat],
        (status, result) => {
          if (status === "complete" && result.regeocode) {
            var address = result.regeocode.formattedAddress;
            if (!this.mustKnowData.address) this.mustKnowData.address = address;
            this.mapBol = false;
          } else {
            log.error("根据经纬度查询地址失败");
          }
        }
      );
    },
    mustKnowSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.addInstructions(this.mustKnowData, (res) => {
            this.mustKnowBol = false;
            this.$message({
              type: "success",
              message: "设置成功!",
            });
          });
        }
      });
    },
    //添加按钮
    addBtn() {
      this.addBol = true;
      this.addData = {};
      this.fileList = [];
    },
    mustKnow() {
      this.$ajax.getParkInstructions(
        { id: sessionStorage.getItem("parkid") },
        (res) => {
          this.mustKnowData = res.data
            ? res.data
            : { parkid: sessionStorage.getItem("parkid") };
          this.mapSet(res.data);
          this.mustKnowBol = true;
        }
      );
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    mapSet(position) {
      let lnglat = position ? [position.lon, position.lat] : [116.397, 39.91];
      this.map = new AMap.Map("myMap", {
        resizeEnable: true,
        expandZoomRange: true,
        zoom: 14,
        center: lnglat,
        zooms: [3, 19],
      });
      this.marker = new AMap.Marker({
        map: this.map,
        draggable: true,
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat,
      });

      var auto = new AMap.Autocomplete({ input: "tipinput" }); //输入提示
      var placeSearch = new AMap.PlaceSearch({ map: this.map }); //构造地点查询类
      AMap.event.addListener(auto, "select", (e) => {
        if (this.marker) {
          this.marker.setMap(null);
          this.marker = "";
        }
        if (!e.poi.location) {
          this.$message.error("请选择具体地点，而非线路");
          return false;
        }
        this.marker = new AMap.Marker({
          map: this.map,
          draggable: true,
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          position: [e.poi.location.lng, e.poi.location.lat],
        });
        this.map.setFitView();
      }); //注册监听，当选中某条记录时会触发
    },
    uploading(id) {
      document.getElementById(id).click();
    },
    onremove(file, fileList) {
      console.log(file);
    },
    //删除图标
    close(i) {
      this.fileList.splice(i, 1);
      this.addData.picurl = this.fileList.join();
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    beforeUploadpic(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      const accept =
        file.type.indexOf("jpeg") > -1 ||
        file.type.indexOf("png") > -1 ||
        file.type.indexOf("jpg") > -1;
      if (!accept) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return accept && isLt5M;
    },
    onsuccsesspic(response, file, fileList) {
      if (response.resbCode == 200) {
        this.fileList.push(response.data.shortUrl);
        this.addData.picurl = this.fileList.join();
        this.fullscreenLoading = false;
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },

    // UpDown(id) {
    //     this.$ajax.checkDeleteType({id: id}, res => {
    //         if (res.resbCode = 200) {
    //             this.$confirm('您确定要删除该类型吗?', '提示', {
    //                 confirmButtonText: '确定',
    //                 cancelButtonText: '取消',
    //                 type: 'warning'
    //             }).then(() => {
    //                 this.$ajax.deleteType({id: id}, res => {
    //                     this.$message({
    //                         type: 'success',
    //                         message: '删除成功!'
    //                     });
    //                     this.queryLostPropertyList()
    //                 })
    //             }).catch(() => {
    //             });
    //         }
    //
    //     }, err => {
    //         if (err.resbCode = 996) {
    //             this.$confirm('该类型已被使用您确定要删除该类型吗?', '提示', {
    //                 confirmButtonText: '确定',
    //                 cancelButtonText: '取消',
    //                 type: 'warning'
    //             }).then(() => {
    //                 this.$ajax.deleteType({id: id}, res => {
    //                     this.$message({
    //                         type: 'success',
    //                         message: '删除成功!'
    //                     });
    //                     this.queryLostPropertyList()
    //                 })
    //             }).catch(() => {
    //             });
    //         }
    //
    //     })
    // },
    handleCurrentChange(val) {
      // 切换元页
      this.query.page = val; //.toString()
      this.resLoading = true;
      this.queryLostPropertyList();
    },
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        this.queryLostPropertyList();
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
    margin-top: 10px;

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
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);

    .el-dialogadd {
      width: 700px;
      margin-top: 15vh;
    }

    .el-dialogedit {
      width: 1000px;
      margin-top: 15vh;
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

body /deep/ .amap-sug-result {
  z-index: 99999;
}
</style>
