import axios from './axios';
import {Message} from 'element-ui'
import router from '../routes'

let base = 'http://39.107.112.17:5000/api'; // 8091
export default {
    POST(url, data, callback, errback) {
        var storage = JSON.parse(sessionStorage.getItem('user'));
        data.ver = '1.0';
        if (storage) {
            if (!data.uid) data.uid = storage.uid;
            data.uKey = storage.uKey;
        }
        axios.post(url, data)
          .then(res => {
              this.ajaxNext(res.data, callback, errback);
          });
    },
    GET(url, data, callback, errback) {
        axios.get(url, data)
          .then(res => {
              this.ajaxNext(res.data, callback, errback);
          })
    },
    ajaxNext(data, callback, errback) {
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
                errback && errback();
                break;
        }
    },
    //登录
    login(data, callback, errback) {
        this.POST(`${base}/manage/login`, data, callback, errback);
    },
    //登出
    loginOut(data, callback, errback) {
        this.POST(`${base}/manage/loginOut`, data, callback, errback);
    },
    //新增平台用户
    addManageUser(data, callback, errback) {
        this.POST(`${base}/manage/addManageUser`, data, callback, errback);
    },
    //获取平台用户列表
    queryManageUserList(data, callback, errback) {
        this.POST(`${base}/manage/queryManageUserList`, data, callback, errback);
    },
    //删除平台用户
    deleteManageUser(data, callback, errback) {
        this.POST(`${base}/manage/deleteManageUser`, data, callback, errback);
    },
    //设置平台用户可用状态
    setManageUserEnableState(data, callback, errback) {
        this.POST(`${base}/manage/setManageUserEnableState`, data, callback, errback);
    },
    //修改平台用户
    updateManageUser(data, callback, errback) {
        this.POST(`${base}/manage/updateManageUser`, data, callback, errback);
    },
    //获取版本信息
    getAppVersion(data, callback, errback) {
        this.POST(`${base}/manage/getAppVersion`, data, callback, errback);
    },
    //发布新版本
    addAppUpdate(data, callback, errback) {
        this.POST(`${base}/manage/addAppUpdate`, data, callback, errback);
    },
    //获取服务器状态
    getServerStatus(data, callback, errback) {
        this.POST(`${base}/manage/getServerStatus`, data, callback, errback);
    },
    //修改服务器状态
    updateServerStatus(data, callback, errback) {
        this.POST(`${base}/manage/updateServerStatus`, data, callback, errback);
    },
    //查询园区列表
      queryParkList(data, callback) {
        this.POST(`${base}/manage/queryParkList`, data, callback);
    },
    //批量删除园区
    deletePark(data, callback) {
        this.POST(`${base}/manage/deletePark`, data, callback);
    },
    //获取园区类型
    getParkTypeList(data, callback) {
        this.POST(`${base}/manage/getParkTypeList`, data, callback);
    },
    //获取含有园区的省市
    getParkAreaList(data, callback) {
        this.POST(`${base}/manage/getParkAreaList`, data, callback);
    },
    //新增园区
    addPark(data, callback) {
        this.POST(`${base}/manage/addPark`, data, callback);
    },

}
