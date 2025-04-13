import { lazy } from 'react';

export const routes = [
  {
    path: "/",
    component: lazy(() => import("./components/pages/landing")),
  },
  {
    path: "/login",
    component: lazy(() => import("./components/pages/login")),
  },
  {
    path: "/register",
    component: lazy(() => import("./components/pages/register")),
  },
  {
    path: "/home",
    component: lazy(() => import("./components/pages/home")),
    layout: lazy(() => import("./components/templates/platformlayout"))
  },
  {
    path: "/dashboard",
    component: lazy(() => import("./components/pages/dashboard")),
    layout: lazy(() => import("./components/templates/platformlayout"))
  },
  {
    path: "/myprojects",
    component: lazy(() => import("./components/pages/projects")),
    layout: lazy(() => import("./components/templates/platformlayout"))
  },
  {
    path: "/governance",
    component: lazy(() => import("./components/pages/governance")),
    layout: lazy(() => import("./components/templates/platformlayout"))
  },
];
