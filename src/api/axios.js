import axios from 'axios'
import { Message } from 'element-ui'
import Router from '@/routes'

// axios 配置
axios.defaults.timeout = 8000

// http 响应拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.log(error)
        Message.error(error.resbInfo)
        // Router.push('/404')
    }
)

export default axios
