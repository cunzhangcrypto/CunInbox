import http from '@/axios/index.js'

export function securityList(params) {
    return http.get('/security/list', {params, noMsg: true})
}

export function securityStats() {
    return http.get('/security/stats', {noMsg: true})
}

export function securitySetStatus(eventId, status) {
    return http.put('/security/setStatus', {eventId, status}, {noMsg: true})
}
