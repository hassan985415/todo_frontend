import Vue from 'vue'
import VueRouter from 'vue-router'
import Todo from '../views/Todo.vue'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import auth from '../middleware/auth'
Vue.use(VueRouter)


const routes = [{
        path: '/login',
        name: 'Login',

        component: Login
    },
    {
        path: '/register',
        name: 'Register',

        component: Register
    },
    {
        path: '/',
        name: 'Dashboard',

        component: Dashboard
    },
    {
        path: '/todo',
        name: 'Todo',
        meta: {
            middleware: auth,
        },

        component: Todo
    }
]



const router = new VueRouter({
    mode: 'history',
    routes
})

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;
    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware });
    };
}
router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware) ?
            to.meta.middleware : [to.meta.middleware];

        const context = {
            from,
            next,
            router,
            to,
        };
        const nextMiddleware = nextFactory(context, middleware, 1);

        return middleware[0]({...context, next: nextMiddleware });
    }

    return next();
});
export default router