import http from '@/axios/index.js'

export function websiteConfig() {
    return http.get('/setting/websiteConfig', {noMsg: true})
}

export function settingQuery() {
    return http.get('/setting/query')
}

export function settingSet(data) {
    return http.put('/setting/set', data)
}

export function setBackground(image) {
    return http.put('/setting/setBackground', image)
}

export function deleteBackground() {
    return http.delete('/setting/deleteBackground')
}
