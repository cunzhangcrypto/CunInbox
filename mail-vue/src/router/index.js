import {createRouter, createWebHistory} from 'vue-router'
import NProgress from 'nprogress';
import {useUiStore} from "@/store/ui.js";
import {useSettingStore} from "@/store/setting.js";
import {cvtR2Url} from "@/utils/convert.js";

const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: '/dashboard',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: 'dashboard',
                    name: 'dashboard',
                    menu: true
                }
            },
            {
                path: '/inbox',
                name: 'email',
                component: () => import('@/views/email/index.vue'),
                meta: {
                    title: 'inbox',
                    name: 'email',
                    menu: true
                }
            },
            {
                path: '/identity',
                name: 'identity',
                component: () => import('@/views/identity/index.vue'),
                meta: {
                    title: 'identityCenter',
                    name: 'identity',
                    menu: true
                }
            },
            {
                path: '/assistant',
                name: 'assistant',
                component: () => import('@/views/assistant/index.vue'),
                meta: {
                    title: 'aiAssistant',
                    name: 'assistant',
                    menu: true
                }
            },
            {
                path: '/security',
                name: 'security',
                component: () => import('@/views/security/index.vue'),
                meta: {
                    title: 'securityCenter',
                    name: 'security',
                    menu: true
                }
            },
            {
                path: '/message',
                name: 'content',
                component: () => import('@/views/content/index.vue'),
                meta: {
                    title: 'message',
                    name: 'content',
                    menu: false
                }
            },
            {
                path: '/settings',
                name: 'setting',
                component: () => import('@/views/setting/index.vue'),
                meta: {
                    title: 'settings',
                    name: 'setting',
                    menu: true
                }
            },
            {
                path: '/starred',
                name: 'star',
                component: () => import('@/views/star/index.vue'),
                meta: {
                    title: 'starred',
                    name: 'star',
                    menu: true
                }
            },
        ]

    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue')
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

NProgress.configure({
    showSpinner: false,   // 不显示旋转图标
    trickleSpeed: 50,    // 自动递增速度
    minimum: 0.1          // 最小百分比
});

let timer
let first = true

router.beforeEach((to, from, next) => {

    if (timer) {
        clearTimeout(timer)
    }

    timer = setTimeout(() => {
        NProgress.start()
    }, first ? 200 : 100)

    const token = localStorage.getItem('token')
    const isDemoBuild = import.meta.env.VITE_DEMO_MODE === 'true'

    if (!token && to.name !== 'login') {
        return next({name: 'login'})
    }

    if (!token && to.name === 'login') {
        loadBackground(next)
        return
    }

    if (token && to.name === 'login') {
        // 演示构建：已自动登录，直接进入 dashboard
        return next(isDemoBuild ? {name: 'dashboard'} : from.path)
    }

    next()

})

function loadBackground(next) {

    const settingStore = useSettingStore();

    if (settingStore.settings.background) {

        const src = cvtR2Url(settingStore.settings.background);

        const img = new Image();
        img.src = src;

        img.onload = () => {
            next()
        };

        img.onerror = () => {
            console.warn("背景图片加载失败:", img.src);
            next()
        };

        setTimeout(() => {
            console.warn("背景加载超时，已放行");
            next()
        }, 3000)

    } else {
        next()
    }

}

router.afterEach((to) => {

    clearTimeout(timer)
    NProgress.done();

    const uiStore = useUiStore()
    if (to.meta.menu) {
        if (['content', 'email', 'send'].includes(to.meta.name)) {
            uiStore.accountShow = window.innerWidth > 767;
        } else {
            uiStore.accountShow = false
        }
    }

    if (window.innerWidth < 1025) {
        uiStore.asideShow = false
    }

    first = false
})

export default router
