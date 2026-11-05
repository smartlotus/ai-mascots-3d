# 交接说明（HANDOFF）

本仓库是一个**独立项目**（不是 jelly-gift 纪念日网站），用来展示用户自己建模的 6 只 AI 编程吉祥物。

- 仓库：<https://github.com/smartlotus/ai-mascots-3d>
- 线上：<https://smartlotus.github.io/ai-mascots-3d/>
- 资料来源：Notion 页面「AI 编程吉祥物 · 3D 建模与打印项目」及其三个压缩包（`pixel.zip`、`v1-cute.zip`、`source-glb.zip`）

## 目录结构

```
index.html                 页面骨架（所有文字由 src/main.ts + src/i18n.ts 填充）
poster.html                仅开发用：渲染海报（scripts/make-posters.mjs 使用，不会发布）
src/
  main.ts                  界面逻辑：状态、选择条、详情、全家福、中英切换、深链
  viewer.ts                three.js 查看器（懒加载的独立 chunk）：灯光、转台、阴影、拆分、对比
  poster.ts                海报渲染入口
  i18n.ts                  界面文案（zh / en）
  data/mascots.ts          角色数据：尺寸、颜色分组含义、打印建议（来自《打印说明》）
  data/model-meta.json     由 scripts/build-models.mjs 自动生成：零件颜色、面数、体积
  style.css
public/
  models/*.glb             优化后的网页模型（12 个）
  posters/*.webp           透明背景海报（480px）与缩略图（-sm），以及两张全家福原图
scripts/
  build-models.mjs         原始 GLB → 网页 GLB
  make-posters.mjs         渲染海报
  shot.mjs / stage.mjs     截图/验收脚本（Playwright + 本机 Chrome）
.github/workflows/pages.yml  构建并发布到 GitHub Pages
```

## 数据来源与约定（只写文件里有的事实）

- 尺寸（宽×深×高 mm）、每个颜色用在哪里、打印参数全部抄自两份《打印说明.txt》，写在 `src/data/mascots.ts`。
- 零件颜色（色块 hex）来自 GLB 里每个零件的材质颜色（原始值就是 sRGB，脚本里转成 glTF 需要的线性值）。
- 中文名（牛仔螃蟹、花结、单片镜……）是对原工程英文名的翻译，可随意改。
- 原始 GLB 是 Z 轴向上、毫米单位、正面朝 -Y；脚本里统一转成 Y 轴向上、正面朝 +Z、居中、底面落在 y=0。

## 如何更新 / 新增模型

1. 把原始 GLB 放到 `source/`（已 gitignore）：`source/out/*.glb`（圆润版）、`source/out2/Pixel_*.glb`（像素版）。可以从 `source-glb.zip` 里解压得到。
2. 若是新角色：在 `scripts/build-models.mjs` 的 `JOBS` 里加一行 `[id, 'v1'|'pixel', 文件路径]`，在 `src/data/mascots.ts` 里加角色数据，在 `src/style.css`/`index.html` 里无需改动。
3. 运行：
   ```bash
   MASCOT_SRC=source node scripts/build-models.mjs         # 全部；或加参数只重做某个，如 claude-v1
   ```
   处理流程：转轴/居中 → 焊接 → （圆润版）Taubin 平滑 + 减面到约 22% → 重新计算法线（圆润版平滑，像素版硬边）→ 量化 → meshopt 压缩。像素版是 2mm 方块，用近似无损的共面三角形合并，面数从约 10 万降到 2~7 千。
4. 重新生成海报（需要先 `npm run dev`，并装有 Chrome）：
   ```bash
   npm run dev &
   npm run posters
   ```
5. `npm run build`，提交，走分支 + PR 合并到 `main`，Actions 自动发布。

## 打印文件（3MF / STL）

故意没有放进仓库（体积大，且仓库是公开的）。如果以后想提供下载：把 3MF 放进 `public/downloads/`（12 个合计约 20 MB），在 `src/main.ts` 的 `renderDetail()` 里加一个链接即可。

## 部署

- GitHub Pages，来源 = GitHub Actions（仓库 Settings → Pages → Source 选 “GitHub Actions”，已用 API 开启）。
- `vite.config.ts` 使用 `base: './'`，所以换仓库名/自定义域名都不需要改配置。
- 手动重新发布：Actions → “Deploy to GitHub Pages” → Run workflow。
- 回滚：`git revert` 对应合并提交后推送 `main`。

## 性能与兼容

- 首屏只加载 ~11 KB（gzip）JS + 海报图；three.js 与模型在之后加载，空闲时预加载其余模型（全部 12 个仅 ~1.6 MB）。
- 渲染按需：不动且没开自动旋转时停止渲染；页面不可见/滚出视野时暂停。
- 自适应分辨率：连续帧耗时超过 ~24 ms 时自动把渲染分辨率往下降（最低 0.75×）。
- 阴影：单个平行光 + PCF 阴影贴图（手机 1024、桌面 2048），外加地面接触阴影。
- 画布 `touch-action: none`，手机上展台高度限制在 58svh，页面其余部分可正常滚动。
- 没有 WebGL 时显示海报和提示。

## 已知事项 / 待办

- 仅在无头 Chrome（SwiftShader 软件渲染）和 Playwright WebKit 里验证过，未上真机测过实际帧率。
- 圆润版是 marching-cubes 网格，已平滑，但帽檐、花结边缘仍能看到一点点细微颗粒（原始模型就有）。
- 「分色拆分」是按颜色把零件沿镜头方向错开，不是真实的装配拆件（模型本身是一体多色）。
