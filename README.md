# 励泽坪 · AI 产品经理个人作品集

网站：https://lizeping-hub.github.io/

深黑与蓝色主题，采用桌面工作台布局：关于我、个人项目、工具与技能、文章、联系我。桌面端保留左侧目录，手机端改为横向导航。项目、工具与文章支持卡片横向滑动、按钮和键盘方向键切换。

## 维护内容

- `content.js`：项目、工具和文章的标题、介绍、图片、状态、标签与链接。
- `index.html`：个人介绍、栏目结构和联系信息。
- `style.css`：主题与响应式排版。
- `main.js`：栏目路由、轮播、键盘操作与地址复制。
- `assets/diagrams/`：可编辑的 SVG 功能示意图，无人物形象。
- `.nojekyll`：直接发布静态文件，无需构建或安装依赖。

个人信息与公开资源依据 [GitHub 主页](https://github.com/lizeping-hub) 及 [个人主页 README](https://github.com/lizeping-hub/lizeping-hub) 整理。文章链接来自主页公开归档，页面不将文章标题中的历史数字解释为实时统计。

## 上传项目

目前三个个人项目卡片均为**预留展示位**，不代表已完成的项目或经过验证的成果。在 `content.js` 的 `projects` 数组中替换对应对象：

```js
{
  title: '实际项目名称',
  category: '项目分类',
  status: '实际状态',
  image: 'assets/your-project-image.webp',
  alt: '图片内容说明',
  description: '项目背景、自己的工作与实际成果',
  note: '必要的项目范围或限制说明',
  tags: ['产品设计', 'AI 工作流'],
  links: [
    { label: '在线体验', url: 'https://你的体验地址' },
    { label: '查看源码', url: 'https://github.com/你的仓库' }
  ]
}
```

将图片一并放入 `assets/`。没有公开链接时使用 `links: []`，卡片会显示“内容待补充”，不会生成空按钮。增删卡片后轮播数量自动更新；栏目标题旁的数量与底栏汇总文字位于 `index.html`，请一并维护。

`resources` 与 `writing` 数组采用相同结构。邮箱未提供，联系页目前使用真实 GitHub 链接及公众号文章入口；不要填入虚构联系方式。

## 本地预览

在此目录执行：

```sh
python3 -m http.server 4173
```

访问 http://localhost:4173/#about 。可用地址包括 `#about`、`#projects`、`#resources`、`#writing`、`#contact`；支持浏览器前进与后退。

## 发布更新

GitHub Pages 使用 `main` 分支根目录：

```sh
node --check main.js
node --check content.js
git add index.html style.css main.js content.js assets README.md
git commit -m "Update portfolio"
git push origin main
```

在仓库的 Actions 或 Settings → Pages 查看部署状态。网站维护源为本目录；相邻 `github-profile` 是 GitHub 个人介绍资料，`li-zeping-portfolio` 是早期独立版本。
