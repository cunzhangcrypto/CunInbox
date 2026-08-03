import http from '@/axios/index.js';

export function loginUserInfo() {
    return http.get('/my/loginUserInfo', {noMsg: true})
}

export function resetPassword(password) {
    return http.put('/my/resetPassword', {password})
}

export function userDelete() {
    return http.delete('/my/delete')
}

