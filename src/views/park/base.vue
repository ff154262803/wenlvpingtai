<template>
  <div class="mianbox">
    <div class="box">
      <div class="menu">
        <el-row class="p">
          <el-col :span="16">
            <div>基本信息</div>
          </el-col>
          <el-col :span="8">
            <div class="btnright">
              <el-button
                type="info"
                plain
                @click="enableState(0)"
                v-show="detail.isenable == 1"
                >禁用
              </el-button>
              <el-button
                type="info"
                plain
                @click="enableState(1)"
                v-show="detail.isenable == 0"
                >启用
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="24">
            <div><span>parkID：</span>{{ detail.parkid }}</div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>园区名：</span>{{ detail.caption }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('caption')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>分类：</span>{{ detail.typeName }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('type')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div>
              <span>省市：</span>{{ detail.province }} - {{ detail.city }}
            </div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('city')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>园区门票价：</span>{{ detail.price }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('price')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div>
              <span>开放时间：</span>{{ detail.opentime }}
              <span v-if="!detail.opentime">例：每年11月至次年3月</span>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('opentime')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>咨询电话：</span>{{ detail.packnumber }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('packnumber')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>创建时间：</span>{{ detail.createtime }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box" v-loading="fullscreenLoading">
      <div class="menu">
        <el-row class="p">
          <el-col :span="14">
            <div>AR资源信息</div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>AR收费：</span>{{ detail.arprice }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('arprice')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>AR折扣：</span>{{ detail.ardiscount }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('ardiscount')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div><span>折扣期限：</span>{{ detail.discountperiod }}</div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('discountperiod')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
        <el-row class="list" style="height: 80px">
          <el-col :span="22">
            <div><span>AR资源包：</span>{{ detail.ardownloadurl }}</div>
          </el-col>
          <el-upload
            class="upload"
            accept="application/zip"
            :action="$store.state.ip + '/resources/uploadResource'"
            style="display: none"
            :on-progress="handleLoading"
            :on-success="onsuccsess"
            :before-upload="beforeUpload"
            :data="uploaddata"
            :on-error="onerror"
          >
            <el-button size="small" type="primary" id="upzip"
              >点击上传</el-button
            >
            <div class="el-upload__tip" slot="tip">
              只能上传zip文件，且不超过50M
            </div>
          </el-upload>
          <el-col :span="2">
            <div class="icon">
              <img
                src="../../../static/img/del.png"
                alt=""
                style="width: 25px"
                v-show="detail.ardownloadurl != ''"
                @click="deling()"
              />
              <img
                src="../../../static/img/upload.png"
                alt=""
                v-show="detail.ardownloadurl == ''"
                @click="uploading()"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box box1">
      <div class="menu">
        <el-row class="p">
          <el-col :span="14">
            <div>管理模块范围</div>
          </el-col>
        </el-row>
        <el-row class="list">
          <el-col :span="22">
            <div class="limits" v-for="item in detail.menu" :key="item.id">
              {{ item.caption }}、
            </div>
          </el-col>
          <el-col :span="2">
            <div class="icon" @click="edit('menu')">
              <img src="../../../static/img/edit.png" alt="" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box boxr">
      <div class="menu">
        <el-row class="p">
          <el-col :span="10">
            <div>园区范围</div>
          </el-col>
          <el-col :span="14">
            <div class="btnright">
              <el-button
                type="info"
                plain
                @click="showchange()"
                v-show="showedit == false && redit == false"
              >
                显示范围修改<span style="color: #fb2a39">——</span></el-button
              >
              <el-button
                type="info"
                plain
                @click="rchange()"
                v-show="showedit == false && redit == false"
              >
                园区范围修改<span style="color: #2a88fb">——</span></el-button
              >
              <el-button
                type="info"
                plain
                v-show="showedit == true || redit == true"
                @click="editcancle"
                >取消
              </el-button>
              <el-button
                type="info"
                plain
                v-show="showedit == true || redit == true"
                @click="editsubmit"
                >确定
              </el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="map" id="GDMAP"></div>
            <el-input
              type="text"
              id="tipinput"
              v-show="showedit == true || redit == true"
              v-model="tipinput"
              placeholder="请输入您想查询的位置名称"
              style="width: 200px"
            ></el-input>
            <!-- <el-input type="text" id="tipinput" v-show="showedit==true||redit==true" v-model="tipinput" placeholder="请输入您想查询的坐标以逗号隔开，例如39,116" style="width:200px"></el-input> -->
          </el-col>
        </el-row>
      </div>
    </div>
    <!--修改园区名-->
    <el-dialog
      title="修改园区名"
      :visible.sync="captionShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="caption"
        label-width="100px"
      >
        <el-form-item label="园区名" prop="caption">
          <el-input v-model="editdata.caption"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('caption')">取 消</el-button>
        <el-button type="primary" @click="add('caption')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改分类-->
    <el-dialog
      title="修改分类"
      :visible.sync="typeShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="type"
        label-width="100px"
      >
        <el-form-item label="分类" prop="type">
          <el-select v-model="editdata.type">
            <el-option
              v-for="item in list"
              :label="item.typeName"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('type')">取 消</el-button>
        <el-button type="primary" @click="add('type')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改省市-->
    <el-dialog
      title="修改省市"
      :visible.sync="cityShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="city"
        label-width="100px"
      >
        <el-form-item label="省市" prop="city">
          <el-select v-model="editdata.province" @change="selectcity">
            <el-option
              v-for="item in area"
              :label="item.name"
              :value="item.name"
              :key="item.name"
            ></el-option>
          </el-select>
          -
          <el-select v-model="editdata.city">
            <el-option
              v-for="item in areacity"
              :label="item.name"
              :value="item.name"
              :key="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('city')">取 消</el-button>
        <el-button type="primary" @click="add('city')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改园区门票价-->
    <el-dialog
      title="修改园区门票价"
      :visible.sync="priceShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="price"
        label-width="100px"
      >
        <el-form-item label="门票价格" prop="price">
          <el-input v-model="editdata.price"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('price')">取 消</el-button>
        <el-button type="primary" @click="add('price')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改开放时间-->
    <el-dialog
      title="修改开放时间"
      :visible.sync="opentimeShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="opentime"
        label-width="100px"
      >
        <el-form-item label="开放时间" prop="opentime">
          <el-input v-model="editdata.opentime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('opentime')">取 消</el-button>
        <el-button type="primary" @click="add('opentime')">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改咨询电话-->
    <el-dialog
      title="修改咨询电话"
      :visible.sync="packnumberShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="packnumber"
        label-width="100px"
      >
        <el-form-item label="咨询电话" prop="packnumber">
          <el-input v-model="editdata.packnumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('packnumber')">取 消</el-button>
        <el-button type="primary" @click="add('packnumber')">确 定</el-button>
      </div>
    </el-dialog>
    <!--园区新增-->
    <el-dialog
      title="修改AR收费"
      :visible.sync="arpriceShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="arprice"
        label-width="100px"
      >
        <el-form-item label="AR收费" prop="arprice">
          <el-input v-model="editdata.arprice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('arprice')">取 消</el-button>
        <el-button type="primary" @click="add('arprice')">确 定</el-button>
      </div>
    </el-dialog>
    <!--园区新增-->
    <el-dialog
      title="修改AR折扣"
      :visible.sync="ardiscountShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editdata"
        :rules="detailrules"
        ref="ardiscount"
        label-width="100px"
      >
        <el-form-item label="AR折扣" prop="ardiscount">
          <el-input v-model="editdata.ardiscount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ardiscount')">取 消</el-button>
        <el-button type="primary" @click="add('ardiscount')">确 定</el-button>
      </div>
    </el-dialog>
    <!--园区新增-->
    <el-dialog
      title="修改折扣期限"
      :visible.sync="discountperiodShow"
      class="demo-box"
      width="590px"
      :close-on-click-modal="false"
    >
      <el-form :model="editdata" ref="discountperiod" label-width="100px">
        <el-form-item label="AR折扣" prop="discountperiod">
          <el-date-picker
            v-model="editdata.discountperiodarr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('discountperiod')">取 消</el-button>
        <el-button type="primary" @click="add('discountperiod')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!--管理模块新增-->
    <el-dialog
      title="管理模块范围修改"
      :visible.sync="menuShow"
      class="demo-box"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form ref="menu" label-width="100px">
        <el-form-item label="">
          <el-checkbox-group v-model="menuArr">
            <el-checkbox
              v-for="item in ParkMenuList"
              :key="item.id"
              :label="item.id"
              >{{ item.caption }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('menu')">取 消</el-button>
        <el-button type="primary" @click="editParkMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { areaArr } from "../../api/city.js";

export default {
  data() {
    let checkPrice = (rule, value, callback) => {
      if (!/^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/.test(value) || value > 1000) {
        callback(new Error("请输入最大1000且最多两位小数的数字"));
      } else {
        callback();
      }
    };
    var checkARPrice = (rule, value, callback) => {
      if (!/^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/.test(value) || value > 1000) {
        callback(new Error("请输入最大1000且最多两位小数的数字"));
      } else {
        callback();
      }
    };
    var checkDiscount = (rule, value, callback) => {
      if (!/^(([1-9]+\d*)|([1-9]+\d*\.\d{1,2}))$/.test(value) || value > 10) {
        callback(new Error("请输入最大10且最多两位小数的数字"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
          callback(new Error("请输入正确的号码"));
        } else {
          callback();
        }
      }
    };
    return {
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      fullscreenLoading: false,
      parkid: sessionStorage.getItem("parkid")
        ? sessionStorage.getItem("parkid")
        : "",
      electronicfencelist: [],
      areafencelist: [],
      detail: {},
      editdata: {},
      list: [],
      area: [],
      //用来存储二级菜单
      menuArr: [],
      areacity: [],
      MenuList: {},
      ParkMenuList: [],
      checkarr: [],
      detailrules: {
        caption: [
          { required: true, message: "请输入园区名", trigger: "blur" },
          {
            max: 20,
            message: "最多20个字符",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请选择园区类型", trigger: "change" },
        ],
        city: [
          { required: true, message: "请选择完整省市", trigger: "change" },
        ],
        price: [{ validator: checkPrice, trigger: "blur" }],
        opentime: [{ max: 20, message: "最多20个字符", trigger: "blur" }],
        packnumber: [{ validator: checkPhone, trigger: "blur" }],
        arprice: [{ validator: checkARPrice, trigger: "blur" }],
        ardiscount: [{ validator: checkDiscount, trigger: "blur" }],
      },
      captionShow: false,
      typeShow: false,
      cityShow: false,
      priceShow: false,
      opentimeShow: false,
      packnumberShow: false,
      arpriceShow: false,
      discountperiodShow: false,
      ardiscountShow: false,
      menuShow: false,
      //
      GDMap: "",
      GDPolygon: "",
      GDPolyBlue: "",
      GDPolygon2: "",
      GDPolyRed: "",
      GDMarker: "",
      showedit: false,
      redit: false,
      tipinput: "",
      placeSearch: "",
    };
  },
  created() {
    //管理模块范围初始化
    for (let key in this.ParkMenuList) {
      this.$set(this.menuArr, key, []);
    }
  },
  mounted() {
    window.v = this;
    // 高德地图对象
    this.GDMap = new AMap.Map("GDMAP", {
      resizeEnable: true,
      expandZoomRange: true,
      zoom: 14,
      zooms: [3, 19],
    });
    //地图多边形对象
    this.GDPolygon = new AMap.Polygon({
      map: this.GDMap,
      strokeColor: "#2a88fb",
      strokeOpacity: 1,
      strokeWeigth: 3,
      fillColor: "#4196ff",
      fillOpacity: 0.35,
    });
    this.GDPolyBlue = new AMap.PolyEditor(this.GDMap, this.GDPolygon);
    this.GDPolygon2 = new AMap.Polygon({
      map: this.GDMap,
      strokeColor: "#fb2a39",
      strokeOpacity: 1,
      strokeWeigth: 3,
      fillColor: "#ff4153",
      fillOpacity: 0.35,
    });
    this.GDPolyRed = new AMap.PolyEditor(this.GDMap, this.GDPolygon2);
    this.GDMarker = new AMap.Marker({
      map: this.GDMap,
      draggable: false,
      cursor: "move",
      animation: "AMAP_ANIMATION_DROP",
    });
    var autoOptions = {
      input: "tipinput",
    };
    var auto = new AMap.Autocomplete(autoOptions);
    this.placeSearch = new AMap.PlaceSearch({
      map: this.GDMap,
    }); //构造地点查询类
    AMap.event.addListener(auto, "select", this.select); //注册监听，当选中某条记录时会触发
    this.getdetail();
    this.getlist();
    //获取园区二级菜单列表
    this.getParkMenuList();
    this.area = areaArr;
  },
  methods: {
    select(e) {
      this.GDPolyBlue.close();
      this.GDPolyRed.close();
      var x = e.poi.location.lng;
      var y = e.poi.location.lat;
      if (this.redit) {
        var curPath = [];
        for (var i = 0; i < 3; i++) {
          var cur = [];
          switch (i) {
            case 0:
              cur.push(Number(x) - 0.01);
              cur.push(Number(y) - 0.01);
              break;
            case 1:
              cur.push(Number(x));
              cur.push(Number(y) + 0.01);
              break;
            case 2:
              cur.push(Number(x) + 0.01);
              cur.push(Number(y) - 0.01);
              break;
          }
          curPath.push(cur);
        }
        this.GDPolygon.setPath(curPath);
        this.GDPolyBlue = new AMap.PolyEditor(this.GDMap, this.GDPolygon);
        this.GDPolyBlue.open();
        this.GDMap.setFitView();
      }
      if (this.showedit) {
        var curPath = [];
        for (var i = 0; i < 3; i++) {
          var cur = [];
          switch (i) {
            case 0:
              cur.push(Number(x) - 0.01);
              cur.push(Number(y) - 0.01);
              break;
            case 1:
              cur.push(Number(x));
              cur.push(Number(y) + 0.01);
              break;
            case 2:
              cur.push(Number(x) + 0.01);
              cur.push(Number(y) - 0.01);
              break;
          }
          curPath.push(cur);
        }
        this.GDPolygon2.setPath(curPath);
        this.GDMarker.setPosition([x, y]);
        this.GDPolyRed = new AMap.PolyEditor(this.GDMap, this.GDPolygon2);
        this.GDPolyRed.open();
        this.GDMap.setFitView();
      }
    },
    deling() {
      this.$confirm("您确定要删除AR资源包吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.updatePark(
            { id: this.parkid, parameters: { ardownloadurl: "", arsize: 0 } },
            (res) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getdetail();
            }
          );
        })
        .catch(() => {});
    },
    uploading() {
      document.getElementById("upzip").click();
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 500;
      console.log(file, file.type.includes("zip"));
      const accept = file.type.indexOf("zip") > -1;
      if (!accept) {
        this.$message.error("上传文件只能是zip格式!");
      }
      if (!isLt50M) {
        this.$message.error("上传文件大小不能超过 500MB!");
      }
      return accept && isLt50M;
    },
    handleLoading() {
      this.fullscreenLoading = true;
    },
    onsuccsess(response, file, fileList) {
      if (response.resb == 200) {
        this.$ajax.updatePark(
          {
            id: this.parkid,
            parameters: { ardownloadurl: response.url, arsize: file.size },
          },
          (res) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.getdetail();
            this.fullscreenLoading = false;
          }
        );
      } else {
        this.fullscreenLoading = false;
        this.$message({
          type: "error",
          message: "上传失败!",
        });
      }
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    getlist() {
      this.$ajax.getParkTypeList({}, (res) => {
        this.list = res.data;
      });
    },
    //获取园区列表查询
    getParkMenuList() {
      this.$ajax.getParkMenuList({}, (res) => {
        this.ParkMenuList = res.data;
      });
    },
    getdetail() {
      if (this.parkid) {
        this.$ajax.getParkDetails({ id: this.parkid }, (res) => {
          console.log("基础信息", res.data);
          this.detail = res.data;
          this.electronicfencelist = res.data.electronicfencelist
            ? JSON.parse(res.data.electronicfencelist)
            : [];
          this.areafencelist = res.data.areafencelist
            ? JSON.parse(res.data.areafencelist)
            : [];
          this.y = res.data.lat ? res.data.lat : this.GDMap.getCenter().lat;
          this.x = res.data.lon ? res.data.lon : this.GDMap.getCenter().lng;

          if (this.electronicfencelist.length) {
            this.GDPolygon.setPath(this.electronicfencelist);
            this.GDMarker.setPosition([this.x, this.y]);
            this.GDMap.setFitView();
          } else {
            var curPath = [];
            var center = this.GDMap.getCenter(); //获取当前地图中心位置
            var x = center.lng;
            var y = center.lat;
            for (var i = 0; i < 3; i++) {
              var cur = [];
              switch (i) {
                case 0:
                  cur.push(Number(x) - 0.01);
                  cur.push(Number(y) - 0.01);
                  break;
                case 1:
                  cur.push(Number(x));
                  cur.push(Number(y) + 0.01);
                  break;
                case 2:
                  cur.push(Number(x) + 0.01);
                  cur.push(Number(y) - 0.01);
                  break;
              }
              curPath.push(cur);
            }
            this.GDPolygon.setPath(curPath);
            this.GDMap.setFitView();
          }
          if (this.areafencelist.length) {
            this.GDPolygon2.setPath(this.areafencelist);
            this.GDMap.setFitView();
          } else {
            var curPath = [];
            var center = this.GDMap.getCenter(); //获取当前地图中心位置
            var x = center.lng;
            var y = center.lat;
            for (var i = 0; i < 4; i++) {
              var cur = [];
              switch (i) {
                case 0:
                  cur.push(Number(x) - 0.01);
                  cur.push(Number(y) + 0.01);
                  break;
                case 1:
                  cur.push(Number(x) + 0.01);
                  cur.push(Number(y) + 0.01);
                  break;
                case 2:
                  cur.push(Number(x) + 0.01);
                  cur.push(Number(y) - 0.01);
                  break;
                case 3:
                  cur.push(Number(x) - 0.01);
                  cur.push(Number(y) - 0.01);
                  break;
              }
              curPath.push(cur);
            }
            this.GDPolygon2.setPath(curPath);
            this.GDMap.setFitView();
          }
        });
      }
    },
    //多选
    CheckAllChange(row) {
      this.checkarr.push(row.id);
      this.menuArr = [...new Set(this.checkarr)];
      console.log(this.menuArr);
    },
    //编辑管理模块范围
    editParkMenu() {
      this.$ajax.editParkMenu(
        {
          idlst: [...this.menuArr],
          parkid: sessionStorage.getItem("parkid") * 1,
        },
        (res) => {
          this.menuShow = false;
          this.getdetail();
        }
      );
    },
    //修改
    edit(formName) {
      this[formName + "Show"] = true;
      this.editdata = { ...this.detail };
      console.log("this.editdata", this.editdata);
      if (
        formName == "discountperiod" &&
        this.detail.discountperiod.indexOf(" - ") > 0
      ) {
        this.editdata.discountperiodarr = this.detail.discountperiod.split(
          " - "
        );
      } else if (formName == "menu") {
        //设置一个自定义数组
        let arr = [];
        //循环数组中menu
        for (let i in this.editdata.menu) {
          //取出的值放入自定义的数组中
          arr.push(this.editdata.menu[i].menuid);
        }
        //把自定义的数组赋值给menuArr
        this.menuArr = arr;
      }
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this[formName + "Show"] = false;
          let prams = {};
          if (formName == "city") {
            prams.province = this.editdata.province;
            prams.city = this.editdata.city;
          } else if (formName == "discountperiod") {
            prams.discountperiod =
              this.editdata.discountperiodarr[0] +
              " - " +
              this.editdata.discountperiodarr[1];
          } else if (formName == "menu") {
            console.log(this.ParkMenuList);
          } else {
            prams[formName] = this.editdata[formName];
          }
          this.$ajax.updatePark(
            { id: this.parkid, parameters: prams },
            (res) => {
              console.log("data", prams);
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.getdetail();
            }
          );
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this[formName + "Show"] = false;
    },
    selectcity() {
      this.editdata.city = null;
      var dt = this.area.filter((n) => {
        if (n.name == this.editdata.province) return true;
      });
      dt.length == 0 ? (this.areacity = []) : (this.areacity = dt[0].child);
    },
    enableState(val) {
      if (val) {
        if (!this.detail.areafencelist) {
          this.$message.error("请设置园区显示范围");
          return false;
        }
        if (!this.detail.electronicfencelist) {
          this.$message.error("请设置园区范围");
          return false;
        }
      }

      // return false
      this.$ajax.setParkEnableState(
        { idlst: [this.parkid], isenable: val },
        (res) => {
          this.detail.isenable = val;
          this.$message({
            type: "success",
            message: "设置成功!",
          });
        }
      );
    },
    del() {
      this.$confirm("您确定要删除该园区吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deletePark({ idlst: [this.parkid] }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    showchange() {
      this.showedit = true;
      this.tipinput = "";
      this.GDPolyRed.open();
      this.GDPolygon.hide();
      this.GDMarker.hide();
    },
    rchange() {
      this.GDMarker.setDraggable(true);
      this.tipinput = "";
      this.redit = true;
      this.GDPolygon2.hide();
      this.GDPolyBlue.open();
    },
    editsubmit() {
      if (this.showedit) {
        var path = this.GDPolygon2.getPath();
        var curpath = [];
        for (let i = 0; i < path.length; i++) {
          var cur = [path[i].lng, path[i].lat];
          curpath.push(cur);
        }
        this.$ajax.updatePark(
          {
            id: this.parkid,
            parameters: { areafencelist: JSON.stringify(curpath) },
          },
          (res) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.showedit = false;
            this.GDPolygon.show();
            this.GDMarker.show();
            this.GDPolyBlue.close();
            this.GDPolyRed.close();
            this.getdetail();
          }
        );
      }
      if (this.redit) {
        var path = this.GDPolygon.getPath();
        var curpath = [];
        var marker = this.GDMarker.getPosition();
        for (let i = 0; i < path.length; i++) {
          var cur = [path[i].lng, path[i].lat];
          curpath.push(cur);
        }
        if (!this.GDPolygon.contains(marker)) {
          this.$message({
            type: "error",
            message: "导航点不位于园区内!",
          });
          return;
        }
        this.$ajax.updatePark(
          {
            id: this.parkid,
            parameters: {
              electronicfencelist: JSON.stringify(curpath),
              lat: marker.lat,
              lon: marker.lng,
            },
          },
          (res) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.redit = false;
            this.GDPolygon2.show();
            this.GDMarker.setDraggable(false);
            this.GDPolyBlue.close();
            this.GDPolyRed.close();
            this.getdetail();
          }
        );
      }
    },

    editcancle() {
      this.electronicfencelist = this.detail.electronicfencelist
        ? JSON.parse(this.detail.electronicfencelist)
        : [];
      this.areafencelist = this.detail.areafencelist
        ? JSON.parse(this.detail.areafencelist)
        : [];
      this.y = this.detail.lat ? this.detail.lat : this.GDMap.getCenter().lat;
      this.x = this.detail.lon ? this.detail.lon : this.GDMap.getCenter().lng;

      if (this.electronicfencelist.length) {
        this.GDPolygon.setPath(this.electronicfencelist);
        this.GDMarker.setPosition([this.x, this.y]);
        this.GDMap.setFitView();
      } else {
        var curPath = [];
        var center = this.GDMap.getCenter(); //获取当前地图中心位置
        var x = center.lng;
        var y = center.lat;
        for (var i = 0; i < 3; i++) {
          var cur = [];
          switch (i) {
            case 0:
              cur.push(Number(x) - 0.01);
              cur.push(Number(y) - 0.01);
              break;
            case 1:
              cur.push(Number(x));
              cur.push(Number(y) + 0.01);
              break;
            case 2:
              cur.push(Number(x) + 0.01);
              cur.push(Number(y) - 0.01);
              break;
          }
          curPath.push(cur);
        }
        this.GDPolygon.setPath(curPath);
        this.GDMap.setFitView();
      }
      if (this.areafencelist.length) {
        this.GDPolygon2.setPath(this.areafencelist);
        this.GDMap.setFitView();
      } else {
        var curPath = [];
        var center = this.GDMap.getCenter(); //获取当前地图中心位置
        var x = center.lng;
        var y = center.lat;
        for (var i = 0; i < 4; i++) {
          var cur = [];
          switch (i) {
            case 0:
              cur.push(Number(x) - 0.01);
              cur.push(Number(y) + 0.01);
              break;
            case 1:
              cur.push(Number(x) + 0.01);
              cur.push(Number(y) + 0.01);
              break;
            case 2:
              cur.push(Number(x) + 0.01);
              cur.push(Number(y) - 0.01);
              break;
            case 3:
              cur.push(Number(x) - 0.01);
              cur.push(Number(y) - 0.01);
              break;
          }
          curPath.push(cur);
        }
        this.GDPolygon2.setPath(curPath);
        this.GDMap.setFitView();
      }
      this.redit = false;
      this.showedit = false;
      this.GDPolygon.show();
      this.GDPolygon2.show();
      this.GDMarker.show();
      this.GDPolyRed.close();
      this.GDPolyBlue.close();
      this.GDMarker.setDraggable(false);
    },
  },
};
</script>
<style lang="scss" scoped>
.mianbox {
  position: relative;
}

.box:nth-child(2) {
  margin-top: 50px;
}

.box {
  width: 45%;
  border: 1px solid #d4d4d4;

  .p {
    background: #f5f5f5;

    .btnright {
      text-align: right;
    }
  }

  .el-row {
    word-break: break-all;
    height: 40px;
    line-height: 40px;
  }

  .el-col {
    text-indent: 2px;
  }

  .list {
    border-bottom: 1px solid #d4d4d4;

    span {
      color: #999;
    }

    .icon {
      height: 30px;
      margin: 5px;
    }

    .icon img {
      width: 30px;
    }
  }
}

.box1 {
  margin-top: 30px;
}

.box1 .limits {
  display: inline;
}

.box1 .list {
  height: 120px;
}

/* 管理模块范围弹框字体大小 */
.el-checkbox__label {
  font-size: 30px !important;
}

.boxr {
  width: 52%;
  position: absolute;
  right: 0;
  top: 0;

  .map {
    height: 400px;
  }
}
</style>