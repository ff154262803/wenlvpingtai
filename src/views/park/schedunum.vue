<template>
    <div>
        <div>
            <div class="block">
                <el-date-picker v-model="time" type="daterange" @change="timechange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="block">
                <el-select placeholder="活动" v-model="data.eventid" @change="venchange">
                    <el-option v-for="n in eventdata" :key="n.id" :label="n.caption" :value="n.id"></el-option>
                </el-select>
            </div>
        </div>
        <div id="myChart" :style="{width: '100%', height: '20px'}"></div>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="caption" label="用户名"></el-table-column>
            <el-table-column label="手机号" prop="mobile"></el-table-column>
            <el-table-column label="时段">
                <template slot-scope="scope">{{ scope.row.starttime+'-'+scope.row.endtime }}</template>
            </el-table-column>
            <el-table-column prop="eventsDate" label="预约日期"></el-table-column>
            <el-table-column prop="createtime" label="创建日期"></el-table-column>
        </el-table>
        <!--底部工具条-->
        <el-col :span="24" class="toolbar" style="display:flex;justify-content: flex-end;position:relative">
            <el-pagination background layout="total,sizes, prev, pager, next, jumper"
                @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 15, 20, 30, 50]"
                :current-page.sync="query.page" :page-size="query.count" :total="total">
            </el-pagination>
            <el-button size="small">确定</el-button>
        </el-col>
    </div>
</template>
<script>
    import echarts from 'echarts'
    export default {
        data() {
            return {
                eventdata: [],
                time: [new Date().setDate((new Date()).getDate() - 7), new Date()],
                tableData: [],
                data: {
                    eventid: '',
                    startDate: '',
                    endDate: '',
                    page: 1,
                    count: 10
                },
                query: {
                    parkid: sessionStorage.getItem('parkid') ? sessionStorage.getItem('parkid') : "",
                    page: 1,
                    count: 999
                },
                xAxis: [],
                yAxis: [],
                total: 0,
            }
        },
        created() {
            // this.data.startDate = this.timeform('yyyy-MM-dd',new Date())
            this.data.startDate = this.timeform('yyyy-MM-dd', new Date().setDate((new Date()).getDate() - 7))
            this.data.endDate = this.timeform('yyyy-MM-dd', new Date())
        },
        mounted() {
            this.getlist()
        },
        methods: {
            handleCurrentChange(val) { // 切换元页
                this.data.page = parseInt(val)
                this.setuser()
            },
            //切换页码
            handleSizeChange(val) {
                this.data.count = val;
                this.setuser();
            },
            timeform: function (format, time) {//转化时间格式传输给后台
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
            setoption() {
                this.xAxis = []
                this.yAxis = []
                this.setuser()
                this.$ajax.getEventsNumList(this.data, res => {
                    for (let i in res.data) {
                        this.xAxis.push(i)
                        this.yAxis.push(res.data[i])
                    }
                    this.drawLine();
                })
            },
            setuser() {
                this.$ajax.getEventsUserList(this.data, res => {
                    this.tableData = res.data
                    this.total = res.total
                })
            },
            timechange() {
                if (new Date(this.time[1]).setHours(0, 0, 0, 0) - new Date(this.time[0]).setHours(0, 0, 0, 0) > 7 * 24 * 60 * 60 * 100) {
                    this.$message.error('最多查询7天内容')
                } else {
                    this.data.startDate = this.timeform('yyyy-MM-dd', this.time[0])
                    this.data.endDate = this.timeform('yyyy-MM-dd', this.time[1])
                    this.setoption()
                }
            },
            venchange() {
                this.setoption()
            },
            getlist() {
                this.$ajax.queryEventsList(this.query, res => {
                    this.eventdata = res.data.filter(function (n) {
                        if (n.issubscribe == 1) {
                            return true;
                        }
                    });
                    if (this.eventdata.length > 0) {
                        this.data.eventid = this.eventdata[0].id
                        this.setoption()
                    }
                })
            },
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = echarts.init(document.getElementById('myChart'))
                var that = this
                // 绘制图表
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: that.xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: that.yAxis,
                        type: 'line'
                    }]
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .block {
        display: inline-block;
    }
</style>