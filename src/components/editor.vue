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
export default {
  components: {
    Editor,
  },
  props: {
    baseUrl: {
      type: String,
      // default: "https://qlv.test.zkshiwei.com/web/manager",
      default: "https://qlv.test.zkshiwei.com/web/manager",
      //default: 'http://192.192.0.241:5005/api',
    },
    value: {
      type: String,
      default: "",
    },
    plugins: {
      type: [String, Array],
      default: "lists image table code link textcolor imagetools",
    },
    toolbar: {
      type: [String, Array],
      default:
        "code | undo redo removeformat bold italic underline alignleft aligncenter alignright alignjustify styleselect fontsizeselect subscript superscript insert | image  imageoptions| link unlink|forecolor backcolor",
    },
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: `${this.baseUrl}/static/tiny/zh_CN.js`,
        language: "zh_CN",
        skin_url: `${this.baseUrl}/static/tiny/skins/ui/oxide-dark`,
        content_css: `${this.baseUrl}/static/tiny/skins/content/default/content.css`,
        height: 500,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        convert_urls: false,
        // images_upload_base_path: '/some/basepath',
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
              success(response.data.url);
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
<style scoped>
</style>