<template>
  <div>
    <!-- 过滤区 -->
    <el-input
      placeholder="请输入商品名称"
      v-model="query.condition"
      style="width: 300px"
      clearable
      @clear="get"
    ></el-input>
    <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
    <el-button class="addBtn" type="primary" @click="beginshow()"
      >添加</el-button
    >
    <div class="filter">
      <strong>类型：</strong>
      <span
        @click="changelevel('all')"
        :class="query.type == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="(item, index) in typelist"
        :key="index"
        :class="query.type == item ? 'active' : ''"
        @click="changelevel(item)"
        >{{ item }}</span
      >
    </div>
    <div class="filter">
      <strong>分类：</strong>
      <span
        @click="changetype('all')"
        :class="query.productClass == '' ? 'active' : ''"
        >不限</span
      >
      <span
        v-for="(item, index) in typeNamelist"
        :key="index"
        :class="query.productClass == item ? 'active' : ''"
        @click="changetype(item)"
        >{{ item }}</span
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
      <el-table-column
        prop="caption"
        label="商品名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      ></el-table-column>
      <el-table-column prop="price" label="积分价格" align="center">
        <template slot-scope="scope">{{
          scope.row.scorePrice == "" || scope.row.scorePrice == null
            ? "不支持"
            : scope.row.scorePrice + "积分"
        }}</template>
      </el-table-column>
      <el-table-column prop="price" label="五彩石价格" align="center">
        <template slot-scope="scope">{{
          scope.row.stonePrice == "" || scope.row.stonePrice == null
            ? "不支持"
            : scope.row.stonePrice + "五彩石"
        }}</template>
      </el-table-column>
      <el-table-column label="人民币价格" align="center">
        <template slot-scope="scope">{{
          scope.row.price != "" || scope.row.price == null
            ? scope.row.price + "元"
            : "不支持"
        }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "禁用" : "启用"
        }}</template>
      </el-table-column>
      <el-table-column
        prop="banNum"
        label="批量限制"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="productClass"
        label="商品分类"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column prop="bind" label="绑定" align="center">
        <template slot-scope="scope">{{
          scope.row.bind == 0 ? "无" : "有"
        }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="beginshow(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click="detail(scope.row)"
            >详情</el-button
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
    <!--商品新增-->
    <div class="el-dialog__wrapper" v-show="Addshow">
      <div class="el-dialog">
        <div class="el-dialog__header">
          <span class="el-dialog__title">{{
            detailBol ? "商品详情" : newdata.id ? "修改商品" : "添加商品"
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
            <el-form-item label="类型" prop="type">
              <el-select v-model="newdata.type" :disabled="detailBol">
                <el-option
                  v-for="item in typelist"
                  :label="item"
                  :value="item"
                  :key="item.index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称" prop="caption">
              <el-input
                maxlength="20"
                v-model="newdata.caption"
                placeholder="请填写商品名称"
                :disabled="detailBol"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="picurl">
              <el-input
                v-model="newdata.picurl"
                style="width: 200px; display: none"
              >
              </el-input>
              <el-button size="small" type="primary" @click="uploading('uppic')"
                >点击上传</el-button
              >
              <span class="hint">图片推荐375*234</span>
              <el-upload
                :disabled="detailBol"
                class="upload-demo"
                style="display: none"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                :on-success="onsuccsesspic"
                accept="image/jpeg,image/jpg,image/png"
                :before-upload="beforeUploadpic"
                :on-error="onerror"
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
                  <img :src="n" alt="" class="pic" />
                  <img
                    :disabled="detailBol"
                    src="../../../../static/img/close.png"
                    alt=""
                    class="close"
                    @click="close(i)"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item label="缩略图" prop="thumbnail">
              <el-input
                v-model="newdata.thumbnail"
                style="width: 200px; display: none"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="uploading('uppict')"
                >点击上传</el-button
              ><span class="hint">图片推荐375*234</span>
              <el-upload
                :disabled="detailBol"
                class="upload-demo"
                style="display: none"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                accept="image/jpeg,image/jpg,image/png"
                :on-success="onsuccsess"
                :before-upload="beforeUploadpic1"
                :on-error="onerror"
                list-type="picture"
              >
                <el-button size="small" type="primary" id="uppict"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <img
                  :src="newdata.thumbnail"
                  alt=""
                  class="pic"
                  v-if="newdata.thumbnail"
                  style="width: 80px"
                  ref="pic"
                />
              </div>
            </el-form-item>

            <el-form-item label="价格" prop="stonePrice">
              <span class="rate">五彩石</span>

              <el-radio-group
                v-model="newdata.status1"
                size="small"
                @change="ceshi"
              >
                <el-radio-button label="支持"></el-radio-button>
                <el-radio-button label="不支持"></el-radio-button>
              </el-radio-group>
              <el-input
                v-if="newdata.status1 == '支持'"
                class="import"
                v-model="newdata.stonePrice"
                @mousewheel.native.prevent
                oninput="value=value.replace(/[^0-9.]/g,'')"
                placeholder="请填写价格"
                type="number"
                :disabled="detailBol"
                style="width: 200px"
                ><template slot="append">五彩石</template></el-input
              >
            </el-form-item>
            <el-form-item label="" prop="price">
              <span class="rate">人民币</span>
              <el-radio-group
                v-model="newdata.status2"
                size="small"
                @change="ceshi1"
              >
                <el-radio-button label="支持"></el-radio-button>
                <el-radio-button label="不支持"></el-radio-button>
              </el-radio-group>
              <el-input
                v-if="newdata.status2 == '支持'"
                class="import"
                v-model="newdata.price"
                @mousewheel.native.prevent
                oninput="value=value.replace(/[^0-9.]/g,'')"
                placeholder="请填写价格"
                type="number"
                :disabled="detailBol"
                style="width: 200px"
                ><template slot="append">元</template></el-input
              >
            </el-form-item>
            <el-form-item label="" prop="scorePrice">
              <span class="rate">积分</span>
              <el-radio-group
                v-model="newdata.status3"
                size="small"
                @change="ceshi2"
              >
                <el-radio-button label="支持"></el-radio-button>
                <el-radio-button label="不支持"></el-radio-button>
              </el-radio-group>
              <el-input
                v-if="newdata.status3 == '支持'"
                class="import"
                v-model="newdata.scorePrice"
                @mousewheel.native.prevent
                oninput="value=value.replace(/[^0-9.]/g,'')"
                placeholder="请填写价格"
                type="number"
                :disabled="detailBol"
                style="width: 200px"
                ><template slot="append">积分</template></el-input
              >
            </el-form-item>
            <el-form-item label="商品简介" prop="typeName">
              <el-input
                v-model="newdata.typeName"
                placeholder="请填写描述"
                :disabled="detailBol"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="批量限制" prop="banNum">
              <el-input
                v-model="newdata.banNum"
                placeholder="请填写格式为：10-20"
                :disabled="detailBol"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="productClass">
              <el-select v-model="newdata.productClass" :disabled="detailBol">
                <el-option
                  v-for="item in typeNamelist"
                  :label="item"
                  :value="item"
                  :key="item"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="绑定" prop="bind">
              <el-radio v-model="newdata.bind" label="1" :disabled="detailBol"
                >有</el-radio
              >
              <el-radio v-model="newdata.bind" label="0" :disabled="detailBol"
                >无</el-radio
              >
            </el-form-item>
            <el-form-item
              label="绑定方法"
              prop="bindMethod"
              v-if="newdata.bind == '1'"
            >
              <el-input
                style="width: 400px"
                v-model="newdata.bindMethod"
                placeholder="请输入绑定方法"
                :disabled="detailBol"
              ></el-input>
            </el-form-item>
            <el-form-item label="购买须知" prop="buyNotice">
              <el-input
                style="width: 400px"
                type="textarea"
                :rows="2"
                placeholder="请输入购买须知"
                v-model="newdata.buyNotice"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="present">
              <el-radio
                v-model="newdata.present"
                label="1"
                :disabled="detailBol"
                >长图</el-radio
              >
              <el-radio
                v-model="newdata.present"
                label="0"
                :disabled="detailBol"
                >富文本编辑器</el-radio
              >
            </el-form-item>
            <el-form-item
              label=""
              prop="presentUrl"
              v-if="newdata.present == '1'"
            >
              <el-input
                v-model="newdata.presentUrl"
                style="width: 200px; display: none"
              ></el-input>
              <el-button
                size="small"
                type="primary"
                @click="uploading('uppict1')"
                >点击上传</el-button
              ><span class="hint">图片宽度推荐350</span>
              <el-upload
                :disabled="detailBol"
                class="upload-demo"
                style="display: none"
                :data="uploaddata"
                :action="
                  $store.state.ip + '/manage/ferriswheel/resources/upload'
                "
                :on-progress="handleLoading"
                accept="image/jpeg,image/jpg,image/png"
                :on-success="onsuccsess1"
                :before-upload="beforeUploadpic1"
                :on-error="onerror"
                list-type="picture"
              >
                <el-button size="small" type="primary" id="uppict1"
                  >点击上传</el-button
                >
              </el-upload>
              <div style="margin-top: 20px">
                <img
                  :src="newdata.presentUrl"
                  alt=""
                  class="pic"
                  v-if="newdata.presentUrl"
                  style="width: 80px"
                  ref="pic"
                />
              </div>
            </el-form-item>
            <el-form-item
              label=""
              prop="manual"
              v-if="newdata.present == '0'"
              v-model="newdata.manual"
            >
              <div style="height: 500px">
                <tinymce-editor
                  ref="editor"
                  v-model="h5.content"
                ></tinymce-editor>
              </div>
            </el-form-item>
          </el-form>
          <div class="el-dialog__footer" v-if="!detailBol">
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
import TinymceEditor from "@/components/editor";
export default {
  name: "list",
  components: {
    TinymceEditor,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
          callback(new Error("请输入正确的号码"));
        } else {
          callback();
        }
      }
    };
    var validateAcquaintance = (rule, value, callback) => {
      // let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
      let reg = /^(([1-9]\d*|0)|((([1-9]{1}\d*)|(0{1}))(\.\d{2})))$/;
      if (value == null || value == "") {
        if (!value) {
          callback();
        }
      } else if (value) {
        if (value < 0 || value > 10000) {
          callback(new Error("价格必须在0-10000之间"));
        } else if (!value) {
          callback(new Error("单价不能为空"));
        } else if (!reg.test(value)) {
          callback(new Error("请输入正确格式的单价,必须添加两位小数"));
        } else if (value.length > 10) {
          callback(new Error("最多可输入10个字符"));
        } else if (this.status1 == "不支持") {
          callback();
        } else {
          callback();
        }
      }
    };
    var validateAcquaintance1 = (rule, value, callback) => {
      // let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
      let reg = /^(([1-9]\d*|0)|((([1-9]{1}\d*)|(0{1}))(\.\d{2})))$/;
      if (value == null || value == "") {
        if (!value) {
          callback();
        }
      } else if (value) {
        if (value < 0 || value > 10000) {
          callback(new Error("价格必须在0-10000之间"));
        } else if (!value) {
          callback(new Error("单价不能为空"));
        } else if (!reg.test(value)) {
          callback(new Error("请输入正确格式的单价,必须添加两位小数"));
        } else if (value.length > 10) {
          callback(new Error("最多可输入10个字符"));
        } else if (this.status1 == "不支持") {
          callback();
        } else {
          callback();
        }
      }
    };
    var validateAcquaintance2 = (rule, value, callback) => {
      // let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
      let reg = /^(([1-9]\d*|0)|((([1-9]{1}\d*)|(0{1}))(\.\d{2})))$/;
      if (value == null || value == "") {
        if (!value) {
          callback();
        }
      } else if (value) {
        if (value < 0 || value > 10000) {
          callback(new Error("价格必须在0-10000之间"));
        } else if (!value) {
          callback(new Error("单价不能为空"));
        } else if (!reg.test(value)) {
          callback(new Error("请输入正确格式的单价,必须添加两位小数"));
        } else if (value.length > 10) {
          callback(new Error("最多可输入10个字符"));
        } else if (this.status1 == "不支持") {
          callback();
        } else {
          callback();
        }
      }
    };
    return {
      merchantList: [], //商家名称
      detailBol: false,
      typeNamelist: [], //商品分类名称
      typelist: ["实物商品", "虚拟商品"], //商品类型
      fileList: [],
      h5: {
        content: "",
      },
      parkid: sessionStorage.getItem("parkid"),
      tableData: [],
      multipleSelection: [],
      total: 0,
      list: [],
      query: {
        caption: "",
        productClass: "",
        type: "",
        page: 1,
        count: 10,
      },
      Addshow: false,
      newdata: {
        //parkid: sessionStorage.getItem("parkid"),
        banNum: "", //批量限制
        bind: "1", //绑定
        bindMethod: "", //绑定方法
        buyNotice: "", //购买须知
        caption: "", //商品名称
        manual: "", //富文本
        picurl: "", //图片路径
        present: "1", //商品介绍 1：长图 2：富文本
        presentUrl: "", //长图
        price: "", //人民币价格
        productClass: "", //商品分类
        scorePrice: "", //积分价格
        status: "1", //启用禁用
        stonePrice: "", //五彩石价格
        thumbnail: "", //缩略图
        type: "", //商品类型
        typeName: "", //描述
        status1: "支持", //五彩石
        status2: "支持", //人民币
        status3: "支持", //积分
      },
      //图片上传时附带的额外参数
      uploaddata: {
        type: "",
        uKey: JSON.parse(sessionStorage.getItem("user")).uKey,
      },
      rules: {
        caption: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择商品类型", trigger: "blur" }],
        present: [
          { required: true, message: "请选择商品介绍", trigger: "blur" },
        ],
        buyNotice: [
          { required: true, message: "请输入购买须知", trigger: "blur" },
        ],
        presentUrl: [
          { required: true, message: "请上传长图", trigger: "blur" },
        ],
        bind: [{ required: true, message: "请选择是否绑定", trigger: "blur" }],
        bindMethod: [
          { required: true, message: "请输入绑定方法", trigger: "blur" },
        ],
        thumbnail: [
          { required: true, message: "请上传缩略图", trigger: "blur" },
        ],
        banNum: [
          {
            required: true,
            message: "请输入批量限制 例：10-20",
            trigger: "blur",
          },
          {
            pattern: /^\d+-\d+$/,
            message: "格式输入错误，请重新输入 例：10-20",
            trigger: "blur",
          },
        ],
        picurl: [{ required: true, message: "请添加商品图", trigger: "blur" }],
        scorePrice: [
          {
            required: true,
            // message: "请输入积分价格",
            validator: validateAcquaintance, // 自定义验证
            trigger: "blur",
          },
          // {
          //   validator: validateAcquaintance, // 自定义验证
          //   trigger: "blur",
          // },
        ],
        price: [
          {
            required: true,
            message: "请输入价格",
            validator: validateAcquaintance1,
            trigger: "blur",
          },
          // {
          //   validator: validateAcquaintance, // 自定义验证
          //   trigger: "blur",
          // },
        ],
        stonePrice: [
          {
            required: true,
            message: "请输入五彩石价格",
            validator: validateAcquaintance2,
            trigger: "blur",
          },
          // {
          //   validator: validateAcquaintance,
          //   trigger: "blur",
          // },
        ],
        typeName: [{ required: true, message: "请输入描述", trigger: "blur" }],
        productClass: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
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
    this.queryTypeList();
  },
  methods: {
    //测试
    ceshi(val) {
      this.$forceUpdate();
      if (val == "不支持") {
        this.newdata.stonePrice = "";
      }
    },
    ceshi1(val) {
      this.$forceUpdate();
      if (val == "不支持") {
        this.newdata.price = "";
      }
    },
    ceshi2(val) {
      this.$forceUpdate();
      if (val == "不支持") {
        this.newdata.scorePrice = "";
      }
    },
    //缩略图上传成功
    onsuccsess(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "thumbnail", response.data.url);
      }
    },
    //上图上传成功
    onsuccsess1(response, file, fileList) {
      this.fullscreenLoading = false;
      if (response.resbCode == 200) {
        this.$set(this.newdata, "presentUrl", response.data.url);
      }
    },
    //按照类型查询
    changelevel(item) {
      if (item == "all") {
        this.query.type = "";
      } else {
        this.query.type = item;
      }
      this.query.page = 1;
      this.get();
    },
    //按照分类查询
    changetype(item) {
      if (item == "all") {
        this.query.productClass = "";
      } else {
        this.query.productClass = item;
      }
      this.query.page = 1;
      this.get();
    },
    //获取商品分类名称
    queryTypeList() {
      this.$ajax.queryTypeList({ groupId: 5 }, (res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.typeNamelist.push(res.data[i].typeName);
        }
      });
    },
    //删除上传图片
    close(i) {
      this.fileList.splice(i, 1);
      this.newdata.picurl = this.fileList.join();
    },
    uploading(id) {
      document.getElementById(id).click();
    },
    onerror() {
      this.fullscreenLoading = false;
    },
    //上传图片成功后的钩子函数
    onsuccsesspic(response, file, fileList) {
      if (response.resbCode == 200) {
        this.fileList.push(response.data.url);
        this.newdata.picurl = this.fileList.join();
        this.fullscreenLoading = false;
      }
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
      const limit = this.fileList.length < 5;
      if (!accept) this.$message.error("上传文件只能是图片格式!");
      if (!isLt5M) this.$message.error("上传文件大小不能超过 5MB!");
      if (!limit) this.$message.error("最多上传5张图片！");
      return accept && isLt5M && limit;
    },
    beforeUploadpic1(file) {
      // console.log("111", file);
    },
    //详情
    detail(item) {
      console.log("item", item);
      this.detailBol = true;
      this.Addshow = true;
      this.newdata = { ...item };
      this.newdata.bind = "有";
      this.fileList = item.picurl.length ? item.picurl.split(",") : [];
      this.h5.content = item.manual;
      this.newdata.status1 = item.stonePrice ? "支持" : "不支持";
      this.newdata.status2 = item.price ? "支持" : "不支持";
      this.newdata.status3 = item.scorePrice ? "支持" : "不支持";
    },
    beginshow(data) {
      (this.detailBol = false), (this.Addshow = true);
      if (data) {
        this.newdata = { ...data };
        this.h5.content = data.manual;
        this.newdata.status1 = data.stonePrice ? "支持" : "不支持";
        this.newdata.status2 = data.price ? "支持" : "不支持";
        this.newdata.status3 = data.scorePrice ? "支持" : "不支持";
        this.fileList = data.picurl.length ? data.picurl.split(",") : [];
        console.log("data", data);
        console.log("newdata", this.newdata);
      } else {
        this.fileList = [];
        this.newdata = {
          //parkid: sessionStorage.getItem("parkid"),
          banNum: "", //批量限制
          bind: "1", //绑定
          bindMethod: "", //绑定方法
          buyNotice: "", //购买须知
          caption: "", //商品名称
          manual: "", //富文本
          picurl: "", //图片路径
          present: "1", //商品介绍 1：长图 2：富文本
          presentUrl: "", //长图
          price: "", //人民币价格
          productClass: "", //商品分类
          scorePrice: "", //积分价格
          status: "1", //启用禁用
          stonePrice: "", //五彩石价格
          thumbnail: "", //缩略图
          type: "", //商品类型
          typeName: "", //描述
          status1: "支持", //五彩石
          status2: "支持", //人民币
          status3: "支持", //积分
        };
        this.h5 = { content: "" };
        console.log("newdata", this.newdata);
      }
    },
    cancel(formName) {
      this.Addshow = false;
      this.newdata = {};
      this.$refs[formName].resetFields(); //关闭弹框后清除表单验证
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.newdata.id) {
            console.log("进入修改");
            this.newdata.status1 == "不支持"
              ? (this.newdata.stonePrice = "")
              : this.newdata.stonePrice;
            this.newdata.status2 == "不支持"
              ? (this.newdata.price = "")
              : this.newdata.price;
            this.newdata.status3 == "不支持"
              ? (this.newdata.scorePrice = "")
              : this.newdata.scorePrice;
            this.$ajax.updateMallGoods(
              // {
              //   id: this.newdata.id,
              //   banNum: this.newdata.banNum,
              //   bind: this.newdata.bind,
              //   bindMethod: this.newdata.bindMethod,
              //   caption: this.newdata.caption,
              //   manual: this.h5.content,
              //   picurl: this.newdata.picurl,
              //   price: this.newdata.price * 1,
              //   productClass: this.newdata.productClass,
              //   type: this.newdata.type,
              //   typeName: this.newdata.typeName,
              //   thumbnail: this.newdata.thumbnail,
              //   createtime: this.newdata.createtime,
              //   status: this.newdata.status,
              // },
              this.newdata,
              (res) => {
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                console.log("data", res.data);
                this.Addshow = false;
                this.get();
              }
            );
          } else {
            this.newdata.status1 == "不支持"
              ? (this.newdata.stonePrice = "")
              : this.newdata.stonePrice;
            this.newdata.status2 == "不支持"
              ? (this.newdata.price = "")
              : this.newdata.price;
            this.newdata.status3 == "不支持"
              ? (this.newdata.scorePrice = "")
              : this.newdata.scorePrice;
            ((this.newdata.manual = this.h5.content),
            (this.newdata.status = "1")),
              (this.newdata.bindMethod = this.newdata.bindMethod
                ? this.newdata.bindMethod
                : "");
            this.newdata.price = this.newdata.price * 1;
            this.$ajax.addMallGoods(this.newdata, (res) => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              console.log("res", res);
              this.Addshow = false;
              this.get();
            });
          }
        } else {
          return false;
        }
      });
    },

    getlist() {
      this.$ajax.getSiteTypeList({ groupId: 5 }, (res) => {
        this.list = res.data;
        console.log("list", this.list);
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
        this.$ajax.setProductEnableState(
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
            this.$ajax.deleteMallGoods({ idlst: idlst }, (res) => {
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
    //获取商品信息列表
    get() {
      this.$ajax.queryMallGoodsList(this.query, (res) => {
        this.tableData = res.data;
        this.total = res.total;
        console.log("res", res);
        console.log("this.tableData", this.tableData);
      });
    },
    update(row) {},
    del(id) {
      this.$confirm("您确定要删除选中景点吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$ajax.deleteMallGoods({ idlst: [id] }, (res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.get();
          });
        })
        .catch(() => {});
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
.hint {
  margin-left: 30px;
  color: #909399;
}
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
    width: 1200px;
    margin-top: 15vh;
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
.rate {
  display: inline-block;
  width: 42px;
  margin-right: 15px;
}
.import {
  margin-left: 15px;
}
</style>
