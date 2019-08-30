<template>
    <div class="mianbox">
        <div class="box">
            <div class="menu">
                <el-row class="p">
                    <el-col :span="16"><div>基本信息</div></el-col>
                    <el-col :span="8"><div class="btnright"><el-button type="info" plain @click="del">删除</el-button><el-button type="info" plain @click="enableState(0)" v-show="detail.isenable==1">禁用</el-button><el-button type="info" plain @click="enableState(1)" v-show="detail.isenable==0">启用</el-button></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="24"><div><span>ID：</span>{{detail.id}}</div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>景区名：</span>{{detail.caption}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('caption')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>分类：</span>{{detail.typeName}}</div></el-col>
                    <el-col :span="2"><div class="icon"  @click="edit('type')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>显示层级：</span>{{detail.lowlevel}} - {{detail.highlevel}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('level')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>特点标签：</span>{{detail.tag}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('tag')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row><el-row class="list">
                    <el-col :span="22"><div><span>开放时间：</span>{{detail.opentime}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('opentime')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>咨询电话：</span>{{detail.phonenumber}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('phonenumber')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                 <el-row class="list">
                    <el-col :span="22"><div><span>概述：</span>{{detail.remark}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('remark')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>创建时间：</span>{{detail.createtime}}</div></el-col>
                </el-row>
            </div>
        </div>
        <div class="box">
            <div class="menu">
                <el-row class="p">
                    <el-col :span="14"><div>AR信息</div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>是否AR：</span>{{detail.isar=='1'?'是':'否'}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('isar')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <div v-show="detail.isar==1">
                    <el-row class="list">
                        <el-col :span="22"><div><span>最佳时间：</span>{{detail.besttime}}</div></el-col>
                        <el-col :span="2"><div class="icon" @click="edit('besttime')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                    </el-row>
                    <el-row class="list">
                        <el-col :span="22"><div><span>积分：</span>{{detail.score}}</div></el-col>
                        <el-col :span="2"><div class="icon" @click="edit('score')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                    </el-row>
                    <el-row class="list">
                        <el-col :span="22"><div><span>需要解锁：</span>{{detail.islock=='1'?'是':'否'}}</div></el-col>
                        <el-col :span="2"><div class="icon" @click="edit('islock')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                    </el-row>
                    <el-row class="list" v-show="detail.islock==1">
                        <el-col :span="22"><div><span>解锁条件：</span>{{detail.unlockcondition}}</div></el-col>
                        <el-col :span="2"><div class="icon" @click="edit('unlockcondition')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="box boxr mapbox">
            <div class="menu">
                <el-row class="p">
                    <el-col :span="10"><div>位置和AR围栏</div></el-col>
                    <el-col :span="14"><div class="btnright">
                        <el-button type="info" plain @click="showchange()" v-show="showedit==false">修改AR围栏和位置<span style="color:#2a88fb;">——</span></el-button>
                        <el-button type="info" plain v-show="showedit==true"  @click="editcancle">取消</el-button>
                        <el-button type="info" plain v-show="showedit==true" @click="editsubmit">确定</el-button>
                    </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="24"><div class="map" id="GDMAP"></div></el-col>
                </el-row>
            </div>
        </div>
        <div class="box boxr">
            <div class="menu">
                <el-row class="p">
                    <el-col :span="14"><div>资源数据</div></el-col>
                </el-row>
                <el-row class="list"  style="height:80px;">
                    <el-col :span="22"><div><span>介绍图：</span>
                        <div class="pic"  v-for="(n,i) in fileList" :key="n">
                            <img :src="$store.state.resip+n" alt="" class="pic">
                            <img src="../../../static/img/close.png" alt="" class="close" @click="close(i)">
                        </div>
                    </div></el-col>
                   <el-upload class="upload-demo" style="display:none"
                        :data="uploaddata"
				        :action="$store.state.ip+'/resources/uploadResource'"
                        :on-progress="handleLoading"
                        :on-success='onsuccsesspic'
                        :before-upload="beforeUploadpic"  
                        :on-error='onerror'
				        multiple
				        :limit="5"
				        :on-exceed="handleExceed"
				        list-type="picture">
                        <el-button size="small" type="primary" id="uppic">点击上传</el-button>
                    </el-upload>
                    <el-col :span="2"><div class="icon">
                        <img src="../../../static/img/upload.png" alt="" v-show="fileList.length <5" @click="uploading('uppic')">
                    </div></el-col>
                </el-row>
                <el-row class="list" >
                    <el-col :span="22"><div><span>语音讲解：</span>{{detail.voiceurl }}</div></el-col>
                    <el-upload class="upload" accept="audio/mpeg" :action="$store.state.ip+'/resources/uploadResource'" style="display:none"
                        :data="uploaddata"
                        :on-progress="handleLoading"
                        :on-success="onsuccsessmp3"                                
                        :before-upload="beforeUploadmp3"   
                        :on-error='onerror'>
                        <el-button size="small" type="primary" id="upmp3">点击上传</el-button>
                    </el-upload>
                    <el-col :span="2"><div class="icon">
                        <img src="../../../static/img/del.png" alt="" style="width:25px"  v-show="detail.voiceurl !=''" @click="deling('voiceurl')">
                        <img src="../../../static/img/upload.png" alt="" v-show="detail.voiceurl ==''" @click="uploading('upmp3')">
                    </div></el-col>
                </el-row>
                <el-row class="list" >
                    <el-col :span="22"><div><span>视频：</span>{{detail.videourl }}</div></el-col>
                    <el-upload class="upload" accept="video/mp4" :action="$store.state.ip+'/resources/uploadResource'" style="display:none"
                        :data="uploaddata"
                        :on-progress="handleLoading"
                        :on-success="onsuccsessmp4"                                
                        :before-upload="beforeUploadmp4"   
                        :on-error='onerror'>
                        <el-button size="small" type="primary" id="upmp4">点击上传</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过50M</div>
                    </el-upload>
                    <el-col :span="2"><div class="icon">
                        <img src="../../../static/img/del.png" alt="" style="width:25px"  v-show="detail.videourl  !=''" @click="deling('videourl')">
                        <img src="../../../static/img/upload.png" alt="" v-show="detail.videourl  ==''" @click="uploading('upmp4')">
                    </div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>模型：</span>{{detail.modelurl }}</div></el-col>
                    <el-upload class="upload" accept="application/zip" :action="$store.state.ip+'/resources/uploadResource'" style="display:none"
                        :on-progress="handleLoading"
                        :on-success="onsuccsessobj"                                
                        :before-upload="beforeUploadobj"   
                        :data="uploaddata"
                        :on-error='onerror'>
                        <el-button size="small" type="primary" id="upobj">点击上传</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传zip文件，且不超过50M</div>
                    </el-upload>
                    <el-col :span="2"><div class="icon">
                        <img src="../../../static/img/del.png" alt="" style="width:25px"  v-show="detail.modelurl  !=''" @click="deling('modelurl')">
                        <img src="../../../static/img/upload.png" alt="" v-show="detail.modelurl  ==''" @click="uploading('upobj')">
                    </div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>详情类型：</span>{{detail.detailstypeName}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('detailstype')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
                <el-row class="list">
                    <el-col :span="22"><div><span>详情链接：</span>{{detail.linkh5url}}</div></el-col>
                    <el-col :span="2"><div class="icon" @click="edit('linkh5url')"><img src="../../../static/img/edit.png" alt=""></div></el-col>
                </el-row>
            </div>
        </div>
        <!--修改景区名-->
        <el-dialog title="修改景区名" :visible.sync="captionShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="caption" label-width="100px">
                <el-form-item label="景区名"  prop="caption">
                    <el-input v-model="detail.caption"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('caption')">取 消</el-button>
                <el-button type="primary" @click="add('caption')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改分类-->
        <el-dialog title="修改分类" :visible.sync="typeShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="type" label-width="100px">
                <el-form-item label="分类" prop="type">
					<el-select v-model="detail.type"  >
						<el-option v-for="item in list" :label="item.typeName" :value="item.id" :key="item.id" ></el-option>
					</el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('type')">取 消</el-button>
                <el-button type="primary" @click="add('type')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改等级-->
        <el-dialog title="修改等级" :visible.sync="levelShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="level" label-width="100px">
                <el-form-item label="最低等级" prop="lowlevel">
					<el-select v-model="detail.lowlevel">
						<el-option label="12" value=12></el-option>
                        <el-option label="13" value=13></el-option>
                        <el-option label="14" value=14></el-option>
                        <el-option label="15" value="15"></el-option>
                        <el-option label="16" value="16"></el-option>
                        <el-option label="17" value="17"></el-option>
                        <el-option label="18" value="18"></el-option>
                        <el-option label="19" value="19"></el-option>
                        <el-option label="20" value="20"></el-option>
                        <el-option label="21" value="21"></el-option>
					</el-select>
                </el-form-item>
                <el-form-item label="最高等级" prop="highlevel">
					<el-select v-model="detail.highlevel ">
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('level')">取 消</el-button>
                <el-button type="primary" @click="add('level')">确 定</el-button>
            </div>
        </el-dialog>
         <!--修改标签-->
        <el-dialog title="修改标签" :visible.sync="tagShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="tag" label-width="100px">
                <el-form-item label="标签名"  prop="tag">
                    <el-input v-model="detail.tag"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('tag')">取 消</el-button>
                <el-button type="primary" @click="add('tag')">确 定</el-button>
            </div>
        </el-dialog>
         <!--修改开放时间-->
        <el-dialog title="修改开放时间" :visible.sync="opentimeShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="opentime" label-width="100px">
				<el-form-item label="开放时间" prop="opentime">
                    <el-input v-model="detail.opentime"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('opentime')">取 消</el-button>
                <el-button type="primary" @click="add('opentime')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改咨询电话-->
        <el-dialog title="修改咨询电话" :visible.sync="phonenumberShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="phonenumber" label-width="100px">
				<el-form-item label="咨询电话" prop="phonenumber">
                    <el-input v-model="detail.phonenumber"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('phonenumber')">取 消</el-button>
                <el-button type="primary" @click="add('phonenumber')">确 定</el-button>
            </div>
        </el-dialog>
         <!--修改标签-->
        <el-dialog title="修改概述" :visible.sync="remarkShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="remark" label-width="100px">
                <el-form-item label="标签名"  prop="remark">
                    <el-input v-model="detail.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('remark')">取 消</el-button>
                <el-button type="primary" @click="add('remark')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改是否AR-->
        <el-dialog title="修改是否AR" :visible.sync="isarShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="isar" label-width="100px">
                <el-form-item label="标签名"  prop="isar">
                    <el-radio v-model="detail.isar" label="0">否</el-radio>
                    <el-radio v-model="detail.isar" label="1">是</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('isar')">取 消</el-button>
                <el-button type="primary" @click="add('isar')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改最佳时间-->
        <el-dialog title="修改最佳时间" :visible.sync="besttimeShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="besttime" label-width="100px">
                <el-form-item label="最佳时间"  prop="besttime">
                    <el-input v-model="detail.besttime"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('besttime')">取 消</el-button>
                <el-button type="primary" @click="add('besttime')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改AR收费-->
        <el-dialog title="修改AR收费" :visible.sync="scoreShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="score" label-width="100px">
                <el-form-item label="AR收费" prop="score">
                    <el-input v-model="detail.score"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('score')">取 消</el-button>
                <el-button type="primary" @click="add('score')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改是否解锁-->
        <el-dialog title="修改是否解锁" :visible.sync="islockShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="islock" label-width="100px">
                <el-form-item label="标签名"  prop="islock">
                    <el-radio v-model="detail.islock" label="0">否</el-radio>
                    <el-radio v-model="detail.islock" label="1">是</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('islock')">取 消</el-button>
                <el-button type="primary" @click="add('islock')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改解锁条件-->
        <el-dialog title="修改景区名" :visible.sync="unlockconditionShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="unlockcondition" label-width="100px">
                <el-form-item label="景区名"  prop="unlockcondition">
                    <el-input v-model="detail.unlockcondition"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('unlockcondition')">取 消</el-button>
                <el-button type="primary" @click="add('unlockcondition')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改详情链接-->
        <el-dialog title="修改详情链接" :visible.sync="linkh5urlShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="linkh5url" label-width="100px">
                <el-form-item label="详情链接" prop="linkh5url">
                    <el-input v-model="detail.linkh5url"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('linkh5url')">取 消</el-button>
                <el-button type="primary" @click="add('linkh5url')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改详情类型-->
        <el-dialog title="修改详情类型" :visible.sync="detailstypeShow" class="demo-box" width="590px">
            <el-form :model="detail" :rules="detailrules" ref="detailstype" label-width="100px">
                <el-form-item label="详情类型" prop="detailstype">
                    <el-radio  v-for='n in linktype' :key='n.id' v-model="detail.detailstype" :label="n.id">{{n.typeName}}</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('detailstype')">取 消</el-button>
                <el-button type="primary" @click="add('detailstype')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
	data() {
        var checkScore =(rule, value, callback) => {
            if (!/^(([1-9]+\d*)|([1-9]+\d*\.\d{1,2}))$/.test(value)||value>10) {
                callback(new Error('请输入最大10且最多两位小数的数字'));
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
            uploaddata:{
                type:'',
                uKey:JSON.parse(sessionStorage.getItem('user')).uKey
            },
            siteid:sessionStorage.getItem('siteid')?sessionStorage.getItem('siteid'):"",
            electronicfencelist:[],
            detail:{},
            linktype:[],
            list:[],
            GDMap:"",
            GDPolygon:"",
            GDPolyEditor:"",
            GDMarker:"",
            showedit:false,
            fileList:[],
            detailrules:{
                caption: [{required: true, message: '请输入景区名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                type: [{required: true, message: '请选择园区类型', trigger: 'change'}],
                highlevel : [{required: true, message: '请选择最高等级', trigger: 'change'}],
                lowlevel : [{required: true, message: '请选择最低等级', trigger: 'change'}],
                tag: [{required: true, message: '请输入标签名', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                opentime: [{required: true, message: '请输入开放时间', trigger: 'blur'},{ max: 20, message: '最多20个字符', trigger: 'blur' }],
                phonenumber: [{ validator: checkPhone, trigger: 'blur' }],
                remark: [{required: true, message: '请输入概述', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                isar: [{required: true, message: '请选择是否AR', trigger: 'change'}],
                besttime: [{required: true, message: '请输入最佳时间', trigger: 'blur'}, { max: 20, message: '最多20个字符', trigger: 'blur' }],
                score:[{ validator: checkScore, trigger: 'blur' }],
            },
            captionShow:false,
            typeShow:false,
            levelShow:false,
            tagShow:false,
            opentimeShow:false,
            phonenumberShow:false,
            remarkShow:false,
            isarShow:false,
            besttimeShow:false,
            scoreShow:false,
            islockShow:false,
            unlockconditionShow:false,
            linkh5urlShow:false,
            detailstypeShow:false
        }
    },
	mounted(){
        // 高德地图对象
        this.GDMap = new AMap.Map('GDMAP', {
            resizeEnable: true,
            expandZoomRange: true,
            zoom: 14,
            zooms: [3, 19]
        });
        //地图多边形对象
        this.GDPolygon = new AMap.Polygon({
            map: this.GDMap,
            strokeColor: "#2a88fb",
            strokeOpacity: 1,
            strokeWeigth: 3,
            fillColor: "#4196ff",
            fillOpacity: 0.35
        });
        this.GDPolyEditor = new AMap.PolyEditor(this.GDMap, this.GDPolygon);
        this.GDMarker = new AMap.Marker({
            map: this.GDMap,
            draggable: false,
            cursor: 'move',
            animation: 'AMAP_ANIMATION_DROP'
        });
        this.getdetail();
        this.getlist();
	},
	methods: {
        close(i){
            this.fileList = this.fileList.splice(i,0)
            this.$ajax.updateSite({id:this.detail.id,parameters:{picurl :JSON.stringify(this.fileList)}}, res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.getdetail()
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        deling(prams){
            let json={}
            json[prams] = ''
             this.$ajax.updateSite({id:this.detail.id,parameters:json}, res => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getdetail()
            })
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
                this.fileList.push(response.shortUrl)
                this.$ajax.updateSite({id:this.detail.id,parameters:{picurl :JSON.stringify(this.fileList)}}, res => {
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    this.getdetail()
                    this.fullscreenLoading = false;
                })
            }
        },
        beforeUploadmp3(file){
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                this.$message.error('上传文件大小不能超过 50MB!');
            }
            return isLt50M;
        },
        onsuccsessmp3(response, file, fileList){
            this.$ajax.updateSite({id:this.detail.id,parameters:{voiceurl:response.url}}, res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.getdetail()
                this.fullscreenLoading = false;
            })
        },
        beforeUploadmp4(file){
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                this.$message.error('上传文件大小不能超过 50MB!');
            }
            return isLt50M;
        },
        onsuccsessmp4(response, file, fileList){
            this.$ajax.updateSite({id:this.detail.id,parameters:{videourl:response.url}}, res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.getdetail()
                this.fullscreenLoading = false;
            })
        },
        beforeUploadobj(file){
            const isLt50M = file.size / 1024 / 1024 < 50;
            if (!isLt50M) {
                this.$message.error('上传文件大小不能超过 50MB!');
            }
            return isLt50M;
        },
        onsuccsessobj(response, file, fileList){
            this.$ajax.updateSite({id:this.detail.id,parameters:{modelurl:response.url}}, res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.getdetail()
                this.fullscreenLoading = false;
            })
        },
        onerror(){
            this.fullscreenLoading = false;
        },
        getlist(){
            this.list =[]
            this.linktype=[]
			this.$ajax.queryTypeList({count:999}, res => {
                for(let i =0;i<res.data.length;i++){
                    if(res.data[i].groupId==1){
                        this.list.push(res.data[i])
                    }else if(res.data[i].groupId==2){
                        this.linktype.push(res.data[i])
                    }
                }
			})
		},
        getdetail(){
            if(this.siteid){
                this.$ajax.getSiteDetails({id:this.siteid}, res => {
                    this.detail = res.data
                    this.electronicfencelist = res.data.electronicfencelist?JSON.parse(res.data.electronicfencelist):[]
                    this.fileList = res.data.picurl?JSON.parse(res.data.picurl):[]
                    this.y = res.data.lat?res.data.lat:this.GDMap.getCenter().lat
                    this.x = res.data.lon?res.data.lon:this.GDMap.getCenter().lng

                    if(this.electronicfencelist.length){
                        this.GDPolygon.setPath(this.electronicfencelist);
                        this.GDMarker.setPosition([this.x,this.y])
                        this.GDMap.setFitView();
                    }else{
                        var curPath = [];
                        var center = this.GDMap.getCenter(); //获取当前地图中心位置
                        var x= center.lng
                        var y = center.lat
                        for (var i = 0; i < 3; i++) {
                            var cur = [];
                            switch (i) {
                                case 0:
                                    cur.push(Number(x) - 0.01);
                                    cur.push(Number(y)  - 0.01);
                                    break;
                                case 1:
                                    cur.push(Number(x) );
                                    cur.push(Number(y)  + 0.01);
                                    break;
                                case 2:
                                    cur.push(Number(x)  + 0.01);
                                    cur.push(Number(y)  - 0.01);
                                    break;
                            }
                            curPath.push(cur);
                        }
                        this.GDPolygon.setPath(curPath);
                        this.GDMap.setFitView();
                    }  
                })
            }
        },
        edit(formName){
            this[formName+'Show'] =true
        },
        add(formName){
			this.$refs[formName].validate((valid) => {
				if (valid) {
                    this[formName+'Show'] = false
                    let prams={}
                    if(formName=='level'){
                        prams.highlevel = this.detail.highlevel
                        prams.lowlevel = this.detail.lowlevel
                    }else{
                        prams[formName] = this.detail[formName]
                    }
					this.$ajax.updateSite({id:this.detail.id,parameters:prams}, res => {
						this.$message({
							type: 'success',
							message: '修改成功!'
                        });
                        this.getdetail()
					})
				} else {
					return false;
				}
			});
		},
		cancel(formName){
			this[formName+'Show'] = false
        },
        enableState(val){
            this.$ajax.setSiteEnableState({idlst:[this.siteid],isenable:val}, res => {
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                });
            })
		},
		del(){
            this.$confirm('您确定要删除该园区吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.deletePark({idlst:[this.siteid]}, res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {});
		},
		showchange(){
            this.showedit =true
            this.GDMarker.setDraggable(true)
            this.GDPolyEditor.open();
        },
        editsubmit(){
            var path = this.GDPolygon.getPath()
            var curpath = []
            for(let i = 0;i<path.length;i++){
                var cur = [path[i].lng,path[i].lat];
                curpath.push(cur)
            }
            var marker = this.GDMarker.getPosition()
            if(!this.GDPolygon.contains(this.GDMarker.getPosition())){
                 this.$message({
                    type: 'error',
                    message: '导航点不位于园区内!'
                });
                return
            }
            this.$ajax.updateSite({id:this.siteid,parameters:{electronicfencelist:JSON.stringify(curpath),lat:marker.lat,lon:marker.lng}}, res => {
                this.$message({
                    type: 'success',
                    message: '修改成功!'
                });
                this.showedit= false
                this.GDMarker.setDraggable(false)
                this.GDPolyEditor.close()
                this.getdetail()
            })
        },
        editcancle(){
            this.electronicfencelist = this.detail.electronicfencelist?JSON.parse(this.detail.electronicfencelist):[]
            this.y = this.detail.lat?this.detail.lat:this.GDMap.getCenter().lat
            this.x = this.detail.lon?this.detail.lon:this.GDMap.getCenter().lng
            if(this.electronicfencelist.length){
                this.GDPolygon.setPath(this.electronicfencelist);
                this.GDMarker.setPosition([this.x,this.y])
                this.GDMap.setFitView();
            }else{
                var curPath = [];
                var center = this.GDMap.getCenter(); //获取当前地图中心位置
                var x= center.lng
                var y = center.lat
                for (var i = 0; i < 3; i++) {
                    var cur = [];
                    switch (i) {
                        case 0:
                            cur.push(Number(x) - 0.01);
                            cur.push(Number(y)  - 0.01);
                            break;
                        case 1:
                            cur.push(Number(x) );
                            cur.push(Number(y)  + 0.01);
                            break;
                        case 2:
                            cur.push(Number(x)  + 0.01);
                            cur.push(Number(y)  - 0.01);
                            break;
                    }
                    curPath.push(cur);
                }
                this.GDPolygon.setPath(curPath);
                this.GDMap.setFitView();
            }
            this.showedit=false
            this.GDPolygon.show()
            this.GDPolyEditor.close()
            this.GDMarker.show()
            this.GDMarker.setDraggable(false)   
        }
	}
}
</script>
<style lang="scss" scoped>
    .mianbox{
        position: relative;
    }
    .box:nth-child(2){
        margin-top: 50px;
    }
	.box{
        width: 45%;
        border: 1px solid #d4d4d4;
        .p{
            background: #f5f5f5;
            .btnright{
                text-align: right;
            }
        }
        .el-row{
            height: 40px;
            line-height: 40px;
        }
        .el-col{
            text-indent: 2px;
        }
        .list{
            border-bottom: 1px solid #d4d4d4;
            span{
                color: #999;
            }
            .icon{
                height: 30px;
                margin: 5px;
            }
            .icon img{
                width: 30px;
            }
            .pic{
                position: relative;
                display: inline-block;
                height: 60px;
                width: 80px;
                margin-right: 10px;
                .close{
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    width: 20px;
                }
            }
            
        }
    }
    .boxr{
        width:52%;
        position: absolute;
        right: 0;
        top: 0;
        .map{
            height: 400px;
        }
    }
    .mapbox{
        top: 350px;
        height: 450px;
    }
</style>