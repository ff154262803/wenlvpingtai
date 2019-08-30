<template>
    <div>
		<!-- 过滤区 -->
		<el-input placeholder="请输入景点名称" v-model="query.condition" style="width:300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="beginshow">添加</el-button>
		<div class="filter">
            <strong>分类：</strong>
			<span @click="changetype('')" :class='query.typelist.length==0?"active":""'>不限</span>
			<span v-for="(item, index) in list" :key="index" :class='query.typelist.indexOf(item.id)>-1?"active":""' @click="changetype(item.id)">{{item.typeName}}</span>
        </div>
		<div class="filter">
            <strong>显示等级：</strong>
            <span @click="changelevel('all')" :class='query.level==""?"active":""'>不限</span>
			<span :class='query.level==13?"active":""' @click="changelevel(13)">13</span>
            <span :class='query.level==14?"active":""' @click="changelevel(14)">14</span>
            <span :class='query.level==15?"active":""' @click="changelevel(15)">15</span>
            <span :class='query.level==16?"active":""' @click="changelevel(16)">16</span>
            <span :class='query.level==17?"active":""' @click="changelevel(17)">17</span>
            <span :class='query.level==18?"active":""' @click="changelevel(18)">18</span>
            <span :class='query.level==19?"active":""' @click="changelevel(19)">19</span>
            <span :class='query.level==20?"active":""' @click="changelevel(20)">20</span>
            <span :class='query.level==21?"active":""' @click="changelevel(21)">21</span>
        </div>
        <div class="filter" style="border-bottom:1px solid #ddd">
            <strong>AR：</strong>
            <span @click="changeisar('all')" :class='query.isar==""?"active":""'>不限</span>
			<span :class='query.isar=="0"?"active":""' @click="changeisar('0')">否</span>
            <span :class='query.isar=="1"?"active":""' @click="changeisar('1')">是</span>
        </div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="caption" label="景点名"></el-table-column>
            <el-table-column prop="typeName" label="分类"></el-table-column>
            <el-table-column label="状态">
            	<template slot-scope="scope">{{ scope.row.isenable==0?'禁用':'启用' }}</template>
            </el-table-column>
            <el-table-column label="是否AR">
            	<template slot-scope="scope">{{ scope.row.isar==0?'否':'是' }}</template>
            </el-table-column>
            <el-table-column label="显示范围">
            	<template slot-scope="scope">{{ scope.row.lowlevel }}-{{ scope.row.highlevel }}</template>
            </el-table-column>
            <el-table-column label="操作">
				<template slot-scope="scope">
                    <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!--底部工具条-->
		<el-col :span="24" class="toolbar" style="display:flex;justify-content: flex-end;position:relative">
			<div style="position:absolute;left:10px;top:5px">
				<el-button @click="delAll()">删除</el-button>
				<el-button @click="enableState(1)">启用</el-button>
				<el-button @click="enableState(0)">禁用</el-button>
			</div>
			<el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :page-size="query.count" :total="total">
			</el-pagination>
			<el-button size="small">确定</el-button>
		</el-col>
        <div id="diamain">
            
        </div>
		<!--景点新增-->
        <el-dialog title="添加景点" :visible.sync="Addshow" class="demo-box" width="600px"  ref='dialog'>
            <el-form :model="newdata" :rules="rules" ref="newdata" label-width="120px">
                <el-form-item label="景区名"  prop="caption">
                    <el-input v-model="newdata.caption"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="type">
					<el-select v-model="newdata.type"  >
						<el-option v-for="item in list" :label="item.typeName" :value="item.id" :key="item.id" ></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="显示层级" prop="lowlevel">
					<el-select v-model="newdata.lowlevel" >
						<el-option label="12" value="12"></el-option>
                        <el-option label="13" value="13"></el-option>
                        <el-option label="14" value="14"></el-option>
                        <el-option label="15" value="15"></el-option>
                        <el-option label="16" value="16"></el-option>
                        <el-option label="17" value="17"></el-option>
                        <el-option label="18" value="18"></el-option>
                        <el-option label="19" value="19"></el-option>
                        <el-option label="20" value="20"></el-option>
                        <el-option label="21" value="21"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="显示层级" prop="highlevel">
                    <el-select v-model="newdata.highlevel" >
                        <el-option label="13" value="13"></el-option>
                        <el-option label="14" value="14"></el-option>
                        <el-option label="15" value="15"></el-option>
                        <el-option label="16" value="16"></el-option>
                        <el-option label="17" value="17"></el-option>
                        <el-option label="18" value="18"></el-option>
                        <el-option label="19" value="19"></el-option>
                        <el-option label="20" value="20"></el-option>
                        <el-option label="21" value="21"></el-option>
                        <el-option label="22" value="21"></el-option>
					</el-select>
                </el-form-item>
				<el-form-item label="开放时间" prop="opentime">
                    <el-input v-model="newdata.opentime"></el-input>
                </el-form-item>
				<el-form-item label="咨询电话" prop="phonenumber">
                    <el-input v-model="newdata.phonenumber"></el-input>
                </el-form-item>
                <el-form-item label="概述" prop="remark">
                    <el-input v-model="newdata.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('newdata')">取 消</el-button>
                <el-button type="primary" @click="add('newdata')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
	data() {
      var checkPhone = (rule, value, callback) => {
        if (value === '') {
			callback();
        } else {
			if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(value)) {
				callback(new Error('请输入正确的号码'));
			}else{
				callback();
			}
        }
      };
	return {
        parkid:sessionStorage.getItem('parkid'),
		tableData: [],
		multipleSelection: [],
		total:0,
		list:[],
		query:{
            parkid:sessionStorage.getItem('parkid'),
			page:1,
			count:6,
			condition:'',
			typelist:[],
			isar:'',
			level:''
		},
		Addshow:false,
		newdata:{
			"caption": "",
            "electronicfencelist": [],
            "highlevel": '',
            "lat": "",
            "lon": "",
            "lowlevel": '',
            "opentime": "",
            "parkid": sessionStorage.getItem('parkid'),
            "phonenumber": "",
            "picurl": "",
            "remark": "",
            "type": ''
		},
		rules: {
			caption: [{required: true, message: '请输入景区名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
			opentime: [{required: true, message: '请输入开放时间', trigger: 'blur'},{ max: 20, message: '最多20个字符', trigger: 'blur' }],
			phonenumber: [{ validator: checkPhone, trigger: 'blur' }],
            lowlevel: [{required: true, message: '请选择最低显示层级', trigger: 'change'}],
            highlevel: [{required: true, message: '请选择最高显示层级', trigger: 'change'}],
            type: [{required: true, message: '请选择景点类型', trigger: 'change'}]
        }
	}
},
	mounted(){
        if(!this.parkid){
            this.$router.push({path:'/parklist'})
            return false
        }
		this.get();
		this.getlist();
	},
	methods: {
		beginshow(){
            this.Addshow = true
			this.newdata={
                "caption": "",
                "electronicfencelist": "",
                "highlevel": '',
                "lat": "",
                "lon": "",
                "lowlevel": '',
                "opentime": "",
                "parkid": sessionStorage.getItem('parkid'),
                "phonenumber": "",
                "picurl": "",
                "remark": "",
                "type": ''
            }
		},
		cancel(formName){
			this.Addshow = false
			this.newdata={
                "caption": "",
                "electronicfencelist": [],
                "highlevel": '',
                "lat": "",
                "lon": "",
                "lowlevel": '',
                "opentime": "",
                "parkid": sessionStorage.getItem('parkid'),
                "phonenumber": "",
                "picurl": "",
                "remark": "",
                "type": ''
            }
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$ajax.addSite(this.newdata, res => {
                        this.Addshow = false
						this.$message({
							type: 'success',
							message: '提交成功!'
						});
						this.get()
					})
				} else {
					return false;
				}
			});
		},
		changetype(val){
			if(val){
				this.query.typelist.indexOf(val)>-1?this.query.typelist.push(val):this.query.typelist.push(val)
			}else{
				this.query.typelist=[]
			}
			this.get()
		},
		changelevel(val){
			if(val=='all'){
				this.query.level=''
			}else{
				this.query.level=val
			}
			this.get()
		},
		changeisar(val){
			if(val=='all'){
				this.query.isar=''
			}else{
				this.query.isar=val
			}
			this.get()
		},
		getlist(){
			this.$ajax.getSiteTypeList({}, res => {
				this.list = res.data
			})
		},
		search(){
			this.get()
		},
		handleCurrentChange(val){ // 切换元页
			this.query.page = val.toString()
			this.get()
		},
		enableState(val){
			if(this.multipleSelection.length==0){
				this.$message({
					type: 'warning',
					message: '尚未选择任何内容!'
				});
			}else{
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$ajax.setSiteEnableState({idlst:idlst,isenable:val}, res => {
					this.$message({
						type: 'success',
						message: '设置成功!'
					});
					this.get()
				})
			}
		},
		delAll(){
			if(this.multipleSelection.length==0){
				this.$message({
					type: 'warning',
					message: '尚未选择任何内容!'
				});
			}else{
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$confirm('您确定要删除选中景点吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$ajax.deleteSite({idlst:idlst}, res => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.get()
					})
				}).catch(() => {});
			}
		},
		get(){
			this.$ajax.querySiteList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
				if(res.totalPage<this.query.page){//过滤时页数bug
					this.query.page=1
					this.get()
				}
			})
		},
		update(row) {
            sessionStorage.setItem('siteid',row.id)
            this.$router.push({path:'/scenicdetail',query:{id:row.id}})
		},
		del(id){
			this.$confirm('您确定要删除选中景点吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$ajax.deleteSite({idlst:[id]}, res => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.get()
				})
			}).catch(() => {})
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		}
	}
}
</script>
<style lang="scss" scoped>
	.addBtn{
		margin-left: 100px;
	}
	/deep/ .el-input{
		width: 450px;
	}
	.filter{
		line-height: 40px;
		span {
			display: inline-block;
			line-height: 30px;
			margin-left: 10px;
			background-color: rgba(64,158,255,.1);
			padding: 0 10px;
			font-size: 12px;
			color: #409EFF;
			border-radius: 4px;
			box-sizing: border-box;
			border: 1px solid rgba(64,158,255,.2);
			white-space: nowrap;
		}
		.active{
			background-color: #409EFF;
			color: #fff;
		}
	}
</style>