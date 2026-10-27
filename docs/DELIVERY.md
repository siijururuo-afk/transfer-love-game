# 本轮修改与验收

已实现：iOS 17 风格状态栏、安全区、短动画、路由与滚动保存；独立短信会话、匿名显示、通知历史；原创路线心形节目封面、采访与信件包装；六组 Instagram 多媒体；照片缩放、平移、横滑与下滑关闭；Melon 播放位置保存及网页音乐岛；视频与音乐互斥；提示音、静音持久保存；存档导出导入与错误回滚；PWA。

保留：356 条剧情、十二部分的顺序与 ID、壁纸样式、原存档 key。原文支持的 10 处译文修订见 translation-revisions.json。逐条记录见 record-registry.json。

## 明确未完成的核实

第一至十章及外传上的完整韩文未能从当前附件、仓库或历史检索取回，不能宣称十二部分已逐段对照完成。当前韩文片段确认 e2-marriage-post 为 Instiz、e2-last-words-post 为 theqoo；其余 110 条采用中性论坛展示，不再按格式猜测来源。

主要第三方 App 是现有功能上的增量改善，并非所有页面均已达到像素级复刻。YouTube 外链播放依赖第三方嵌入许可，离开 App 后无法保证保留精确播放秒数。未进行实体 iPhone Safari 验收。

## 素材

六组帖子：2、8、3、1、3、1 项，共14张图和4段视频，另含头像与精选动态图。media-audit.json 记录上传原件的哈希与对应关系。网页视频使用完整时长和原画幅的 H.264/AAC 压缩版本，以便发布；原件未改。图片未裁切修改。

## 测试

npm run check:chapter：十二部分、356条记录和导出译文一致性通过。npm run check:interactions：17个短信节点、全部推进路径及旧存档迁移通过。node scripts/check-redesign.mjs：13个迁移检查点、无效存档、回滚、论坛解析和静音去重通过。node scripts/check-pwa.mjs：安装、旧缓存清理、离线图片回退、不预缓存未来媒体通过。npm run build 通过。

浏览器实际导入第五章末旧存档后恢复到第六章；实际检查 X 独立会话三条消息。320/375/430px iframe 布局正文 clientWidth 与 scrollWidth 相等。这是桌面浏览器移动尺寸模拟，不能替代实体 Safari、捏合手势和后台音频验证。

## 参考与年代

- iOS 17：Apple 2023年6月与9月官方发布图片，https://www.apple.com/newsroom/2023/06/ios-17-makes-iphone-more-personal-and-intuitive/ ，https://www.apple.com/newsroom/2023/09/ios-17-is-available-today/ 。未引入 Liquid Glass。
- KakaoTalk：2023年官方第三个 Open Chat 标签说明，https://www.kakaocorp.com/page/detail/10459 。
- Instagram：用户上传的2023年帖子与主页截图为主要素材参考；当前官方目录作为结构补充 https://apps.apple.com/kr/app/instagram/id389801252 。
- Melon、X、TVING、YouTube：未取得可靠2023全套截图，采用当前韩国官方 App Store 目录补充，分别为 id415597317、id333903271、id400101401、id544007664；未采用新版iOS系统外壳。
- theqoo：当前官方网站 https://theqoo.net/ 。Instiz 与 Daum 页面检索未能完整打开，未宣称全页面视觉核实完成。
- 节目：CJ ENM 第一季及第四季官方作品页、TVING第二季 P001613931、第三季 P001749878 页面；第一季路线心形海报另经 TMDB 海报预览核对。实际封面为原创矢量构图，没有复制官方海报。全季各环节截图的逐项考据尚未完成。
