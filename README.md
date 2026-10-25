# 환승연애 · 第一章重制

以用户提供的 샛별《환승연애（1）》韩文原文为唯一剧情来源，重新翻译并重新编排为一部虚构 iPhone 内的互动记录。

## 当前版本

- 只有第一章：23 份顺序解锁的记录。
- 正片、采访、X 公开和预告蒙太奇：TVING。
- `무명의 더쿠` 格式的社区发言：theqoo，不是 DCinside。
- 入住指南、阅读说明和 X 写给宇硕的介绍信：文件。
- 承衍的介绍信在原文中通过论坛帖子公开，因此保留在原帖内。
- `你的 X 没有选择你` 出现在预告蒙太奇，未改成主人收到的即时短信。
- 原文只写出“照片／视频／动图”的位置保留文字媒体标记，不生成虚构画面。
- 完整中文重译稿：`reboot/public/chapter-01-translation.txt`。

## 实现边界

入口 `index.html` 指向 `reboot/main.tsx`。新程序不导入 `src/` 中的旧组件、样式、数据或进度逻辑；旧文件保留在版本历史与仓库中，但不参与当前构建。

- `reboot/chapter01.json`：这次重译的数据。
- `reboot/model.ts`：章节顺序、收藏、独立存档、论坛排版解析。
- `reboot/phone.tsx`：新锁屏、桌面、App、通知中心、Spotlight、文件及论坛页面。
- `reboot/phone.css`：完全独立的视觉样式。
- `reboot/icons.tsx`：新图标。

存档使用独立的 `transit-rewritten-chapter-one-v1` 键，不把旧十章版本的进度混进本章。读完记录后通过收藏、存储文件或标记已看推进，新记录以通知及桌面红点提示。已解锁记录可回看，回看不推进进度。

## 本地构建与检查

```sh
npm ci
npm run check:chapter
npm run build
```

推送到 `main` 后，现有 GitHub Pages 工作流自动发布。`publicDir` 为 `reboot/public`，旧版音频和静态资产不进入新构建。

本作是虚构同人互动，不展示真实私人资料。
