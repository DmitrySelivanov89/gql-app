import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "SignIn",
        component: () => import("../views/SingIn")
    },
    {
        path: "*",
        name: "PageIsNotFound",
        component: () => import("../views/PageIsNotFound.vue")
    },
    {
        path: "/Dashboard",
        name: "Dashboard",
        component: () => import("../views/Dashboard.vue")
    },
    {
        path: "/SignUp",
        name: "SignUp",
        component: () => import("../views/SignUp")
    },
    {
        path: "/Members",
        name: "Members",
        component: () => import("../views/Members")
    }
];

const router = new VueRouter({
    routes,
});

export default router;
