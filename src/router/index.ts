/*
 * @Author: maple_jy
 * @Date: 2023-09-03 20:21:11
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import axios from "axios";
import { ElMessage } from "element-plus";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    redirect: "/allFolderView",
    component: () => import("../views/HomeView.vue"),
    children: [
      {
        path: "/allFolderView",
        name: "AllFolderView",
        component: () => import("../views/AllFolderView.vue"),
      },
      {
        path: "/imgView",
        name: "ImgView",
        component: () => import("../views/ImgView.vue"),
      },
      {
        path: "/fileView",
        name: "FileView",
        component: () => import("../views/FileView.vue"),
      },
      {
        path: "/otherView",
        name: "OtherView",
        component: () => import("../views/OtherView.vue"),
      },
      {
        path: "/recycleView",
        name: "RecycleView",
        component: () => import("../views/RecycleView.vue"),
      },
    ],
  },

  // 加载页
  {
    path: "/loading",
    name: "LoadingPage",
    component: () => import("../views/LoadingPage.vue"),
    beforeEnter: (to, from) => {
      if (from.name == "Login") {
        return { path: "/login" };
      } else if (sessionStorage.getItem("loading")) {
        // 刷新加载路径的判断
        // console.log(from.path);
        // if (
        //   from.path === "/" &&
        //   !(localStorage.getItem("token") || sessionStorage.getItem("token"))
        // ) {
        //   return { path: "/login" };
        // }

        return { path: from.path };
      }

      // 第一次进入实现加载的判断
      sessionStorage.setItem("loading", "true");

      return true;
    },
  },

  // 登录页
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },

  // 购买页
  {
    path: "/buy",
    name: "Payment",
    component: () => import("../views/PaymentPage.vue"),
  },

  // 测试页
  {
    path: "/example",
    name: "Example",
    component: () => import("../views/Example.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const black = ["/loading", "/login"];

// 全局路由守卫检测是否登录，是则刷新，否则进入加载页
// router.beforeEach((to, from) => {
//   // 查看token
//   // console.log(localStorage.getItem("token"));
//   let isToken =
//     localStorage.getItem("token") || sessionStorage.getItem("token");

//   let data = JSON.parse(localStorage.getItem("auto") as string);

//   if (!isToken && black.indexOf(to.path) === -1) {
//     return { path: "/loading" };
  
//   } else {
//     console.log(1);

//     return true;
//   }
// });

export default router;
