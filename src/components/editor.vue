<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init"> </editor>
  </div>
</template>

<script>
import axios from "../api/axios";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/image"; // 插入上传图片插件
import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/link"; //超链接插件
import "tinymce/plugins/code"; //代码块插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/contextmenu"; //右键菜单插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/colorpicker"; //选择颜色插件
import "tinymce/plugins/textcolor"; //文本颜色插件
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/help";
import "tinymce/plugins/charmap";
import "tinymce/plugins/paste";
import "tinymce/plugins/print";
import "tinymce/plugins/preview";
import "tinymce/plugins/hr";
import "tinymce/plugins/anchor";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/spellchecker";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/autosave";
import "tinymce/plugins/fullpage";
import "tinymce/plugins/toc";
// import "tinymce/plugins/lineheight";
export default {
  components: {
    Editor,
  },
  props: {
    baseUrl: {
      type: String,
      // default: "https://qlv.test.zkshiwei.com/web/manager",
      //default: "https://qlv.test.zkshiwei.com/web/manager",
      default: "http://qlv.test.zkshiwei.com/tourism/",
      //default: 'http://192.192.0.241:5005/api',
    },
    value: {
      type: String,
      default: "",
    },
    plugins: {
      type: [String, Array],
      default: "lists image table code link textcolor imagetools paste ",
    },

    toolbar: {
      type: [String, Array],
      default:
        "undo redo removeformat bold italic underline alignleft aligncenter alignright alignjustify   styleselect fontsizeselect  image|forecolor backcolor",
    },
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: `${this.baseUrl}/static/tiny/zh_CN.js`,
        language: "zh_CN",
        // skin_url: `${this.baseUrl}/static/tiny/skins/ui/oxide-dark`,
        skin_url: `${this.baseUrl}/static/tiny/skins/ui/oxide`,
        // content_css: `${this.baseUrl}/static/tiny/skins/content/default/content.css`, //背景颜色
        content_css: `${this.baseUrl}/static/tiny/skins/content/default/content.css`, //背景颜色
        // skin_url: `${this.baseUrl}/static/tiny/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/static/tiny/skins/content/dark/content.css`, // 暗色系
        height: 500,
        plugins: this.plugins,
        toolbar: this.toolbar,
        // toolbar: false,
        branding: false,
        menubar: false,
        convert_urls: false,
        image_dimensions: true,
        paste_data_images: false,
        content_style: "p {margin: 0px; border:0px ; padding: 0px;}", //设置行间距
        images_upload_handler: (blobInfo, success, failure) => {
          let param = new FormData(); //创建form对象
          param.append("file", blobInfo.blob()); //通过append向form对象添加数据
          param.append("uKey", JSON.parse(sessionStorage.getItem("user")).uKey); //通过append向form对象添加数据
          param.append("type", ""); //通过append向form对象添加数据
          let config = {
            headers: { "Content-Type": "multipart/form-data" },
          };
          axios
            .post(
              this.$store.state.ip + "/manage/ferriswheel/resources/upload",
              param,
              config
            )
            .then((response) => {
              success(response.data.data.url);
            });
        },
      },
      myValue: this.value,
    };
  },
  mounted() {},
  methods: {},
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>
<style >
body.mceContentBody {
  background: #fff;
  color: #000;
}
</style>