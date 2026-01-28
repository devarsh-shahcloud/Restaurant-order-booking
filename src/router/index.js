import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/menu'
        },
        {
            path: '/menu',
            name: 'menu',
            component: () => import('@/views/MenuView.vue'),
            meta: { title: 'Menu - Restaurant Order Booking' },
            children: [
                {
                    path: '',
                    name: 'menu-all',
                    component: () => import('@/views/CategoryView.vue'),
                    meta: { title: 'Menu - Restaurant Order Booking' }
                },
                {
                    path: ':category',
                    name: 'category',
                    component: () => import('@/views/CategoryView.vue'),
                    meta: { title: 'Category - Restaurant Order Booking' }
                }
            ]
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/CartView.vue'),
            meta: { title: 'Cart - Restaurant Order Booking' }
        },
        {
            path: '/checkout',
            name: 'checkout',
            component: () => import('@/views/CheckoutView.vue'),
            meta: { title: 'Checkout - Restaurant Order Booking' }
        },
        {
            path: '/order-confirmation/:orderId',
            name: 'order-confirmation',
            component: () => import('@/views/OrderConfirmationView.vue'),
            meta: { title: 'Order Confirmation - Restaurant Order Booking' }
        },
        {
            path: '/orders',
            name: 'orders',
            component: () => import('@/views/OrderHistoryView.vue'),
            meta: { title: 'Order History - Restaurant Order Booking' }
        },
        {
            path: '/orders/:orderId',
            name: 'order-detail',
            component: () => import('@/views/OrderDetailView.vue'),
            meta: { title: 'Order Detail - Restaurant Order Booking' }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/NotFoundView.vue'),
            meta: { title: '404 Not Found - Restaurant Order Booking' }
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0, behavior: 'smooth' }
        }
    }
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Restaurant Order Booking'
    next()
})

export default router
