import {useUserStore} from "@/store/user.js";
import {useSettingStore} from "@/store/setting.js";
import {useAccountStore} from "@/store/account.js";
import {loginUserInfo} from "@/request/my.js";
import {permsToRouter} from "@/perm/perm.js";
import router from "@/router";
import {websiteConfig} from "@/request/setting.js";
import i18n from "@/i18n/index.js";

const DEFAULT_SETTING = {
    title: 'CunInbox',
    domainList: [],
    websiteReg: true,
    projectLink: true,
    loginDomain: '',
    bgList: [],
    noticeTitle: 'CunInbox',
    noticeContent: '',
    noticePopup: 0,
    loginNotice: 0,
    register: 0,
    receive: 0,
    manyEmail: 0,
    addEmail: 0,
    autoRefresh: 0,
    addEmailVerify: 1,
    registerVerify: 1,
    regVerifyCount: 1,
    addVerifyCount: 1,
    send: 1,
    r2Domain: '',
    secretKey: '',
    siteKey: '',
    regKey: 1,
    background: '',
    tgBotToken: '',
    tgChatId: '',
    tgBotStatus: 1,
    forwardEmail: '',
    forwardStatus: 1,
    ruleEmail: '',
    ruleType: 0,
    loginOpacity: 0.88,
    resendTokens: '{}',
    noticeType: '',
    noticeDuration: 0,
    noticePosition: '',
    noticeOffset: 0,
    noticeWidth: 400,
    notice: 0,
    noRecipient: 1,
    bucket: '',
    region: '',
    endpoint: '',
    s3AccessKey: '',
    s3SecretKey: '',
    forcePathStyle: 1,
    customDomain: '',
    tgMsgFrom: 'only-name',
    tgMsgTo: 'show',
    tgMsgText: 'hide',
    minEmailPrefix: 0,
    emailPrefixFilter: '',
    aiProvider: 0,
    aiApiKey: '',
    aiBaseUrl: 'https://api.deepseek.com',
    aiModel: 'deepseek-chat',
    aiAnalysisStatus: 1,
    aiFallbackStatus: 0,
    aiFallbackApiKey: '',
    aiFallbackBaseUrl: 'https://api.deepseek.com',
    aiFallbackModel: 'deepseek-chat',
    linuxdoSwitch: 0,
    linuxdoClientId: '',
    linuxdoCallbackUrl: '',
    linuxdoClientSecret: '',
    regVerifyOpen: false,
};

export async function init() {
    document.title = '\u200B';

    const settingStore = useSettingStore();
    const userStore = useUserStore();
    const accountStore = useAccountStore();

    // 演示构建（build:demo）：自动写入演示 token，无需用户手动登录
    // isDemoMode() 已会识别此标志，后续所有请求走 demo adapter 返回 mock 数据
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
        localStorage.setItem('cuninbox_demo', '1');
        if (!localStorage.getItem('token')) {
            localStorage.setItem('token', 'demo-build-' + Date.now());
        }
    }

    const token = localStorage.getItem('token');
    if (!settingStore.lang) {
        let lang = navigator.language.split('-')[0];
        lang = lang === 'zh' ? lang : 'en';
        settingStore.lang = lang;
    }

    i18n.global.locale.value = settingStore.lang;

    let setting = DEFAULT_SETTING;

    try {
        if (token) {
            const userPromise = loginUserInfo().catch(e => {
                console.error(e);
                return null;
            });
            const settingPromise = websiteConfig().catch(e => {
                console.error(e);
                return DEFAULT_SETTING;
            });

            const [s, user] = await Promise.all([settingPromise, userPromise]);
            setting = s || DEFAULT_SETTING;
            settingStore.settings = setting;
            settingStore.domainList = setting.domainList || [];
            document.title = setting.title || 'CunInbox';

            if (user) {
                accountStore.currentAccountId = user.account.accountId;
                accountStore.currentAccount = user.account;
                userStore.user = user;

                const routers = permsToRouter(user.permKeys);
                routers.forEach(routerData => {
                    router.addRoute('layout', routerData);
                });
            } else if (localStorage.getItem('cuninbox_demo') === '1') {
                // 演示模式：后端不可用时用 mock 用户信息
                const mockUser = {
                    account: { accountId: 10001, account: 'demo@cuninbox.ai', nickname: '演示用户', avatar: '', createTime: Date.now(), allReceive: 0 },
                    user: { userId: 1, username: 'demo', email: 'demo@cuninbox.ai', name: '演示用户',
                            role: { name: 'USER', id: 1, sendType: 'day', sendCount: 50, accountCount: 5 } },
                    permKeys: ['email:query', 'email:send', 'identity:query', 'assistant:use', 'security:query',
                               'setting:update', 'star:query', 'draft:query'],
                    menus: []
                };
                accountStore.currentAccountId = mockUser.account.accountId;
                accountStore.currentAccount = mockUser.account;
                userStore.user = mockUser;
                try {
                    const routers = permsToRouter(mockUser.permKeys);
                    routers.forEach(routerData => {
                        router.addRoute('layout', routerData);
                    });
                } catch (e) {}
            }
        } else {
            // 无 token 时直接用默认配置，不发请求（避免后端不可用时的 TCP 连接延迟）
            setting = DEFAULT_SETTING;
            settingStore.settings = setting;
            settingStore.domainList = [];
            document.title = setting.title || 'CunInbox';
        }
    } catch (e) {
        console.error('init error:', e);
        settingStore.settings = DEFAULT_SETTING;
        settingStore.domainList = [];
        document.title = DEFAULT_SETTING.title;
    }

    removeLoading();
}

function removeLoading() {
    if (window.innerWidth < 1025) {
        document.documentElement.style.setProperty('--loading-hide-transition', 'none')
    }
    const doc = document.getElementById('loading-first');
    doc.classList.add('loading-hide')
    setTimeout(() => {
        doc.remove()
    },1000)
}

