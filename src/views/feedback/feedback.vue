<template>
    <div>
		<!-- 过滤区 -->
		<div class="filter">
			<span @click="changetype('1')" :class='query.timeLimit==1?"active":""'>今日</span>
			<span @click="changetype('4')" :class='query.timeLimit==4?"active":""'>近一周</span>
			<span @click="changetype('5')" :class='query.timeLimit==5?"active":""'>近一月</span>
			<span @click="changetype('')" :class='query.timeLimit==""?"active":""'>全部</span>
        </div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="mobile" label="用户名"></el-table-column>
            <el-table-column prop="email" label="联系方式"></el-table-column>
            <el-table-column prop="content" label="反馈内容"></el-table-column>
            <el-table-column prop="createtime" label="创建时间"></el-table-column>
        </el-table>
		<!--底部工具条-->
		<el-col :span="24" class="toolbar" style="display:flex;justify-content: flex-end;position:relative">
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
    </div>
</template>

<script>
export default {
	data() {
		return {
			tableData: [],
			multipleSelection: [],
			total:0,
			list:[],
			query:{
				page:1,
				count:10,
				timeLimit:'1'
			},
		}
	},
	mounted(){
		this.getlist();
	},
	methods: {
		changetype(val){
			this.query.timeLimit=val
			this.getlist()
		},
		handleCurrentChange(val){ // 切换元页
			this.query.page = parseInt(val)
			this.getlist()
		},
		getlist(){
			this.$ajax.queryUserFeedbackList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
			})
		},
		//切换页码
		handleSizeChange(val) {
			this.query.count = val;
			this.getlist();
		}
	}
}
</script>
<style lang="scss" scoped>
	.addBtn{
		float: right;
		margin-right: 100px;
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