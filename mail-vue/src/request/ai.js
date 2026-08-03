import http from '@/axios/index.js'

export function aiStatus() {
    return http.get('/ai/status', {noMsg: true})
}

export function aiAnalysisList(params) {
    return http.get('/ai/analysis/list', {params, noMsg: true})
}

export function aiNewIdentityList() {
    return http.get('/ai/analysis/newIdentity', {noMsg: true})
}

export function aiConfirmIdentity(data) {
    return http.post('/ai/analysis/confirmIdentity', data, {noMsg: true})
}

export function aiAnalysisBatch() {
    return http.post('/ai/analysis/batch', {}, {noMsg: true})
}

export function aiAnalysisStats() {
    return http.get('/ai/analysis/stats', {noMsg: true})
}

export function aiDigestList(params) {
    return http.get('/ai/digest/list', {params, noMsg: true})
}

export function aiDigestGenerate(date) {
    return http.post('/ai/digest/generate', {}, {params: {date}, noMsg: true})
}

export function aiChat(message, context) {
    return http.post('/ai/chat', {message, context}, {noMsg: true})
}
