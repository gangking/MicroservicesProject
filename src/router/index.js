import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/header-aside'
// import MultiSet from "@/views/platform/multi_set/index"
const meta = { requiresAuth: true }

Vue.use(VueRouter)
/**
 * 在主框架内显示
 */
const frameIn = [
    {
        path: '/',
        redirect: { name: 'home' },
        component: Layout,
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                meta: {
                    ...meta,
                    title: '首页'
                },
                component: () => import('@/pages/dashboard')
            },
            {
                path: '/home',
                name: 'home',
                meta: {
                    ...meta,
                    title: '多桌面'
                },
                component: () => import('@/views/platform/multi_desktop/index')
            },
            {
                path: '/myApps',
                name: 'myApps',
                meta: {
                    ...meta,
                    title: '工作台'
                },
                component: () => import('@/views/platform/notes/note')
            },
            // {
            //   path: '/multiSet',
            //   name: 'multiSet',
            //   meta: {
            //     ...meta,
            //     title: '新多桌面'
            //   },
            //   component: () => import('@/views/platform/multi_set/index')
            // },
            {
                path: 'query-builder',
                name: 'query-builder',
                meta: {
                    ...meta,
                    title: '规则条件'
                },
                component: () => import('@/views/demo/components/query-builder')
            },
            {
                path: 'd/:id(\\w+)',
                component: () => import('@/views/platform/data/dataTemplate/template-list'),
                name: 'dataTemplateList',
                meta: { title: '数据模版' }
            }
        ]
    }

]
/**
 * 在主框架之外显示
 */
const frameOut = [
    // 刷新页面
    {
        path: '/refresh',
        name: 'refresh',
        hidden: true,
        component: {
            beforeRouteEnter(to, from, next) {
                next(vm => vm.$router.replace(from.fullPath))
            },
            render: h => h()
        }
    },
    // 页面重定向
    {
        path: '/redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: {
            beforeRouteEnter(to, from, next) {
                next(vm => vm.$router.replace(JSON.parse(from.params.route)))
            },
            render: h => h()
        }
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('@/pages/login')
    },

    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册账号'
        },
        component: () => import('@/pages/register')
    },
    {
        path: '/forget',
        name: 'forget',
        meta: {
            title: '忘记密码'
        },
        component: () => import('@/pages/forget')
    },
    {
        path: '/systemSelect',
        name: 'systemSelect',
        meta: {
            title: '选择子系统'
        },
        component: () => import('@/pages/system')
    },
    {
        path: '/locking',
        name: 'locking',
        meta: {
            title: '锁屏'
        },
        component: () => import('@/pages/locking')
    },
    {
        path: '/404',
        name: 'error404',
        meta: {
            title: '404-页面不存在'
        },
        hidden: true,
        component: () => import('@/pages/error/404')
    },
    {
        path: '/401',
        name: 'error401',
        meta: {
            title: '401- 未授权'
        },
        hidden: true,
        component: () => import('@/pages/error/401')
    },
    {
        path: '/403',
        name: 'error403',
        meta: {
            title: '403-权限不足'
        },
        hidden: true,
        component: () => import('@/pages/error/403')
    },
    {
        path: '/Loading',
        name: 'Loading',
        meta: {
            title: ''
        },
        hidden: true,
        component: () => import('@/views/platform/loading')
    }
]

// 重新组织后导出
const constantRouterMap = [
    ...frameIn,
    ...frameOut
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

const createRouter = () => new VueRouter({
    // mode: 'history', // 后端支持可开 https://router.vuejs.org/zh/guide/essentials/history-mode.html
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

const router = createRouter()

/**
 * 重置Router
 */
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
