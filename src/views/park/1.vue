<template>
    <div>
        <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
            <el-row :gutter="15">
                <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
                    <el-col :span="16">
                        <el-form-item label="介绍图" prop="picurl" required>
                            <el-upload ref="picurl" :file-list="picurlfileList" :action="picurlAction"
                                :auto-upload="false" :before-upload="picurlBeforeUpload" list-type="picture"
                                accept="image/*">
                                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handelConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        inheritAttrs: false,
        components: {},
        props: [],
        data() {
            return {
                formData: {
                    picurl: null,
                },
                rules: {},
                picurlAction: 'https://jsonplaceholder.typicode.com/posts/',
                picurlfileList: [],
            }
        },
        computed: {},
        watch: {},
        created() { },
        mounted() { },
        methods: {
            onOpen() { },
            onClose() {
                this.$refs['elForm'].resetFields()
            },
            close() {
                this.$emit('update:visible', false)
            },
            handelConfirm() {
                this.$refs['elForm'].validate(valid => {
                    if (!valid) return
                    this.close()
                })
            },
            picurlBeforeUpload(file) {
                let isRightSize = file.size / 1024 / 1024 < 2
                if (!isRightSize) {
                    this.$message.error('文件大小超过 2MB')
                }
                let isAccept = new RegExp('image/*').test(file.type)
                if (!isAccept) {
                    this.$message.error('应该选择image/*类型的文件')
                }
                return isRightSize && isAccept
            },
            submitUpload() {
                this.$refs['picurl'].submit()
            },
        }
    }

</script>
<style>
    .el-upload__tip {
        line-height: 1.2;
    }
</style>