# 换乘恋爱 · 观众视角互动阅读

一款**以上帝视角观看既定恋爱真人秀**的手机优先互动文字阅读游戏。
你只是观众：不扮演人物、不创建角色、没有分支剧情、没有好感度、不会改变结局。
点选只负责**推进、揭晓、展开、翻页、查看物件**——播放原稿中已经存在的内容。

- 内容唯一来源：《换乘恋爱_全文整理版.docx》
- 全文 **10 个部分 / 2,893 个父级原文块**，逐字导入，顺序与 Word 完全一致
- **纯静态前端**（React + TypeScript + Vite）：不需要后端、不需要数据库、不需要联网接口、不需要本地 DOCX
- 全部正文已打包进项目数据（`src/data/chapter-01.json` … `chapter-10.json`）
- 阅读进度保存在浏览器 `localStorage`，**刷新页面后继续阅读**
- 黑白极简 + 童趣手绘涂鸦 + 轻盈编辑感设计系统；每个节目环节都有专属界面

---

# 一、最简单的部署方法（推荐，全程点鼠标，不用写代码）

> 这个方法你**不需要**安装 Node.js，**不需要**执行任何命令，**不需要**自己找 HTML 文件。
> 上传源码后 GitHub 会自动帮你安装依赖、构建、发布网站。

## 第 1 步：登录 GitHub

打开 https://github.com ，登录你的账号（没有账号就先注册一个，免费）。

## 第 2 步：新建仓库

1. 点右上角的 **「+」** → 选择 **「New repository」**。
2. **Repository name**（仓库名称）：随便填，例如 `huancheng-love`。
3. 可见性建议选 **Public**（公开）。
   > 免费账号的私有仓库通常无法使用 GitHub Pages，所以建议选 Public。
4. **不要勾选** “Add a README file”、“Add .gitignore”、“Choose a license”
   —— 勾选会和本项目里的文件冲突。
5. 点绿色按钮 **「Create repository」**。

## 第 3 步：解压源码

把 `换乘恋爱_互动阅读游戏_完整源码.zip` **解压**。
解压后你会**直接看到** `index.html`、`package.json`、`src`、`.github` 等文件和文件夹
（注意：不是再套一层文件夹）。

## 第 4 步：把全部文件上传到仓库根目录

1. 在刚建好的空仓库页面，点 **「uploading an existing file」**
   （或者点 **Add file → Upload files**）。
2. 把解压后的**全部文件和文件夹**一起拖进上传框。
3. 拖完后往下滚，点 **「Commit changes」**。

> **重要提醒**：`.github` 文件夹是隐藏文件夹，Windows 资源管理器可能不显示它。
> 请先在资源管理器菜单里勾选 **「查看 → 隐藏的项目」**，确认 `.github` 也一起被拖进去了。
> 上传完成后，在仓库文件列表里应该能看到路径 `.github/workflows/deploy-pages.yml`。
> **这个文件就是自动部署的开关，没有它网站不会自动发布。**

## 第 5 步：把 Pages 的来源设置为 GitHub Actions

1. 打开仓库上方的 **「Settings」**（设置）。
2. 在左侧菜单里点 **「Pages」**。
3. 找到 **「Build and deployment」** → **Source**（来源）。
4. 把它从 “Deploy from a branch” 改成 **「GitHub Actions」**。

## 第 6 步：等待自动部署完成

1. 打开仓库上方的 **「Actions」** 页面。
2. 你会看到一个名为 **Deploy to GitHub Pages** 的任务正在运行（黄色圆点 = 进行中）。
3. 等它变成**绿色对勾**（一般 1～3 分钟）即表示成功。

## 第 7 步：打开你的网站

回到 **Settings → Pages**，页面顶部会显示网站地址，形如：

```
https://你的用户名.github.io/仓库名/
```

点开就能直接阅读了。手机浏览器打开同一个地址体验最佳。

## 以后想改内容怎么办？

- 直接在 GitHub 上修改文件或再次上传新文件即可，**网站会自动重新构建并发布**。
- **不需要**自己上传 `dist` 文件夹。
- **不需要**自己执行 `npm run build`。
- 如果部署失败：打开 **Actions** 页面 → 点开那次失败的运行记录 → 看哪一步是红色叉，
  展开它就能看到具体报错信息（最常见原因是 `.github` 文件夹没上传，或 Pages 的 Source 没选 GitHub Actions）。

---

# 二、方法 B：直接使用已经构建好的部署版

`换乘恋爱_互动阅读游戏_GitHubPages部署版.zip` 里面是**已经生产构建完成**的静态网站，
包含 `index.html`、`assets/`（CSS + JavaScript，全部 10 章正文都在里面）、`favicon.svg`、`robots.txt`、`.nojekyll`。
它**不需要**源码目录，也**不需要**任何构建步骤，可以直接当静态网站发布。

### 上传到 GitHub Pages 发布分支

1. 新建仓库（或用已有仓库），解压部署版 ZIP。
2. 把解压后的 `index.html`、`assets/` 等**全部文件**上传到仓库分支根目录
   （常用做法：建一个 `gh-pages` 分支，或直接放在 `main` 分支根目录）。
3. **Settings → Pages → Build and deployment → Source** 选择 **Deploy from a branch**，
   分支选你上传的那个，目录选 **/ (root)**，保存。
4. 等一两分钟后打开 Pages 给出的网址。

### 上传到 Netlify

1. 打开 https://app.netlify.com → **Add new site** → **Deploy manually**。
2. 把**解压后的文件夹**整个拖进去（不是拖 ZIP）。
3. 等待上传完成，Netlify 会直接给出网址。

### 上传到 Cloudflare Pages

1. 打开 Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**。
2. 上传**解压后的文件夹**，项目名随便填，保存后即可获得网址。

### 其他静态托管（Vercel / 对象存储 / 自己的服务器 Nginx）

把解压后的所有文件放到站点根目录即可，无需任何服务端配置。

### 三条常见错误提醒

- **不能**把 ZIP 文件本身双击当网页打开 —— 必须先解压。
- **不能**只上传 `index.html` —— 那样会白屏，因为 CSS/JS 都在 `assets/` 里。
- 必须把 `index.html` 和 `assets/` **一起**上传，保持它们在同一层目录。

---

# 三、本地运行（可选，给想改代码的人）

要求 Node.js ≥ 18（本项目开发使用 Node 22）。在解压后的项目根目录执行：

## 本地开发启动

```bash
npm install
npm run dev
```

启动后终端会显示本地地址（默认 http://localhost:5173 ），浏览器打开即可。
想看手机效果：按 F12 打开开发者工具 → 切换设备模拟 → 选 360 / 375 / 390 / 430px 宽度。

## 生产构建

```bash
npm run build
```

**构建结果输出目录：项目根目录下的 `dist/`。**
里面包含 `index.html`、`assets/index-*.js`、`assets/index-*.css`、`favicon.svg`、`robots.txt`。
全部 10 章 / 2,893 个父级原文块都被打包进 `assets/index-*.js`，运行时不再读取任何外部文件。

## 本地预览生产构建结果

```bash
npm run preview
```

会启动一个本地静态服务器预览 `dist/` 的真实产物（默认 http://localhost:4173 ）。

---

# 四、项目根目录结构

```text
（解压后的仓库根目录）
├─ index.html                       ← 页面入口
├─ package.json                     ← 依赖与命令（dev / build / preview）
├─ package-lock.json                ← 锁定依赖版本，GitHub Actions 用 npm ci 读取
├─ vite.config.ts                   ← 构建配置（base: './' 相对路径）
├─ tsconfig.json / tsconfig.node.json
├─ .gitignore
├─ README.md                        ← 本文件
├─ .github/
│  └─ workflows/
│     └─ deploy-pages.yml           ← GitHub Pages 自动部署工作流
├─ public/                          ← 原样拷贝到构建产物的静态资源
│  ├─ favicon.svg
│  ├─ robots.txt
│  └─ .nojekyll                     ← 让 GitHub Pages 不走 Jekyll 处理
├─ scripts/                         ← 内容转换与校验脚本（构建时不参与，仅供复核）
│  ├─ parse_docx.py                 ← Word → 稳定内容数据（生成 src/data/chapter-*.json）
│  ├─ fidelity_check.py             ← 逐字文本保真校验（数据 vs Word）
│  ├─ validate.js                   ← type/subtype 与渲染器契约校验
│  └─ smoke.tsx                     ← 全量渲染冒烟测试（2,893 步全部渲染）
└─ src/
   ├─ main.tsx                      ← 应用入口
   ├─ App.tsx                       ← 单页状态切换（首页 / 阅读器），不使用路由
   ├─ types/content.ts              ← ContentBlock / ChildSegment 类型定义
   ├─ data/
   │  ├─ chapter-01.json … chapter-10.json   ← 10 章全文数据（2,893 个父级原文块）
   │  ├─ manifest.json               ← 统一内容清单
   │  └─ loader.ts                   ← 数据加载与章节索引
   ├─ renderers/
   │  ├─ index.tsx                   ← 统一内容渲染器（按 type/subtype 分发）
   │  └─ common.tsx                  ← 模块元信息（标签 / 图标 / 是否需点击揭晓）
   ├─ screens/
   │  ├─ HomeScreen.tsx              ← 首页
   │  ├─ ReaderScreen.tsx            ← 阅读引擎（点选推进 / 自动播放 / 历史 / 进度）
   │  └─ Panels.tsx                  ← 设置 / 历史记录 / 章节目录面板
   ├─ components/Doodles.tsx         ← 原创手绘线稿涂鸦 SVG
   ├─ hooks/useProgress.ts           ← 进度状态 + localStorage 自动保存
   ├─ utils/reading.ts               ← 阅读顺序与全局步骤索引
   └─ styles/global.css              ← 设计系统 + 移动端响应式
```

---

# 五、GitHub Pages 兼容说明（为什么不会白屏、不会 404）

- **静态资源路径**：`vite.config.ts` 使用 `base: './'`（相对路径）。
  因此无论部署在 `用户名.github.io` 根域名，还是 `用户名.github.io/任意仓库名/` 子路径下，
  资源都能正确加载，**不需要把仓库名写死到配置里**。
- **不使用前端路由**：应用采用**单页面状态切换**（首页 ↔ 阅读器），
  地址栏始终是同一个 `index.html`，所以**刷新页面不会出现 404**，也不需要 HashRouter 或 404.html 回退。
- **数据内嵌**：10 章 JSON 在构建时被打包进 JS bundle，运行时**不发起任何网络请求**取正文，
  不依赖后端 / 数据库 / DOCX / 开发服务器。
- **进度持久化**：阅读进度写入浏览器 `localStorage`（键名 `huancheng-progress-v1`），
  刷新或关闭浏览器后重新打开都会恢复到上次的章节、父级 sourceId 与显示步骤。
- **`.nojekyll`**：已放入 `public/`，构建后进入产物根目录，避免 GitHub Pages 的 Jekyll 忽略下划线开头的文件。

## 如果仓库名变化 / 绑定自定义域名

- 由于使用相对路径 `base: './'`，**仓库改名、换域名、加子路径都无需修改任何配置**，重新部署即可。
- 如果你偏好绝对路径，可把 `vite.config.ts` 的 `base` 改成 `'/你的仓库名/'` 后重新构建；
  但要注意：绝对路径在仓库改名后必须同步修改，否则资源会 404。**默认的相对路径更稳妥。**

---

# 六、阅读与交互说明

- 首页固定提示：**「你将以观众视角观看既定故事，点选只负责推进剧情。」**
- 点击正文区域 → 显示下一段 / 下一个显示步骤。
- 信封、任务卡、X ROOM 物件、身份揭晓、最终选择等属于「需点击揭晓」模块，自动播放会在此暂停等待点击。
- 提供功能：继续阅读 / 从头开始 / 章节目录（仅可进入已解锁章节）/ 总阅读进度 / 当前章节进度 /
  历史记录 / 上一段 / 下一段 / 自动播放（含速度设置）/ 已读快速跳过 / 字号调节 / 减少动态效果 /
  重新开始（二次确认）/ 返回首页 / 当前模块提示 / 自动保存 / 刷新后继续。
- 全程上帝视角：所有「查看选择 / 揭晓结果」按钮只呈现人物在原稿中已经做出的决定，玩家不能替人物决定，也没有隐藏结局。

# 七、适配与验收

- 目标宽度 360 / 375 / 390 / 430px 均无横向溢出、无按钮遮挡
  （容器 `width:100%; max-width:440px`；阅读画布 `max-width:480px` 居中；全局 `box-sizing:border-box`；`.phone` 隐藏溢出；底部按钮避开安全区）。
- 桌面端显示为居中的手机阅读画布，正文不会在宽屏上无限拉宽。
- 所有主要点击区域 ≥ 44px；支持键盘访问与 `aria-label`。
- 支持 `prefers-reduced-motion`，并额外提供「减少动态效果」开关。
- 生产构建通过；2,893 个父级原文块全部进入 `dist` 的 JS 产物。

# 八、技术栈

React 18 · TypeScript 5 · Vite 5 · 原生 CSS 设计系统 · localStorage 进度持久化 · GitHub Actions 自动部署
