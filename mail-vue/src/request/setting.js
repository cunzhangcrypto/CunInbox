import http from '@/axios/index.js'

export function websiteConfig() {
    return http.get('/setting/websiteConfig', {noMsg: true})
}

export function settingQuery() {
    return http.get('/sys-setting/query')
}

export function settingSet(data) {
    return http.post('/sys-setting/set', data)
}

export function setBackground(image) {
    return http.post('/sys-setting/setBackground', image)
}

export function deleteBackground() {
    return http.post('/sys-setting/deleteBackground')
}
