import { RouteRecordRaw } from 'vue-router'

const routeBc: RouteRecordRaw = {
    path: '/bc',
    meta: {
        group: 'BC',
        title: 'app components',
    },
    children: [
        {
            path: 'adc-directives',
            component: () =>
                import('@/ABC/pages/directives/doc_adc_directives.vue'),
        },
    ],
}

const routes: Array<RouteRecordRaw> = []
routes.push(routeBc)
export default routes
