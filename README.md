# Ypan云盘

## 项目概述

Ypan云盘是一个基于Vue.js框架开发的Web应用程序，旨在为用户提供文件和图片的存储、管理和共享功能。用户可以通过该应用上传、删除文件，进行文件夹管理，并且可以在需要时共享文件给其他用户。

## 技术栈

- **Vue.js**
  - Vue.js是一款流行的JavaScript前端框架，用于构建用户界面和单页面应用程序（SPA）。
- **Vue Router**
  - Vue Router是Vue.js官方的路由管理器，用于管理应用程序的路由和导航。
- **Axios**
  - Axios是一个基于Promise的HTTP客户端，用于在浏览器和Node.js中进行HTTP通信。
- **Element Plus**
  - Element Plus是一套基于Vue 3.0的桌面端UI组件库，提供了一系列优雅的UI组件，可帮助快速构建用户界面。
- **@element-plus/icons-vue**
  - Element Plus的图标组件，用于展示各种图标以丰富界面。
- **@vant/touch-emulator**
  - Vant是一个移动端UI组件库，该库中的`@vant/touch-emulator`用于在非触摸屏设备上模拟触摸事件，以便测试和开发。
- **js-md5**
  - js-md5是一个用于生成MD5摘要的JavaScript库，通常用于加密和数据完整性验证。
- **Vue Axios**
  - Vue Axios是Vue.js官方推荐的Axios的Vue插件，用于在Vue应用中使用Axios进行HTTP请求。

## **相关界面**

1. **加载界面**

   ![](https://github.com/zfj9920/Ypan-/blob/main/image/loading.png)

2. **登录界面**

   ![](https://github.com/zfj9920/Ypan-/blob/main/image/login.png)

3. **主页界面**

   ![](https://github.com/zfj9920/Ypan-/blob/main/image/home.png)

4. **回收站界面**

   ![](https://github.com/zfj9920/Ypan-/blob/main/image/huishou.png)

5. **上传列表界面**

   ![](https://github.com/zfj9920/Ypan-/blob/main/image/upload.png)



## 使用方法

1. **安装依赖**

   执行以下命令安装项目所需的依赖：

   ```bash
   npm install
   ```

2. **启动开发服务器**

   执行以下命令启动开发服务器：

   ```bash
   npm run serve
   ```

   服务器将在本地启动，并在控制台中输出访问地址。

3. **构建项目**

   执行以下命令构建项目：

   ```bash
   npm run build
   ```

   构建完成后，将在`dist`目录下生成可部署的静态文件。

4. **运行单元测试**

   执行以下命令运行单元测试：

   ```bash
   npm run test
   ```

   单元测试将会运行，并在控制台中输出测试结果。

## 注意事项

- 请确保正确配置`vue-router`以便实现页面路由导航。
- 在使用Element Plus和Vant组件时，请参考官方文档以了解各组件的使用方法和属性。
- 在使用Axios进行HTTP请求时，请确保正确配置请求拦截器和响应拦截器，以处理请求和响应的相关逻辑。

以上是项目的技术栈以及基本的使用方法和注意事项，如有问题或需求，欢迎随时联系项目负责人。
