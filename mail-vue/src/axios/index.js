import axios, {getAdapter} from "axios";
import router from "@/router";
import i18n from "@/i18n/index.js";
import {useSettingStore} from "@/store/setting.js";
import {ElMessage} from "element-plus";
import {handleDemoRequest} from "@/demo/index.js";

function isDemoMode() {
    // 演示构建（build:demo）：始终为演示模式，不依赖 localStorage
    if (import.meta.env.VITE_DEMO_MODE === 'true') return true;
    return localStorage.getItem('cuninbox_demo') === '1';
}

// 自定义 adapter：演示模式下走 demo 控制器，不发网络请求
// demo 返回 {code:200, data, message} 标准格式，由响应拦截器统一处理
function demoAdapter(config) {
    return handleDemoRequest(config).then(payload => {
        return {
            data: payload,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
            request: {}
        };
    }).catch(demoError => {
        const error = new Error(demoError.message || 'Demo error');
        error.code = demoError.code || 'DEMO_ERROR';
        error.config = config;
        return Promise.reject(error);
    });
}

// axios v1.x 的 defaults.adapter 是 ['xhr','http'] 数组而非函数，需用 getAdapter 转换
const defaultAdapter = getAdapter(['xhr', 'http']);

let http = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 8000,
    adapter: config => {
        // 演示模式：使用自定义 adapter
        if (isDemoMode()) {
            return demoAdapter(config);
        }
        // 正常模式：使用默认 adapter
        return defaultAdapter(config);
    }
});

http.interceptors.request.use(config => {
    const { lang } = useSettingStore();
    config.headers.Authorization = `${localStorage.getItem('token')}`
    config.headers['accept-language'] = lang
    return config
})

http.interceptors.response.use((res) => {
        // demo 模式与正常模式统一走此逻辑
        // demo adapter 返回的 res.data 已是 {code:200, data, message} 标准格式
        return new Promise((resolve, reject) => {

            const noMsg = res.config.noMsg;
            const data = res.data

            if (noMsg) {

                data.code === 200 ? resolve(data.data) : reject(data)

            } else if (data.code === 401) {
                ElMessage({
                    message: data.message,
                    type: 'error',
                    plain: true,
                    grouping: true,
                    repeatNum: -4,
                })
                localStorage.removeItem('token')
                router.replace('/login')
                reject(data)
            } else if (data.code === 403) {
                ElMessage({
                    message: data.message,
                    type: 'warning',
                    plain: true,
                    grouping: true,
                    repeatNum: -4,
                })
                reject(data)

            } else if (data.code === 502) {
                ElMessage({
                    dangerouslyUseHTMLString: true,
                    message: data.message,
                    type: 'error',
                    plain: true,
                    grouping: true,
                    repeatNum: -4,
                })
                reject(data)
            } else if (data.code !== 200) {
                ElMessage({
                    message: data.message,
                    type: 'error',
                    plain: true,
                    grouping: true,
                    repeatNum: -4,
                })
                reject(data)
            }
            resolve(data.data)
        })
    },
    (error) => {

        // 演示模式：DEMO_LOCK 表示该功能在演示版中不可用
        if (error.code === 'DEMO_LOCK') {
            ElMessage.warning(error.message || '此为演示版本，该功能请正式部署后使用')
            return Promise.reject(error)
        }

        if (error.status === 403) {
            location.reload();
            return;
        }

        const isDemo = isDemoMode();
        const noMsg = error.config?.noMsg;

        if (noMsg || isDemo) {
            return Promise.reject(error)
        } else if (error.message?.includes('Network Error')) {
            ElMessage({
                message: i18n.global.t('networkErrorMsg'),
                type: 'error',
                plain: true,
                grouping: true,
                repeatNum: -4,
            })
        } else if (error.code === 'ECONNABORTED') {
            ElMessage({
                message: i18n.global.t('timeoutErrorMsg'),
                type: 'error',
                plain: true,
                grouping: true
            })
            ElMessage.error('')
        } else if (error.response) {
            ElMessage({
                message: i18n.global.t('serverBusyErrorMsg'),
                type: 'error',
                plain: true,
                grouping: true,
                repeatNum: -4,
            })
        } else {
            ElMessage({
                message: i18n.global.t('reqFailErrorMsg'),
                type: 'error',
                plain: true,
                grouping: true,
                repeatNum: -4,
            })
        }
        return Promise.reject(error)
    })

export default http
