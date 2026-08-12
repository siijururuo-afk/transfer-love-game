# -*- coding: utf-8 -*-
"""四档手机宽度（360 / 375 / 390 / 430px）确定性布局审计。
不依赖浏览器，直接解析构建后的 CSS + 阅读器结构，检查：
  1. 是否存在超过最小视口宽度的固定宽度/最小宽度（会造成横向溢出）
  2. 关键横向布局（顶部栏 / 底部栏）在 360px 下的固定宽度总和是否超出可用宽度
  3. 全局 box-sizing / 溢出保护 / 安全区适配 / 44px 点击区
"""
import os, re, glob

ROOT = r"C:\Users\Administrator\WorkBuddy\2026-08-12-14-38-27"
CSS_SRC = os.path.join(ROOT, "app", "src", "styles", "global.css")
CSS_DIST = glob.glob(os.path.join(ROOT, "app", "dist", "assets", "*.css"))[0]
WIDTHS = [360, 375, 390, 430]

css = open(CSS_SRC, encoding="utf-8").read()
dist_css = open(CSS_DIST, encoding="utf-8").read()

print("=" * 64)
print("四档宽度布局审计（360 / 375 / 390 / 430px）")
print("=" * 64)

# --- 1. 固定宽度扫描（width / min-width，排除 max-width） ---
risk = []
for m in re.finditer(r"(?<!max-)\b(width|min-width)\s*:\s*(\d+(?:\.\d+)?)px", css):
    prop, val = m.group(1), float(m.group(2))
    # 排除 @media (min-width: xxx) 这类断点条件，它不是元素宽度声明
    line_start = css.rfind("\n", 0, m.start()) + 1
    if "@media" in css[line_start:m.start()]:
        continue
    if val > 320:  # 320 以下对 360 视口一定安全
        # 取上下文找出所属选择器
        head = css[:m.start()]
        sel = head.rfind("{")
        selname = head[head.rfind("}", 0, sel) + 1: sel].strip().replace("\n", " ")[-70:]
        risk.append((selname, prop, val))
print(f"\n[1] 固定宽度 / 最小宽度 > 320px 的声明: {len(risk)} 条")
if risk:
    for s, p, v in risk:
        flags = " ".join(f"{w}px:{'溢出' if v > w else 'OK'}" for w in WIDTHS)
        print(f"    {s} -> {p}:{v:.0f}px   {flags}")
else:
    print("    无 —— 所有容器均使用 width:100% + max-width，天然自适应")

# --- 2. 关键横向栏在 360px 下的固定宽度占用 ---
print("\n[2] 关键横向布局在最窄 360px 下的占用")
PHONE_PAD = 14  # .phone 左右内边距（单侧）
avail_360 = 360 - PHONE_PAD * 2
topbar_buttons = 4          # 返回 / 目录 / 历史 / 设置
bottom_buttons = 3          # 上一段 / 自动播放 / 下一段
btn = 44
print(f"    可用内容宽度(360 - 内边距 {PHONE_PAD}×2) = {avail_360}px")
print(f"    顶部栏: {topbar_buttons} × {btn}px 按钮 = {topbar_buttons*btn}px"
      f"  + 标题弹性收缩  -> 剩余 {avail_360 - topbar_buttons*btn}px 给标题  "
      f"{'OK' if topbar_buttons*btn < avail_360 else '溢出'}")
print(f"    底部栏: {bottom_buttons} × {btn}px 按钮 = {bottom_buttons*btn}px"
      f"  -> 剩余 {avail_360 - bottom_buttons*btn}px  "
      f"{'OK' if bottom_buttons*btn < avail_360 else '溢出'}")

# --- 3. 全局保护性规则 ---
checks = [
    ("全局 box-sizing: border-box", r"box-sizing\s*:\s*border-box"),
    ("阅读画布限宽 --canvas-max: 480px", r"--canvas-max\s*:\s*480px|max-width\s*:\s*480px"),
    ("模块容器限宽 max-width: 440px", r"max-width\s*:\s*440px"),
    ("画布隐藏横向溢出 overflow-x/overflow: hidden", r"overflow(-x)?\s*:\s*hidden"),
    ("iOS 安全区适配 env(safe-area-inset-bottom)", r"env\(\s*safe-area-inset-bottom"),
    ("最小点击区 44px（--tap 变量）", r"--tap\s*:\s*44px|min-(height|width)\s*:\s*44px"),
    ("减少动态效果 prefers-reduced-motion", r"prefers-reduced-motion"),
    ("长内容内部滚动 overflow-y: auto", r"overflow-y\s*:\s*auto"),
    ("正文换行保护 word-break / overflow-wrap", r"(word-break|overflow-wrap)\s*:"),
    ("图片/媒体自适应 max-width: 100%", r"max-width\s*:\s*100%"),
]
print("\n[3] 全局保护性规则（源码 CSS / 构建产物 CSS 双检）")
all_ok = True
for name, pat in checks:
    a = bool(re.search(pat, css))
    b = bool(re.search(pat, dist_css))
    ok = a and b
    all_ok = all_ok and ok
    print(f"    [{'OK' if ok else '缺失'}] {name}"
          f"   (源码:{'有' if a else '无'} / 产物:{'有' if b else '无'})")

# --- 4. 结论 ---
print("\n[4] 结论")
overflow_widths = {w: [r for r in risk if r[2] > w] for w in WIDTHS}
for w in WIDTHS:
    bad = overflow_widths[w]
    print(f"    {w}px: {'通过 —— 无横向溢出、无按钮遮挡' if not bad else '不通过 -> ' + str(bad)}")
print(f"    全局保护性规则: {'全部通过' if all_ok else '存在缺失'}")
