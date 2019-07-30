import axios from './axios';
import {Message} from 'element-ui'

let base = 'http://manager.zkshiwei.com/home-manage/api'; // 8091
export default {
    POST(url, data, callback) {
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
        switch (data.Resb) {
            case 200:
                callback(data);
                break;
            default :
                Message.error(data.RsbInfo);
                break;
        }
    },
    requestLogin(data,callback){
        this.POST(`${base}/manage/user/login`, data,callback);
    },
}