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
            <el-table-column prop="caption" label="商品名"></el-table-column>
            <el-table-column label="类型" prop="typeName"></el-table-column>
            <el-table-column label="状态">
            	<template slot-scope="scope">{{ scope.row.soldstatus==0?'下架':'上架' }}</template>
            </el-table-column>
            <el-table-column label="剩余/总数量">
            	<template slot-scope="scope">{{ scope.row.currentnum }}/{{ scope.row.num }}</template>
            </el-table-column>
            <el-table-column prop="starttime" label="开始时间"></el-table-column>
            <el-table-column prop="endtime" label="结束时间"></el-table-column>
            <el-table-column label="操作" width="155" >
				<template slot-scope="scope">
                    <el-button type="text" size="small" @click="detail(scope.row)">编辑详情</el-button>
                    <el-button type="text" size="small" @click="beginshow(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="enableState(scope.row.id,1)" v-show="scope.row.autosold==1&&scope.row.soldstatus==0">上架</el-button>
                    <el-button type="text" size="small" @click="enableState(scope.row.id,0)" v-show="scope.row.autosold==1&&scope.row.soldstatus==1">下架</el-button>
                    <el-button type="text" size="small" disabled="disabled" v-show="scope.row.autosold==0">自动</el-button>
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
					<span class="el-dialog__title">{{newdata.id?"修改商品":'添加商品'}}</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('newdata')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newdata" :rules="rules" ref="newdata" label-width="80px">
						<el-form-item label="商品名"  prop="caption">
							<el-input v-model="newdata.caption"></el-input>
						</el-form-item>
						<el-form-item label="类型" prop="type">
							<el-select v-model="newdata.type">
								<el-option  :label="n.typeName" :value="n.id" :key="n.id" v-for="n in typelist"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="指定商品"  prop="specifyproduct">
							<el-input v-model="newdata.specifyproduct"></el-input>
						</el-form-item>
						<el-form-item label="价格"  prop="price">
							<el-input v-model="newdata.price"></el-input>
						</el-form-item>
						<el-form-item label="积分"  prop="scores">
							<el-input v-model="newdata.scores"></el-input>
						</el-form-item>
						<el-form-item label="商品数量"  prop="num">
							<el-input v-model="newdata.num"></el-input>
						</el-form-item>
						<el-form-item label="图片">
							<el-input v-model="newdata.picurl" style="width: 200px;display:none"></el-input>
							<el-button size="small" type="primary" @click="uploading('uppic')">点击上传</el-button>
							<el-upload class="upload-demo" style="display:none"
								:data="uploaddata"
								:action="$store.state.ip+'/resources/uploadResource'"
								accept="image/jpeg,image/jpg,image/png"
								:on-progress="handleLoading"
								:on-success='onsuccsesspic'
								:before-upload="beforeUploadpic"  
								:on-error='onerror'
								list-type="picture">
								<el-button size="small" type="primary" id="uppic">点击上传</el-button>
							</el-upload>
							<div style="margin-top:20px">
								<img :src="$store.state.resip+newdata.picurl" alt="" class="pic" style="width:200px;height:200px" v-if="newdata.picurl">
							</div>
						</el-form-item>
						<el-form-item label="上架" prop="autosold">
							<el-radio-group v-model="newdata.autosold">
								<el-radio label="0">自动</el-radio>
								<el-radio label="1" checked>手动</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="开始时间"  prop="starttime" v-show="newdata.autosold==0">
							<el-date-picker v-model="newdata.starttime" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>
						<el-form-item label="结束时间"  prop="endtime"  v-show="newdata.autosold==0">
							<el-date-picker v-model="newdata.endtime" type="datetime" placeholder="选择日期时间"></el-date-picker>
						</el-form-item>
						<el-form-item label="上架状态" prop="soldstatus"  v-show="newdata.autosold==1">
							<el-radio-group v-model="newdata.soldstatus">
								<el-radio v-model="newdata.soldstatus" label="0" checked>下架</el-radio>
								<el-radio v-model="newdata.soldstatus" label="1">上架</el-radio>
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
		<!--详情查看-->
		<div class="el-dialog__wrapper" v-show="Detailshow">
			<div class="el-dialog el-dialogedit">
				<div class="el-dialog__header">
					<span class="el-dialog__title">编辑详情</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<tinymce-editor ref="editor" v-model="h5.content" > </tinymce-editor>
				</div>
				<div class="el-dialog__footer">
					<div class="dialog-footer">
						<el-button @click="cancel('')">取 消</el-button>
						<el-button type="primary" @click="submith5('')">确 定</el-button>
					</div>
				</div>
			</div>
        </div>
    </div>
</template>
<script>
import TinymceEditor from '../../components/editor'
export default {
    name:'list',
    components: {
       TinymceEditor
    },
	data() {
		var checkPrice = (rule, value, callback) => {
			if (!/^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/.test(value)||value>1000) {
				callback(new Error('请输入最大1000且最多两位小数的数字'));
			}else{
				callback();
			}
		};
		var checkNum = (rule, value, callback) => {
			if (!/^[+]{0,1}(\d+)$/.test(value)||value>1000) {
				callback(new Error('请输入最大1000的数字'));
			}else{
				callback();
			}
		};
		var checkScore =(rule, value, callback) => {
			if (!/^[+]{0,1}(\d+)$/.test(value)||value>1000) {
				callback(new Error('请输入最大1000的数字'));
			}else{
				callback();
			}
		};
        return {
			h5:{
				content:''
			},
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
            newdata:{
				linkh5url:'',
				starttime:'',
				endtime:'',
				autosold:'1',
				soldstatus:'0'
			},
            rules: {
				caption: [{ required: true, message: '标题不能为空'},{ max: 20, message: '最多20个字符', trigger: 'blur' }],
				specifyproduct: [{ max: 20, message: '最多20个字符', trigger: 'blur' }],
                type: [{ required: true,message: '类型不能为空' }],
				num: [{ required: true,validator: checkNum, trigger: 'blur' }],
                price: [{ required: true,validator: checkPrice, trigger: 'blur' }],
                scores: [{ required: true,validator: checkScore, trigger: 'blur' }],
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
			const isLt5M = file.size / 1024 / 1024 < 5;
			const accept =  (file.type.indexOf('jpeg')>-1||file.type.indexOf('png')>-1||file.type.indexOf('jpg')>-1)
			if (!accept){
				this.$message.error('上传文件只能是图片格式!');
			}
			if (!isLt5M) {
				this.$message.error('上传文件大小不能超过 5MB!');
			}
			return accept&&isLt5M;
		},
		onsuccsesspic(response, file, fileList){
			if(response.resb==200){
				this.$set(this.newdata, 'picurl',response.shortUrl);
				this.fullscreenLoading = false;
			}
		},
		onerror(){
			this.fullscreenLoading = false;
		},
		search(){
			this.getlist();
		},
		submith5(){
			if(this.h5.id){
				this.$ajax.updateH5({id: this.h5.id,parameters: {content:this.h5.content}}, res => {
					this.$message({
						type: 'success',
						message: '修改成功!'
					});
					this.Detailshow = false
				})
			}else{
				this.$ajax.addH5(this.h5, res => {
					if(res.resb==200){
						let linkh5url =res.data.id
						this.$ajax.updateMallGoods({id: this.newdata.id,parameters: {linkh5url:linkh5url}}, res => {
							this.$message({
								type: 'success',
								message: '修改成功!'
							});
							this.Detailshow = false
							this.getlist()
						})
					}
				})
			}
			
		},
		beginshow(data){
			this.Addshow = true
			this.Detailshow = false
			if(data){
				this.newdata = {...data}
			}else{
				this.newdata={
					linkh5url:'',
					starttime:'',
					endtime:'',
					autosold:'1',
					soldstatus:'0'
				}
			}
		},
		cancel(formName){
			this.Addshow = false
			this.Detailshow = false
			this.newdata={
				linkh5url:'',
				starttime:'',
				endtime:'',
				autosold:'1',
				soldstatus:'0'
			}
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(!this.newdata.picurl){
						this.$message.error('图片为传填项!');
						return
					}
					if(this.newdata.autosold==0){//自动
						let time ={}
						if(this.newdata.starttime){
							time.starttime=this.newdata.starttime
							this.newdata.starttime = this.timeform('yyyy-MM-dd hh:mm:ss',this.newdata.starttime)
						}else{
							this.$message.error('开始时间为必填项!');
							return
						}
						if(this.newdata.endtime){
							time.endtime=this.newdata.endtime
							this.newdata.endtime = this.timeform('yyyy-MM-dd hh:mm:ss',this.newdata.endtime)
						}else{
							this.$message.error('结束时间为必填项!');
							return
						}
						if(new Date(time.starttime).getTime()>new Date(time.endtime).getTime()){
							this.$message.error('开始时间必须早于结束时间!');
							return
						}
					}
					if(this.newdata.id){
						this.$ajax.updateMallGoods({id: this.newdata.id,parameters: {
							caption:this.newdata.caption,
							autosold:this.newdata.autosold,
							endtime:this.newdata.endtime,
							num:this.newdata.num,
							picurl:this.newdata.picurl,
							price:this.newdata.price,
							scores:this.newdata.scores ,
							soldstatus :this.newdata.soldstatus ,
							specifyproduct:this.newdata.specifyproduct,
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
						this.$ajax.addMallGoods(this.newdata, res => {
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
		detail(res){
			this.Detailshow = true
			if(res.linkh5url){
				this.h5.id = res.linkh5url
                this.$ajax.getH5Details({id:res.linkh5url}, res => {
					this.h5=res.data
				})
            }else{
				this.newdata = res
				this.h5={ caption:'', content:'' }
			}
		},
		handleCurrentChange(val){ // 切换元页
			this.query.page = val
			this.getlist()
		},
		enableState(id,val){
			this.$ajax.updateMallGoods({id:id,parameters:{soldstatus:val}}, res => {
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
			this.$ajax.queryMallGoodsList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
			})
		},
		gettypelist(){
			this.$ajax.queryTypeList({count:999,page:1,groupId:5}, res => {
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