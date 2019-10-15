<template>
    <div>
		<!-- 过滤区 -->
		<el-input placeholder="请输入名称" v-model="query.condition" style="width:300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
		<div class="filter">
			<el-button class="addBtn" type="primary" @click="beginshow()">添加</el-button>
		</div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="caption" label="活动标题"></el-table-column>
            <el-table-column label="类型" prop="typeName"></el-table-column>
            <el-table-column label="状态">
            	<template slot-scope="scope">{{ scope.row.isenable==1?'已启用':'已禁用' }}</template>
            </el-table-column>
            <el-table-column prop="starttime" label="上架时间"></el-table-column>
            <el-table-column prop="endtime" label="下架时间"></el-table-column>
            <el-table-column label="操作" width="155" >
				<template slot-scope="scope">
                    <el-button type="text" size="small" @click="beginshow(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="enableState(scope.row.id,1)" v-show="scope.row.isenable==0">启用</el-button>
                    <el-button type="text" size="small" @click="enableState(scope.row.id,0)" v-show="scope.row.isenable==1">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!--底部工具条-->
		<el-col :span="24" class="toolbar" style="display:flex;justify-content: flex-end;position:relative">
			<div style="position:absolute;left:10px;top:5px">
				<el-button @click="delAll()">删除</el-button>
			</div>
			<el-pagination background
				layout="total,sizes, prev, pager, next, jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10, 15, 20, 30, 50]"
				:current-page.sync="query.page"
				:page-size="query.count" :total="total">
            </el-pagination>
			<el-button size="small">确定</el-button>
		</el-col>
		<!--商品新增-->
        <div class="el-dialog__wrapper" v-show="Addshow">
			<div class="el-dialog el-dialogadd">
				<div class="el-dialog__header">
					<span class="el-dialog__title">修改活动标题</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('newdata')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newdata" :rules="rules" ref="newdata" label-width="80px">
						<el-form-item label="活动标题"  prop="caption">
							<el-input v-model="newdata.caption"></el-input>
						</el-form-item>
						<el-form-item label="分类" prop="type">
							<el-select v-model="newdata.type">
								<el-option  :label="n.typeName" :value="n.id" :key="n.id" v-for="n in typelist"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="图片"  prop="picurl">
							<el-input v-model="newdata.picurl" style="width: 200px;display:none"></el-input>
							<el-button size="small" type="primary" @click="uploading('uppic')">点击上传</el-button>
							<el-upload class="upload-demo" style="display:none"
								:data="uploaddata"
								:action="$store.state.ip+'/resources/uploadResource'"
								:on-progress="handleLoading"
								:on-success='onsuccsesspic'
								:before-upload="beforeUploadpic"  
								:on-error='onerror'
								list-type="picture">
								<el-button size="small" type="primary" id="uppic">点击上传</el-button>
							</el-upload>
							<div style="margin-top:20px">
								<img :src="$store.state.resip+newdata.picurl" alt="" class="pic" style="width:200px;height:200px">
							</div>
						</el-form-item>
						<el-form-item label="活动地址"  prop="linkh5url">
							<el-input v-model="newdata.linkh5url"></el-input>
						</el-form-item>
						<el-form-item label="上架时间"  prop="starttime">
							<el-date-picker v-model="newdata.starttime" type="date" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>
						<el-form-item label="下架时间"  prop="endtime">
							<el-date-picker v-model="newdata.endtime" type="date" placeholder="选择日期时间"></el-date-picker>
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
    name:'list',
	data() {
        return {
			uploaddata:{
				type:'',
				uKey:JSON.parse(sessionStorage.getItem('user')).uKey
			},
            tableData: [],
            multipleSelection: [],
            total:0,
            query:{
                condition:'',
                page:1,
                count:10
            },
            Addshow:false,
            Detailshow:false,
            newdata:{},
            rules: {
            },
            typelist:[]
        }
    },
	mounted(){
		this.getlist();
		this.gettypelist();
	},
	methods: {
		handleSizeChange(val) {
			this.query.count = val;
			this.getlist();
		},
		timeform: function(format, time){//转化时间格式传输给后台
            // 初始化时间对象d，并使用d转化一个date object
            var d = new Date(time)
            var date = {
                'M+': d.getMonth() + 1,
                'd+': d.getDate(),
                'h+': d.getHours(),
                'm+': d.getMinutes(),
                's+': d.getSeconds(),
                'q+': Math.floor((d.getMonth() + 3) / 3),
                'S+': d.getMilliseconds()
            }
            // 正则替换文本
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
            }
            for (var k in date) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
                }
            }
            return format
        },
		uploading(id){
			document.getElementById(id).click()
		},
		handleLoading(){
			this.fullscreenLoading = true;
		},
		beforeUploadpic(file){
			const isLt50M = file.size / 1024 / 1024 < 50;
			if (!isLt50M) {
				this.$message.error('上传文件大小不能超过 50MB!');
			}
			return isLt50M;
		},
		onsuccsesspic(response, file, fileList){
			if(response.resb==200){
				this.newdata.picurl = response.shortUrl
				this.fullscreenLoading = false;
			}
		},
		onerror(){
			this.fullscreenLoading = false;
		},
		search(){
			this.getlist();
		},
		beginshow(data){
			this.Addshow = true
			this.Detailshow = false
			if(data){
				this.newdata = data
			}else{
				this.newdata={}
			}
		},
		cancel(formName){
			this.Addshow = false
			this.Detailshow = false
			this.newdata={}
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.newdata.starttime){
						this.newdata.starttime = this.timeform('yyyy-MM-dd',this.newdata.starttime)
					}
					if(this.newdata.endtime){
						this.newdata.endtime = this.timeform('yyyy-MM-dd',this.newdata.endtime)
					}
					if(this.newdata.id){
						this.$ajax.updateMallActivity({id: this.newdata.id,parameters: {
							caption:this.newdata.caption,
							endtime:this.newdata.endtime,
							linkh5url:this.newdata.linkh5url,
							picurl:this.newdata.picurl,
							starttime :this.newdata.starttime,
							type:this.newdata.type}}, res => {
							this.$message({
								type: 'success',
								message: '修改成功!'
							});
							this.Addshow = false
							this.getlist()
						})
					}else{
						this.$ajax.addMallActivity(this.newdata, res => {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.Addshow = false
							this.getlist()
						})
					}
				} else {
					return false;
				}
			});
		},
		handleCurrentChange(val){ // 切换元页
			this.query.page = val
			this.getlist()
		},
		enableState(id,val){
			this.$ajax.setMallActivityEnableState({idlst:[id],isenable:val}, res => {
				this.$message({
					type: 'success',
					message: '设置成功!'
				});
				this.getlist()
			})
		},
		delAll(){
			if(this.multipleSelection.length!=0){
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$confirm('您确定要删除选中商品吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$ajax.deleteMallGoods({idlst:idlst}, res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getlist()
					})
				}).catch(() => {});
			}
		},
		getlist(){
			this.$ajax.queryMallActivityList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
			})
		},
		gettypelist(){
			this.$ajax.queryTypeList({count:999,page:1,groupId:6}, res => {
				this.typelist = res.data
			})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		}
	}
}
</script>
<style lang="scss" scoped>
	.filter{
		position: relative;
		height: 50px;
	}
	.addBtn{
		float: right;
		margin-right: 100px;
	}
	.el-dialog__wrapper{
		z-index: 999;
		background: rgba(0,0,0,.8);
		.el-dialogadd{
			width: 400px;
			margin-top: 15vh;
		}
		.el-dialogedit{
			width: 1000px;
			margin-top: 15vh;
		}
	}
</style>