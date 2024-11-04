export default [
    {
        path: '/:cid/syncfusion',
        name: 'Syncfusion',
        meta: {
            title: "Syncfusion",
            requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "project" */ '@/views/Syncfusion/SyncfusionComponent.vue'),
    }
]