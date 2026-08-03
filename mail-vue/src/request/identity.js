import http from '@/axios/index.js'

export function identityList(params) {
    return http.get('/identity/list', {params, noMsg: true})
}

export function identityStats() {
    return http.get('/identity/stats', {noMsg: true})
}

export function identityDetail(identityId) {
    return http.get('/identity/detail', {params: {identityId}, noMsg: true})
}

export function identityAdd(data) {
    return http.post('/identity/add', data, {noMsg: true})
}

export function identityUpdate(data) {
    return http.put('/identity/update', data, {noMsg: true})
}

export function identityDelete(identityId) {
    return http.delete('/identity/delete', {params: {identityId}, noMsg: true})
}

export function identitySetStatus(identityId, status) {
    return http.put('/identity/setStatus', {identityId, status}, {noMsg: true})
}

export function platformList(params) {
    return http.get('/platform/list', {params, noMsg: true})
}

export function platformAdd(data) {
    return http.post('/platform/add', data, {noMsg: true})
}

export function platformUpdate(data) {
    return http.put('/platform/update', data, {noMsg: true})
}
