### 

* npm create vue@latest

### sass

### svg雪碧图

在之前的webpack项目中，使用svg-sprite-loader来实现svg的雪碧图，他在vite的替代方案有：

* vite-svg-loader svg当模块导入,非svg雪碧图方案
* vite-plugin-svg-icons 不再更新，安装后也有一些警告,[持续关注](https://github.com/vbenjs/vite-plugin-svg-icons/issues/107)
* vite-plugin-svg-spritemap
* @spiriit/vite-plugin-svg-spritemap 

[综合对比后2个方案](https://npmpackage.info/)后，选择了`@spiriit/vite-plugin-svg-spritemap`，它文档完整，下载量更多，发布版本多。它的[文档](https://spiriitlabs.github.io/vite-plugin-svg-spritemap/)

### 数据模拟方案：msw+faker

mockjs已经不再维护了，替代方案如下：
* [faker-js](https://github.com/faker-js/faker) 生成数据
* [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) API请求模拟库
* [msw](https://mswjs.io/) API请求模拟库

msw在本地执行`npx msw init ./mack --save`命令，生成mockServiceWorker.js[Managing the worker](https://mswjs.io/docs/best-practices/managing-the-worker/)
在浏览器中设置msw[Browser integration](https://mswjs.io/docs/integrations/browser)

之后更新了msw后，会自动生成mockServiceWorker.js


