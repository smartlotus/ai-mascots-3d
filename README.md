# AI 编程吉祥物 · 3D 展示（ai-mascots-3d）

六只以 AI 编程工具为灵感的**原创** 3D 吉祥物——Claude Code、Codex、Qoder、ZCode、Notion、Antigravity——各有两个版本：**圆润可爱版（v1）** 和 **2mm 像素版（pixel）**。这是一个纯静态的 three.js 展示网页，手机和电脑都能流畅旋转查看。

**在线地址：<https://smartlotus.github.io/ai-mascots-3d/>**

> 声明：这些吉祥物是个人原创设计，灵感来自各应用的图标与形象，并非任何官方授权的吉祥物。相关名称与商标归其各自所有者所有。

## 功能

- 6 只吉祥物 × 2 个版本，一键切换（圆润版 / 像素版）
- 3D 查看器：拖动旋转、双指/滚轮缩放、自动旋转、摄影棚灯光 + 柔和阴影 + 转台
- 「分色拆分」：按耗材颜色把零件分层错开，看清各颜色零件如何嵌合
- 点击颜色条可隐藏/显示对应零件
- 「并排对比」：同一比例下同时看圆润版和像素版
- 详情：名称、尺寸（宽×深×高 mm）、耗材颜色与用途、打印建议（全部来自随模型提供的《打印说明》）
- 中文 / English 界面切换（默认跟随浏览器语言，记在 localStorage）
- 先显示效果图海报，模型加载完成后无缝切换；浏览器不支持 WebGL 时回退到海报
- 可深链：`#/claude/pixel`、`#/antigravity/v1`；键盘 ← → 切换角色，`V` 切换版本

## 开发

```bash
npm install
npm run dev        # http://127.0.0.1:5183
npm run build      # 类型检查 + 打包到 dist/
npm run preview
```

发布：合并到 `main` 后运行 `scripts/deploy-pages.sh`，会构建并把 `dist/` 作为新提交推到 `gh-pages` 分支（GitHub Pages 从该分支提供服务，不需要 force-push）。

## 模型与更新

网页用的模型在 `public/models/{角色}-{版本}.glb`（共 12 个，合计约 1.6 MB，meshopt 压缩）。原始大文件（约 77 MB 的 GLB、3MF、STL、Python 建模脚本）**没有**放进仓库。更新模型、重新生成海报的步骤见 [`docs/HANDOFF.md`](docs/HANDOFF.md)。

## 技术

Vite + TypeScript + three.js（动态加载，首屏 JS 约 11 KB gzip，三维部分 171 KB gzip）；模型用 gltf-transform + meshoptimizer 处理；无框架、无追踪。
