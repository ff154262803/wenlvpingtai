<template>
    <div>
		<div class="filter">
			<el-button class="addBtn" type="primary" @click="beginshow()">添加</el-button>
		</div>
		<!-- 表格区 -->
        <el-table
            ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"  align="center"></el-table-column>
            <el-table-column prop="starttimepart" label="开始时间"></el-table-column>
            <el-table-column label="结束时间" prop="endtimepart"></el-table-column>
            <el-table-column label="预约开启时间">
            	<template slot-scope="scope">提前{{ scope.row.subscribetime }}小时</template>
            </el-table-column>
            <el-table-column label="检票开启时间">
            	<template slot-scope="scope">提前{{ scope.row.checkedtime }}分钟</template>
            </el-table-column>
            <el-table-column label="已预约/总人数">
            	<template slot-scope="scope">{{ scope.row.usedcount }}/{{ scope.row.count }}</template>
            </el-table-column>
            <el-table-column label="状态">
            	<template slot-scope="scope">{{ scope.row.isenable ==1?'已启用':'已禁用' }}</template>
            </el-table-column>
            <el-table-column prop="startdate" label="生效日期"></el-table-column>
            <el-table-column prop="enddate" label="截至日期"></el-table-column>
            <el-table-column label="操作" width="150" >
				<template slot-scope="scope">
                    <!-- <el-button type="text" size="small" @click="beginshow(scope.row)">详情</el-button> -->
                    <el-button type="text" size="small" @click="beginshow(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="setenableState(scope.row.id,1)" v-show="scope.row.isenable==0">启用</el-button>
                    <el-button type="text" size="small" @click="setenableState(scope.row.id,0)" v-show="scope.row.isenable==1">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!--底部工具条-->
		<el-col :span="24" class="toolbar" style="display:flex;justify-content: flex-end;position:relative">
			<div style="position:absolute;left:10px;top:5px">
				<el-button @click="enableState(1)">启用</el-button>
                <el-button @click="enableState(0)">禁用</el-button>
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
					<span class="el-dialog__title">{{newdata.id?'修改时段':'新增时段'}}</span>
					<button class="el-dialog__headerbtn" aria-label="Close" type="button" @click="cancel('newdata')"><i class="el-dialog__close el-icon el-icon-close"></i></button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newdata" :rules="rules" ref="newdata" label-width="120px">
                        <el-form-item label="开始时间"  prop="time">
							<el-time-picker is-range v-model="newdata.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
						</el-form-item>
						<el-form-item label="预约开启时间" prop="subscribetime">
							<el-input v-model="newdata.subscribetime" placeholder="小时"></el-input>
						</el-form-item>
						<el-form-item label="检票开始时间" prop="checkedtime">
							<el-input v-model="newdata.checkedtime" placeholder="分钟"></el-input>
						</el-form-item>
                        <el-form-item label="可预约人数"  prop="count">
							<el-input v-model="newdata.count"></el-input>
						</el-form-item>
						<el-form-item label="生效日期"  prop="date">
							<el-date-picker v-model="newdata.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
                        <el-form-item label="重复">
                            <el-checkbox-group v-model="week">
                                <el-checkbox label="0" >周日</el-checkbox>
                                <el-checkbox label="1" >周一</el-checkbox>
                                <el-checkbox label="2" >周二</el-checkbox>
                                <el-checkbox label="3" >周三</el-checkbox>
                                <el-checkbox label="4" >周四</el-checkbox>
                                <el-checkbox label="5" >周五</el-checkbox>
                                <el-checkbox label="6" >周六</el-checkbox>
                            </el-checkbox-group>
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
        var checkSubscribetime = (rule, value, callback) => {
			if (!/^\d+$/.test(value)||value>24) {
				callback(new Error('请输入最大24的整数'));
			}else{
				callback();
			}
          };
          var checkTime = (rule, value, callback) => {
			if (!/^\d+$/.test(value)||value>24*60) {
				callback(new Error('请输入最大'+24*60+'的整数'));
			}else{
				callback();
			}
          };
           var checkCount = (rule, value, callback) => {
			if (!/^\d+$/.test(value)||value>100000) {
				callback(new Error('请输入最大100000的整数'));
			}else{
				callback();
			}
      	};
        return {
            week:['0','1','2','3','4','5','6'],
            tableData: [],
            multipleSelection: [],
            total:0,
            query:{
                eventid:this.$route.query.id?this.$route.query.id:"",
                page:1,
                count:10
            },
            Addshow:false,
            Detailshow:false,
            newdata:{},
            rules: {
                time: [{ required: true, message: '起始时间不能为空'}],
                subscribetime: [{ required: true,validator: checkSubscribetime }],
                checkedtime: [{ required: true,validator: checkTime }],
                count: [{ required: true,validator: checkCount }],
                date: [{ required: true, message: '起始日期不能为空'}]
            }
        }
    },
	mounted(){
        this.getlist();
        if(!this.$route.query.id){
            this.$router.push({path:'/schedule'})
            return false
        }
	},
	methods: {
		handleSizeChange(val) {
			this.query.count = val;
			this.getlist();
		},
		timeform: function(format, time){//转化时间格式传输给后台
            // 初始化时间对象d,并使用d转化一个date object
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
		beginshow(data){
			this.Addshow = true
			this.Detailshow = false
			if(data){
				this.newdata = {
                    id:data.id,
                    time:[new Date(2019, 1, 1, data.starttimepart.split(':')[0], data.starttimepart.split(':')[1]), new Date(2019, 1, 1, data.endtimepart.split(':')[0],data.endtimepart.split(':')[1])],
                    checkedtime: data.checkedtime ,
                    count :data.count ,
                    eventid :data.id,
                    date:[new Date(data.startdate.split('-')[0],data.startdate.split('-')[1],data.startdate.split('-')[2]), new Date(data.enddate.split('-')[0],data.enddate.split('-')[1],data.enddate.split('-')[2])],
                    subscribetime :data.subscribetime
                }
                this.week  = data.weeks.split(',')
			}else{
				this.newdata={}
			}
		},
		cancel(formName){
			this.Addshow = false
			this.Detailshow = false
			this.newdata={

            }
		},
		add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if(this.newdata.date[0]){
						this.newdata.startdate = this.timeform('yyyy-MM-dd',this.newdata.date[0])
					}
					if(this.newdata.date[1]){
						this.newdata.enddate = this.timeform('yyyy-MM-dd',this.newdata.date[1])
                    }
                    if(this.newdata.time[0]){
						this.newdata.starttimepart = this.timeform('hh:mm',this.newdata.time[0])
					}
					if(this.newdata.time[1]){
						this.newdata.endtimepart = this.timeform('hh:mm',this.newdata.time[1])
					}
					if(this.newdata.id){
                        let data ={ 
                            "checkedtime": this.newdata.checkedtime,
                            "count": this.newdata.count,
                            "enddate": this.newdata.enddate,
                            "endtimepart": this.newdata.endtimepart,
                            "eventid": this.$route.query.id,
                            "startdate": this.newdata.startdate,
                            "starttimepart": this.newdata.starttimepart,
                            "subscribetime": this.newdata.subscribetime,
                            "weeks": this.week.join()
                        }
						this.$ajax.updateTimePart({id: this.newdata.id,parameters: data}, res => {
							this.$message({
								type: 'success',
								message: '修改成功!'
							});
							this.Addshow = false
							this.getlist()
						})
					}else{
                        let data ={ 
                            "checkedtime": this.newdata.checkedtime,
                            "count": this.newdata.count,
                            "enddate": this.newdata.enddate,
                            "endtimepart": this.newdata.endtimepart,
                            "eventid": this.$route.query.id,
                            "startdate": this.newdata.startdate,
                            "starttimepart": this.newdata.starttimepart,
                            "subscribetime": this.newdata.subscribetime,
                            "weeks": this.week.join()
                        }
						this.$ajax.addTimePart(data, res => {
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
        setenableState(id,val){
            this.$ajax.setTimePartEnableState({idlst:[id],isenable:val}, res => {
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                });
                this.getlist()
            })
		},
		enableState(val){
			if(this.multipleSelection.length>0){
				let idlst=[]
				for(let i = 0;i<this.multipleSelection.length;i++){
					idlst.push(this.multipleSelection[i].id)
				}
				this.$ajax.setTimePartEnableState({idlst:idlst,isenable:val}, res => {
					this.$message({
						type: 'success',
						message: '设置成功!'
					});
					this.getlist()
				})
			}
		},
		getlist(){
			this.$ajax.queryTimePartList(this.query, res => {
				this.tableData = res.data
				this.total = res.total
			})
        },
        // 分页相关
        handleCurrentChange(val){ // 切换元页
			this.query.page = val
			this.getlist()
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
			width: 520px;
			margin-top: 15vh;
		}
		.el-dialogedit{
			width: 1000px;
			margin-top: 15vh;
		}
	}
</style>