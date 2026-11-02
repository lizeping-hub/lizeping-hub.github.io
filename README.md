# 励泽坪 · AI 产品经理

个人网站，采用 HTML、CSS 和 JavaScript 构建，支持桌面与手机浏览。

网站地址：https://lizeping-hub.github.io/

## 内容维护

- `index.html`：个人介绍、关注方向、作品和联系方式。
- `style.css`：视觉样式与移动端适配。
- `main.js`：导航状态交互。
- `.nojekyll`：让 GitHub Pages 直接发布静态文件。
- `assets/golden-coast.jpg`：AI 生成的海岸氛围摄影；来源与提示词见 [素材说明](assets/README.md)。

界面采用暖纸色画布、酒红主按钮、淡紫选中态与摄影叠层。产品视角支持选项卡和键盘切换，手机端使用可展开的导航。

项目案例和联系方式目前标为待补充，可直接编辑 `index.html`。

## 本地预览

在仓库目录执行：

```sh
python3 -m http.server 4173
```

打开 http://localhost:4173 。

## 更新网站

GitHub Pages 使用 `main` 分支的根目录发布。在修改后执行：

```sh
git add index.html style.css main.js assets
git commit -m "Update personal website"
git push origin main
```

也可以在 GitHub 仓库中直接编辑文件并提交。推送后在仓库的 Actions 或 Settings → Pages 中查看发布状态。

此目录是 GitHub Pages 的维护源。原 Sites 版本保留在相邻的 `li-zeping-portfolio` 目录中，两份部署独立更新。
