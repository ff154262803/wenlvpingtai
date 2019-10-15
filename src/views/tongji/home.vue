<template>
    <div>
        <!-- 景点 -->
        <div class="box">
            <p>景点</p>
            <div class="menu">
                <el-row class="top">
                    <el-col :span="8"><div>总数量</div></el-col>
                    <el-col :span="8"><div>总景点数</div></el-col>
                    <el-col :span="8"><div>AR景点数</div></el-col>
                </el-row>
                <el-row class="body">
                    <el-col :span="8"><div>{{list.siteNum}}</div></el-col>
                    <el-col :span="8"><div>{{list.siteNum-list.arNum}}</div></el-col>
                    <el-col :span="8"><div>{{list.arNum}}</div></el-col>
                </el-row>
            </div>
        </div>

        <!-- 用户数 -->
        <div class="box ma">
            <p>用户数</p>
            <div class="menu">
                <el-row class="top">
                    <el-col :span="8"><div>总用户数</div></el-col>
                    <el-col :span="8"><div>新增用户数</div></el-col>
                    <el-col :span="8"><div>今日使用用户数</div></el-col>
                </el-row>
                <el-row class="body">
                    <el-col :span="8"><div>{{list.userNum}}</div></el-col>
                    <el-col :span="8"><div>{{list.newUserNum}}</div></el-col>
                    <el-col :span="8"><div>{{list.livelyUserNum}}</div></el-col>
                </el-row>
            </div>
        </div>
        <!-- 景点 -->
        <div class="bbox">
            <p>充值</p>
            <div class="menu">
                <el-row class="top">
                    <el-col :span="6"><div>新增订单数</div></el-col>
                    <el-col :span="6"><div>新增订单总额</div></el-col>
                    <el-col :span="6"><div>新增AR订单数</div></el-col>
                    <el-col :span="6"><div>新增AR订单总额</div></el-col>
                </el-row>
                <el-row class="body">
                    <el-col :span="3"><div>Android<br/><span>{{list.android_newOrderNum}}</span></div></el-col>
                    <el-col :span="3"><div>IOS<br/><span>{{list.ios_newOrderTotalPrices}}</span></div></el-col>
                    <el-col :span="3"><div>Android<br/><span>{{list.android_newOrderTotalPrices}}</span></div></el-col>
                    <el-col :span="3"><div>IOS<br/><span>{{list.ios_newOrderTotalPrices}}</span></div></el-col>
                    <el-col :span="3"><div>Android<br/><span>{{list.android_newAROrderNum}}</span></div></el-col>
                    <el-col :span="3"><div>IOS<br/><span>{{list.ios_newAROrderNum}}</span></div></el-col>
                    <el-col :span="3"><div>Android<br/><span>{{list.android_newAROrderTotalPrices}}</span></div></el-col>
                    <el-col :span="3"><div>IOS<br/><span>{{list.ios_newAROrderTotalPrices}}</span></div></el-col>
                </el-row>
            </div>
        </div>
        <div class="bbox feedback">
            <p>意见反馈</p>
            <div class="menu">
                <el-row class="top">
                    <el-col :span="24"><div>新增意见反馈数</div></el-col>
                </el-row>
                <el-row class="body">
                    <el-col :span="12"><div>Android<br/><span>{{list.android_feedbackNum}}</span></div></el-col>
                    <el-col :span="12"><div>IOS<br/><span>{{list.ios_feedbackNum}}</span></div></el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script>
 export default {
    data() {
      return {
          list:[]
      }
    },
    mounted(){
        this.$ajax.getDataCube({
        }, res => {
            this.list = res.data
        })
    },
    methods:{
    }
}
</script>
<style lang="scss" scoped>
.box{
    width: 400px;
    float: left;
    .body{
        font-size: 20px;
        font-weight: 600;
        .el-col:nth-child(1){
            color: #1dc14a
        }
        .el-col:nth-child(2){
            color: #0099ec
        }
        .el-col:nth-child(3){
            color: #b300ec
        }
    }
}
.ma{
     margin-left: 100px;
}
.bbox{
    width: 900px;
    margin-top: 20px;
    .body{
        .el-col span{
            font-size: 20px;
            color: #0099ec;
            font-weight: 600;
        }
    }
}
.feedback{
   width: 200px; 
}
.menu{
    line-height: 50px;
    text-align: center;
    border: 1px solid #d4d4d4;
    .top{
        background: #f5f5f5;
    }
    .body {
        border-top: 1px solid #d4d4d4;
        .el-col{
            border-right: 1px solid #d4d4d4;
            &:last-child {
                border-right: 0px solid #d4d4d4;
            }
        }

    }
  }
</style>

