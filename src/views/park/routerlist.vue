<template>
    <div>
		<!-- 过滤区 -->
		<div class="filter">
			<el-button class="addBtn" type="primary" @click="beginshow()">添加</el-button>
		</div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="caption" label="路线名"></el-table-column>
            <el-table-column label="类型" prop="typeName"></el-table-column>
            <el-table-column label="状态">
            	<template slot-scope="scope">{{ scope.row.isenable==0?'禁用':'启用' }}</template>
            </el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
            <el-table-column label="操作">
				<template slot-scope="scope">
                    <el-button type="text" size="small" @click="detail(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="beginshow(scope.row)">修改</el-button>
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
		<!--路线新增-->
        <div class="el-dialog__wrapper" v-show="Addshow">
			<div class="el-dialog">
				<div class="el-dialog__header">
					<span class="el-dialog__title">修改路线名</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('newdata')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newdata" :rules="rules" ref="newdata" label-width="80px">
						<el-form-item label="路线名"  prop="caption" class="top">
							<el-input v-model="newdata.caption"></el-input>
						</el-form-item>
						<el-form-item label="分类" prop="type" class="top">
							<el-select v-model="newdata.type"  >
								<el-option  :label="n.typeName" :value="n.id" :key="n.id" v-for="n in typelist"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态" prop="isenable" class="top">
							<el-radio-group v-model="newdata.isenable">
								<el-radio v-model="newdata.isenable" label="0">禁用</el-radio>
								<el-radio v-model="newdata.isenable" label="1">启用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="颜色" prop="color" class="top">
							<el-color-picker v-model="newdata.color"></el-color-picker>
						</el-form-item>
						<el-form-item label="路线信息">
							<div style="height:400px" id="mymap">
							</div>
							<el-input type="text" id="tipinput"  v-model="tipinput" placeholder="请输入您想查询的位置" style="width:200px"></el-input>
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
		<!--路线查看-->
        <div class="el-dialog__wrapper" v-show="Detailshow">
			<div class="el-dialog">
				<div class="el-dialog__header">
					<span class="el-dialog__title">修改路线名</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('newdata')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newdata" :rules="rules" ref="newdata" label-width="80px">
						<el-form-item label="路线名"  prop="caption" class="top">
							<el-input v-model="newdata.caption" disabled="disabled"></el-input>
						</el-form-item>
						<el-form-item label="分类" prop="type" class="top">
							<el-select v-model="newdata.type" disabled="disabled"  >
								<el-option  :label="n.typeName" :value="n.id" :key="n.id" v-for="n in typelist"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态" prop="isenable" class="top">
							<el-radio-group v-model="newdata.isenable" disabled="disabled">
								<el-radio v-model="newdata.isenable" label="0">禁用</el-radio>
								<el-radio v-model="newdata.isenable" label="1">启用</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="颜色" prop="color" class="top">
							<el-color-picker v-model="newdata.color"></el-color-picker>
						</el-form-item>
						<el-form-item label="路线信息">
							<div style="height:400px" id="mymapdetail">
							</div>
						</el-form-item>
					</el-form>
				</div>
				<div class="el-dialog__footer">
					<div class="dialog-footer">
						<el-button @click="cancel('newdata')">取 消</el-button>
						<el-button type="primary" @click="cancel('newdata')">确 定</el-button>
					</div>
				</div>
			</div>
        </div>
    </div>
</template>
<script>
export default {
	data() {
	return {
        parkid:sessionStorage.getItem('parkid'),
		tableData: [],
		multipleSelection: [],
		total:0,
		query:{
            parkid:sessionStorage.getItem('parkid'),
			page:1,
			count:10
		},
		Addshow:false,
		Detailshow:false,
		newdata:{
			"isenable": '1',
			"parkid": sessionStorage.getItem('parkid')
		},
		rules: {
			caption: [{required: true, message: '请输入路线名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
			type: [{required: true, message: '请选择类型', trigger: 'change'}],
			color: [{required: true, message: '请选择类型', trigger: 'change'}],
        },
        GDMap:"",
		GDPolyline:"",
		GDMap2:"",
        GDPolyline2:"",
		GDLineEditor:"",
		tipinput:'',
		placeSearch:'',
		typelist:[]
	}
},
	mounted(){
		this.GDMap2 = new AMap.Map('mymapdetail', {
            resizeEnable: true,
            expandZoomRange: true,
            zoom: 14,
            zooms: [3, 19]
		});
		this.GDPolyline2 = new AMap.Polyline({
			map: this.GDMap2,
			strokeColor: "#FF33FF",//线颜色
			strokeOpacity: 1,//线透明度
			strokeWeight: 3,//线宽
			strokeStyle: "solid"//线样式
		});
		// 添加编辑类
		this.GDMap = new AMap.Map('mymap', {
            resizeEnable: true,
            expandZoomRange: true,
            zoom: 14,
            zooms: [3, 19]
		});
		this.GDPolyline = new AMap.Polyline({
			map: this.GDMap,
			strokeColor: "#FF33FF",//线颜色
			strokeOpacity: 1,//线透明度
			strokeWeight: 3,//线宽
			strokeStyle: "solid"//线样式
		});
		this.GDLineEditor = new AMap.PolyEditor(this.GDMap, this.GDPolyline);
		this.GDLineEditor.open();
        var autoOptions = {
            input: "tipinput"
        };
        var auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
            map: this.GDMap
        });  //构造地点查询类
        AMap.event.addListener(auto, "select", this.select);//注册监听，当选中某条记录时会触发
        if(!this.parkid){
            this.$router.push({path:'/parklist'})
            return false
        }
		this.get();
		this.gettypelist();
	},
	methods: {
		select(e) {
            var x= e.poi.location.lng
			var y = e.poi.location.lat
			this.GDMap.setCenter([x,y]);
			this.lineinit()
        },
		lineinit(){
			var curPath = [];
			var center = this.GDMap.getCenter(); //获取当前地图中心位置
			var x= center.lng
			var y = center.lat
			for (var i = 0; i < 3; i++) {
				var cur = [];
				switch (i) {
					case 0:
						cur.push(Number(x) );
						cur.push(Number(y) );
						break;
					case 1:
						cur.push(Number(x) - 0.01);
						cur.push(Number(y) - 0.01);
						break;
					case 2:
						cur.push(Number(x)  + 0.01);
						cur.push(Number(y)  - 0.01);
						break;
				}
				curPath.push(cur);
			}
			this.GDPolyline.setPath(curPath);
		},
		beginshow(data){
			this.Addshow = true
			if(data){
				this.newdata = data
				try{
					var line = JSON.parse(data.lineslist)
				}catch(err){
					var line =[]
				}
				this.GDPolyline.setPath(line);
				this.GDMap.setFitView()
			}else{
				this.lineinit();
				this.newdata={
					"isenable": '1',
					"parkid": sessionStorage.getItem('parkid')
				}
				this.tipinput = ''
			}
		},
		cancel(formName){
			this.Addshow = false
			this.Detailshow = false
			this.newdata={
				"isenable": '1',
				"parkid": sessionStorage.getItem('parkid')
			}
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					var path = this.GDPolyline.getPath()
					var curpath = []
					for(let i = 0;i<path.length;i++){
						var cur = [path[i].lng,path[i].lat];
						curpath.push(cur)
					}
					this.newdata.lineslist = JSON.stringify(curpath)
					if(this.newdata.id){
						this.$ajax.updateRoute({id: this.newdata.id,parameters: {caption:this.newdata.caption,isenable:this.newdata.isenable,lineslist:this.newdata.lineslist,parkid:this.newdata.parkid,type:this.newdata.type,color:this.newdata.color}}, res => {
							this.$message({
								type: 'success',
								message: '修改成功!'
							});
							this.Addshow = false
							this.get()
						})
					}else{
						this.$ajax.addRoute(this.newdata, res => {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.Addshow = false
							this.get()
						})
					}
					
				} else {
					return false;
				}
			});
		},
		detail(detail){
			this.Detailshow = true 
			this.newdata = detail
			try{
				var line = JSON.parse(detail.lineslist)
			}catch(err){
				var line =[]
			}
			this.GDPolyline2.setPath(line);
			this.GDMap2.setFitView();
		},
		handleCurrentChange(val){ // 切换元页
			this.query.page = val.toString()
			this.get()
		},
		enableState(val){
			if(this.multipleSelection.length!=0){
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$ajax.setRouteEnableState({idlst:idlst,isenable:val}, res => {
					this.$message({
						type: 'success',
						message: '设置成功!'
					});
					this.get()
				})
			}
		},
		delAll(){
			if(this.multipleSelection.length!=0){
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$confirm('您确定要删除选中路线吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$ajax.deleteRoute({idlst:idlst}, res => {
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
			this.$ajax.queryRouteList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
			})
		},
		gettypelist(){
			this.$ajax.queryTypeList({count:999,page:1,groupId:3}, res => {
				this.typelist = res.data
			})
		},
		del(id){
			this.$confirm('您确定要删除选中路线吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$ajax.deleteRoute({idlst:[id]}, res => {
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
		.el-dialog{
			width: 1100px;
			margin-top: 15vh;
		}
		.top{
			width: 240px;
			display: inline-block;
		}
	}
</style>