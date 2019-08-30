<template>
    <div>
		<!-- 过滤区 -->
		<el-input placeholder="请输入园区名称" v-model="query.condition" style="width:300px"></el-input>
        <el-button icon="el-icon-search" class="btn" @click="search"></el-button>
        <el-button class="addBtn" type="primary" @click="beginshow">添加</el-button>
		<div class="filter">
            <strong>分类：</strong>
			<span @click="changetype('')" :class='query.typelist.length==0?"active":""'>不限</span>
			<span v-for="(item, index) in list" :key="index" :class='query.typelist.indexOf(item.id)>-1?"active":""' @click="changetype(item.id)">{{item.typeName}}</span>
        </div>
		<div class="filter">
            <strong>省：</strong>
            <span @click="changepro('all')" :class='query.province==""?"active":""'>不限</span>
			<span v-for="(item, index) in province" :key="index" :class='query.province==item.province?"active":""' @click="changepro(index)">{{item.province}}</span>
        </div>
        <div class="filter" style="border-bottom:1px solid #ddd">
            <strong>市：</strong>
            <span @click="changecity('')" :class='query.city==""?"active":""'>不限</span>
			<span v-for="(item, index) in city" :key="index" :class='query.city==item?"active":""' @click="changecity(item)">{{item}}</span>
        </div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="caption" label="景区名"></el-table-column>
            <el-table-column prop="typeName" label="分类"></el-table-column>
            <el-table-column label="省市" width="120">
            	<template slot-scope="scope">{{ scope.row.province }} - {{ scope.row.city }}</template>
            </el-table-column>
            <el-table-column label="状态" width="80">
            	<template slot-scope="scope">{{ scope.row.isenable==0?'禁用':'启用' }}</template>
            </el-table-column>
            <el-table-column prop="arcount" label="AR景点总数" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="arprice" label="AR收费" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ardiscount" label="折扣" width="80" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="address" label="其他景点总数" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="price" label="门票" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createtime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
				<template slot-scope="scope">
                    <el-button type="text" size="small" @click="update(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="del(scope.row.parkid)">删除</el-button>
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
			<el-pagination background
				layout="total,sizes, prev, pager, next, jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10, 15, 20, 30, 50]"
				:page-size="query.count" :total="total">
            </el-pagination>
			<el-button size="small">确定</el-button>
		</el-col>
		<!--园区新增-->
        <el-dialog title="添加园区" :visible.sync="Addshow" class="demo-box" width="590px">
            <el-form :model="newdata" :rules="rules" ref="newdata" label-width="100px">
                <el-form-item label="景区名"  prop="caption">
                    <el-input v-model="newdata.caption"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="type">
					<el-select v-model="newdata.type"  >
						<el-option v-for="item in list" :label="item.typeName" :value="item.id" :key="item.id" ></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="省市" prop="city">
					<el-select v-model="newdata.province" @change="selectcity">
						<el-option v-for="item in area" :label="item.name" :value="item.name" :key="item.name" ></el-option>
					</el-select>
					 - 
					<el-select v-model="newdata.city" >
						<el-option v-for="item in areacity" :label="item.name" :value="item.name" :key="item.name" ></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="门票价格" prop="price">
                    <el-input v-model="newdata.price"></el-input>
                </el-form-item>
				<el-form-item label="开放时间" prop="opentime">
                    <el-input v-model="newdata.opentime"></el-input>
                </el-form-item>
				<el-form-item label="咨询电话" prop="packnumber">
                    <el-input v-model="newdata.packnumber"></el-input>
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
import {areaArr} from '../../api/city.js'
export default {
	data() {
		var checkPrice = (rule, value, callback) => {
			if (!/^(([0-9]+\d*)|([0-9]+\d*\.\d{1,2}))$/.test(value)||value>100) {
				callback(new Error('请输入最大100且最多两位小数的数字'));
			}else{
				callback();
			}
      	};
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
		tableData: [],
		multipleSelection: [],
		total:0,
		list:[],
		query:{
			page:1,
			count:10,
			condition:'',
			typelist:[],
			province:'',
			city:''
		},
		Addshow:false,
		newdata:{
			"caption": "",
			"city": "",
			"opentime": "",
			"packnumber": "",
			"price": "",
			"province": "",
			"type": '',
		},
		rules: {
			caption: [{required: true, message: '请输入景区名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
			city: [{required: true, message: '请选择省市', trigger: 'change'}],
			opentime: [{required: true, message: '请输入开放时间', trigger: 'blur'},{ max: 20, message: '最多20个字符', trigger: 'blur' }],
			packnumber: [{ validator: checkPhone, trigger: 'blur' }],
			price: [{ required: true,validator: checkPrice, trigger: 'blur' }],
			type: [{required: true, message: '请选择园区类型', trigger: 'change'}],
		},
		area:[],
		areacity:[],
		province:[],
		city:[]
	}
	},
	mounted(){
		this.area = areaArr
		this.get();
		this.getlist();
		this.getarea()
	},
	methods: {
		beginshow(){
			this.Addshow = true
			this.newdata={
				"caption": "",
				"city": "",
				"opentime": "",
				"packnumber": "",
				"price": "",
				"province": "",
				"type": ''
			}
		},
		cancel(formName){
			this.Addshow = false
			this.newdata={
				"caption": "",
				"city": "",
				"opentime": "",
				"packnumber": "",
				"price": "",
				"province": "",
				"type": ''
			}
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$ajax.addPark(this.newdata, res => {
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
		selectcity(){
			this.newdata.city=''
			var dt = this.area.filter(n => {
				if (n.name == this.newdata.province) return true;
			})
			dt.length==0?this.areacity=[]:this.areacity=dt[0].child
		},
		changetype(val){
			if(val){
				this.query.typelist.indexOf(val)>-1?this.query.typelist.push(val):this.query.typelist.push(val)
			}else{
				this.query.typelist=[]
			}
			this.get()
		},
		changepro(val){
			if(val=='all'){
				this.query.province=''
				this.query.city=''
				this.city=[]
			}else{
				this.query.province=this.province[val].province
				this.query.city=''
				this.city=this.province[val].citylist
			}
			this.get()
		},
		changecity(val){
			this.query.city=val
			this.get()
		},
		getarea(){
			this.$ajax.getParkAreaList({}, res => {
				this.province = res.data
			})
		},
		getlist(){
			this.$ajax.getParkTypeList({}, res => {
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
					idlst.push(this.multipleSelection[i].parkid)
				}
				this.$ajax.setParkEnableState({idlst:idlst,isenable:val}, res => {
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
					idlst.push(this.multipleSelection[i].parkid)
				}
				this.$confirm('您确定要删除选中园区吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$ajax.deletePark({idlst:idlst}, res => {
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
			this.$ajax.queryParkList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
				if(res.totalPage<this.query.page){//过滤时页数bug
					this.query.page=1
					this.get()
				}
			})
		},
		update(row) {
			sessionStorage.setItem('parkid',row.parkid)
			this.$router.push({path:'/base',query:{id:row.parkid}})
		},
		del(id){
			this.$confirm('您确定要删除选中园区吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$ajax.deletePark({idlst:[id]}, res => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.get()
				})
			}).catch(() => {})
		},
		//切换页码
		handleSizeChange(val) {
			this.query.count = val;
			this.get();
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