/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/dashboard',
      },
      {
        path: '/admin/dashboard',
        name: 'dashboard',
        component: './admin',
      },
      {
        path: '/admin/content',
        name: 'content',
        component: './admin/content',
      },
      {
        path: '/admin/content/create',
        name: 'content-create',
        component: './admin/content/edit',
        hideInMenu: true,
      },
      {
        path: '/admin/content/edit/:id',
        name: 'content-edit',
        component: './admin/content/edit',
        hideInMenu: true,
      },
      {
        path: '/admin/tag',
        name: 'tag',
        component: './admin/tag',
      },
      {
        path: '/admin/comment',
        name: 'comment',
        component: './admin/comment',
      },
      {
        path: '/admin/menu',
        name: 'menu',
        component: './admin/menu',
      },
      {
        path: '/admin/resources',
        name: 'resources',
        component: './admin/resources',
      },
      {
        path: '/admin/resources/upload',
        name: 'resources-upload',
        component: './admin/resources/upload',
        hideInMenu: true,
      },
      {
        path: '/admin/resources/detail/:id',
        name: 'resources-detail',
        component: './admin/resources/detail',
        hideInMenu: true,
      },
      {
        path: '/admin/plugin',
        name: 'plugin',
        component: './admin/plugin',
      },
      {
        path: '/admin/settings',
        name: 'settings',
        component: './admin/settings',
        routes: [
          {
            path: '/admin/settings',
            redirect: '/admin/settings/profile',
          },
          {
            path: '/admin/settings/profile',
            name: 'profile',
            component: './admin/settings/profile',
          },
          {
            path: '/admin/settings/site',
            name: 'site',
            component: './admin/settings/site',
          },
          {
            path: '/admin/settings/backup',
            name: 'backup',
            component: './admin/settings/backup',
          },
        ],
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'stop',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'warning',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'bug',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    path: '/',
    redirect: '/admin',
  },
  {
    component: './exception/404',
    path: '/*',
  },
];
