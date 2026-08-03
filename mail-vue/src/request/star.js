import http from "@/axios/index.js";

export function starAdd(emailId) {
    return http.post('/star/add', {emailId}, {noMsg: true})
}

export function starCancel(emailId) {
    return http.delete('/star/cancel', {params: {emailId}, noMsg: true})
}

export function starList(emailId, size) {
    return http.get('/star/list', {params: {emailId, size}, noMsg: true})
}
