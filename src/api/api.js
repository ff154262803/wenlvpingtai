import axios from './axios';
import {Message} from 'element-ui'
import router from '../routes'

let base = 'http://39.107.112.17:5000/api'; // 8091
export default {
    POST(url, data, callback) {
        data.ver = '1.0';
        if(!data.uid)data.uid = sessionStorage.uid;
        data.uKey = sessionStorage.uKey;
        axios.post(url, data)
          .then(res => {
              this.ajaxNext(res.data, callback);
          });
    },
    GET(url, data, callback) {
        axios.get(url, data)
          .then(res => {
              this.ajaxNext(res.data, callback);
          })
    },
    ajaxNext(data, callback) {
        switch (data.resb) {
            case 200:
                callback(data);
                break;
            case 301:
                Message.error(data.resbInfo);
                router.push('login')
                break;
            default :
                Message.error(data.resbInfo);
                break;
        }
    },
    //登录
    login(data,callback){
        this.POST(`${base}/manage/login`, data,callback);
    },
    //登出
    loginOut(data,callback){
        this.POST(`${base}/manage/loginOut`, data,callback);
    },
    //新增平台用户
    addManageUser(data,callback){
        this.POST(`${base}/manage/addManageUser`, data,callback);
    },
    //获取平台用户列表
    queryManageUserList(data,callback){
        this.POST(`${base}/manage/queryManageUserList`, data,callback);
    },
    //删除平台用户
    deleteManageUser(data,callback){
        this.POST(`${base}/manage/deleteManageUser`, data,callback);
    },
    //设置平台用户可用状态
    setManageUserEnableState(data,callback){
        this.POST(`${base}/manage/setManageUserEnableState`, data,callback);
    },
    //修改平台用户
    updateManageUser(data,callback){
        this.POST(`${base}/manage/updateManageUser`, data,callback);
    },
    //获取版本信息
    getAppVersion(data,callback){
        this.POST(`${base}/manage/getAppVersion`, data,callback);
    },
    //发布新版本
    addAppUpdate(data,callback){
        this.POST(`${base}/manage/addAppUpdate`, data,callback);
    },
    //获取服务器状态
    getServerStatus(data, callback) {
        this.POST(`${base}/manage/getServerStatus`, data, callback);
    },
    //修改服务器状态
    updateServerStatus(data, callback) {
        this.POST(`${base}/manage/updateServerStatus`, data, callback);
    },

}
