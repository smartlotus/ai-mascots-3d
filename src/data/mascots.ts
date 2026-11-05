// 所有文字事实来自「打印说明.txt」与 Notion 项目页；模型零件颜色来自 GLB（见 model-meta.json）
import meta from './model-meta.json';

export type Ver = 'v1' | 'pixel';
export type Lang = 'zh' | 'en';
export interface L10n { zh: string; en: string }

export interface PartDef {
  key: string; // GLB 中的零件名（= 颜色分组）
  color: L10n; // 耗材颜色名
  role: L10n; // 这个颜色用在哪里
}
export interface VersionDef {
  file: string; // 原始工程名
  name: L10n; // 展示名
  size: [number, number, number]; // 宽×深×高 mm（来自打印说明）
  parts: PartDef[];
  label?: string; // 像素版底座命令行标签
}
export interface MascotDef {
  id: string;
  name: string; // 原型名（产品名）
  accent: string; // 页面强调色（取自模型主色）
  v: Record<Ver, VersionDef>;
}

const c = (zh: string, en: string): L10n => ({ zh, en });

export const MASCOTS: MascotDef[] = [
  {
    id: 'claude', name: 'Claude Code', accent: '#d97757',
    v: {
      v1: { file: 'ClaudeCode_CowboyCrab', name: c('牛仔螃蟹', 'Cowboy Crab'), size: [86, 43, 44], parts: [
        { key: 'body', color: c('橙', 'Orange'), role: c('身体', 'Body') },
        { key: 'hat', color: c('棕', 'Brown'), role: c('牛仔帽', 'Cowboy hat') },
        { key: 'black', color: c('黑', 'Black'), role: c('眼睛 / 帽带 / 嘴', 'Eyes / hat band / mouth') },
        { key: 'white', color: c('白', 'White'), role: c('高光 / 星星', 'Highlights / star') },
      ] },
      pixel: { file: 'Pixel_ClaudeCode_Cowboy', name: c('像素牛仔螃蟹', 'Pixel Cowboy Crab'), size: [68, 36, 45], label: '>CLAUDE_CODE_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('底座 / 眼睛 / 帽带', 'Base / eyes / hat band') },
        { key: 'orange', color: c('橙', 'Orange'), role: c('螃蟹 + 标签', 'Crab + label') },
        { key: 'brown', color: c('棕', 'Brown'), role: c('牛仔帽', 'Cowboy hat') },
      ] },
    },
  },
  {
    id: 'codex', name: 'Codex', accent: '#0fa380',
    v: {
      v1: { file: 'Codex_Blossom', name: c('花结', 'Blossom'), size: [36, 21, 59], parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('身体 / 脸', 'Body / face') },
        { key: 'white', color: c('白', 'White'), role: c('花瓣结 / 眼睛', 'Petal knot / eyes') },
        { key: 'green', color: c('绿', 'Green'), role: c('>_ 提示符 / 脚 / 腮红', '>_ prompt / feet / blush') },
      ] },
      pixel: { file: 'Pixel_Codex_Terminal', name: c('像素终端', 'Pixel Terminal'), size: [46, 35, 59], label: '>CODEX_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('终端身体 / 底座', 'Terminal body / base') },
        { key: 'green', color: c('绿', 'Green'), role: c('">_" 脸 / 脚 / 标签', '">_" face / feet / label') },
        { key: 'white', color: c('白', 'White'), role: c('头顶像素花结', 'Pixel knot on top') },
      ] },
    },
  },
  {
    id: 'qoder', name: 'Qoder', accent: '#29c95a',
    v: {
      v1: { file: 'Qoder_Monocle', name: c('单片镜', 'Monocle'), size: [51, 24, 40], parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('身体', 'Body') },
        { key: 'white', color: c('白', 'White'), role: c('方框 + 单片镜圆环', 'Frame + monocle ring') },
        { key: 'green', color: c('绿', 'Green'), role: c('眼睛', 'Eyes') },
      ] },
      pixel: { file: 'Pixel_Qoder_Monocle', name: c('像素单片镜', 'Pixel Monocle'), size: [56, 31, 49], label: '>QODER_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('身体 / 底座', 'Body / base') },
        { key: 'white', color: c('白', 'White'), role: c('方框 + 单片镜圆环', 'Frame + monocle ring') },
        { key: 'green', color: c('绿', 'Green'), role: c('眼睛 / 标签', 'Eyes / label') },
      ] },
    },
  },
  {
    id: 'zcode', name: 'ZCode', accent: '#3b6eff',
    v: {
      v1: { file: 'ZCode_ZapBot', name: c('闪电机器人', 'ZapBot'), size: [44, 26, 45], parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('身体', 'Body') },
        { key: 'white', color: c('白', 'White'), role: c('头顶 Z / 眼睛', 'Z on top / eyes') },
        { key: 'blue', color: c('蓝', 'Blue'), role: c('脚 / 腮红', 'Feet / blush') },
      ] },
      pixel: { file: 'Pixel_ZCode_Bot', name: c('像素机器人', 'Pixel Bot'), size: [43, 35, 51], label: '>ZCODE_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('身体 / 底座', 'Body / base') },
        { key: 'white', color: c('白', 'White'), role: c('眼睛 / 胸前 Z / 标签', 'Eyes / chest Z / label') },
        { key: 'blue', color: c('蓝', 'Blue'), role: c('天线 / 腮红 / 脚', 'Antenna / blush / feet') },
      ] },
    },
  },
  {
    id: 'notion', name: 'Notion', accent: '#f0708c',
    v: {
      v1: { file: 'Notion_CubeBuddy', name: c('方块伙伴', 'Cube Buddy'), size: [46, 36, 39], parts: [
        { key: 'white', color: c('白', 'White'), role: c('方块', 'Cube') },
        { key: 'black', color: c('黑', 'Black'), role: c('描边 / N / 五官 / 脚', 'Outline / N / face / feet') },
        { key: 'pink', color: c('粉', 'Pink'), role: c('腮红', 'Blush') },
      ] },
      pixel: { file: 'Pixel_Notion_Cube', name: c('像素方块', 'Pixel Cube'), size: [46, 39, 41], label: '>NOTION_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('棱边 / N / 五官 / 底座', 'Edges / N / face / base') },
        { key: 'white', color: c('白', 'White'), role: c('方块 / 标签', 'Cube / label') },
        { key: 'pink', color: c('粉', 'Pink'), role: c('腮红', 'Blush') },
      ] },
    },
  },
  {
    id: 'antigravity', name: 'Antigravity', accent: '#4285f4',
    v: {
      v1: { file: 'Antigravity_Floaty', name: c('漂浮拱门', 'Floaty'), size: [59, 18, 49], parts: [
        { key: 'yellow', color: c('黄', 'Yellow'), role: c('头', 'Head') },
        { key: 'red', color: c('红', 'Red'), role: c('拱形身体', 'Arch body') },
        { key: 'green', color: c('绿', 'Green'), role: c('拱形身体', 'Arch body') },
        { key: 'blue', color: c('蓝', 'Blue'), role: c('拱形身体', 'Arch body') },
        { key: 'black', color: c('黑', 'Black'), role: c('五官', 'Face') },
      ] },
      pixel: { file: 'Pixel_Antigravity_Arch', name: c('像素拱门', 'Pixel Arch'), size: [71, 21, 53], label: '>ANTIGRAVITY_', parts: [
        { key: 'black', color: c('黑', 'Black'), role: c('底座 / 五官', 'Base / face') },
        { key: 'blue', color: c('蓝', 'Blue'), role: c('拱门', 'Arch') },
        { key: 'red', color: c('红', 'Red'), role: c('拱门', 'Arch') },
        { key: 'yellow', color: c('黄', 'Yellow'), role: c('拱门', 'Arch') },
        { key: 'green', color: c('绿', 'Green'), role: c('拱门', 'Arch') },
      ] },
    },
  },
];

export const modelKey = (id: string, v: Ver) => `${id}-${v}`;
export const modelUrl = (id: string, v: Ver) => `${import.meta.env.BASE_URL}models/${modelKey(id, v)}.glb`;
export const posterUrl = (id: string, v: Ver, size: 'sm' | 'lg' = 'lg') => `${import.meta.env.BASE_URL}posters/${modelKey(id, v)}${size === 'sm' ? '-sm' : ''}.webp`;

type Meta = Record<string, { size_mm: number[]; parts: { name: string; hex: string }[]; trisAfter: number; bytes: number }>;
export const MODEL_META = meta as Meta;
export const partHex = (id: string, v: Ver, key: string) => MODEL_META[modelKey(id, v)]?.parts.find((p) => p.name === key)?.hex ?? '#888';
export const find = (id: string) => MASCOTS.find((m) => m.id === id) ?? MASCOTS[0];

export interface Note { zh: string; en: string }
export const PRINT_NOTES: Record<Ver, Note[]> = {
  pixel: [
    { zh: '2mm 像素方块 + 黑色“终端”底座；底座正面是 1mm 像素字体的命令行标签 >NAME_', en: '2 mm pixel blocks on a black “terminal” base; the base front carries a 1 mm pixel-font command-line label >NAME_' },
    { zh: '全是平面方块结构，无悬空孤岛；网格已检查：全部水密、0 非流形边', en: 'Flat block structure with no floating islands; meshes checked: all watertight, 0 non-manifold edges' },
    { zh: 'PLA、0.4 喷嘴；层高 0.2 mm 即可（像素边是 1/2 mm 的整数倍，能对齐得很干净）', en: 'PLA, 0.4 mm nozzle; 0.2 mm layers are enough (pixel edges are whole multiples of 1/2 mm and align cleanly)' },
    { zh: '墙 2~3 层，填充 15%；一般无需支撑', en: '2–3 walls, 15% infill; generally no supports needed' },
    { zh: 'Codex 头顶花朵、ZCode 天线有 1~2 格（2~4 mm）小悬挑，PLA 可直接打', en: 'Codex’s top flower and ZCode’s antenna have 1–2 cell (2–4 mm) small overhangs; PLA prints them directly' },
    { zh: '底座文字是 1 mm 深的同平面嵌色，换色较多时可开擦料塔并适当减小冲刷体积', en: 'Base text is a 1 mm deep flush colour inlay; with many colour changes, enable the wipe tower and reduce flush volume a bit' },
    { zh: '想要更大：切片里等比放大 125% / 150% 效果都很好', en: 'Want it bigger? Scaling uniformly to 125% / 150% in the slicer works very well' },
  ],
  v1: [
    { zh: '每个角色一个 3MF，已按颜色拆成多个零件，可直接用 Bambu Studio 打开并给每个零件指定耗材', en: 'One 3MF per character, already split into colour parts; open in Bambu Studio and assign a filament to each part' },
    { zh: 'PLA、0.4 喷嘴；层高 0.12~0.16 mm（小五官更清晰）；墙 3 层；填充 15% 网格 / 螺旋', en: 'PLA, 0.4 mm nozzle; 0.12–0.16 mm layers (crisper small features); 3 walls; 15% grid / spiral infill' },
    { zh: '大部分无需支撑；螃蟹的钳子、Qoder / ZCode 的小手底部有轻微悬垂，建议开启“树状支撑（自动）”，只在热床上生成，阈值 30° 左右', en: 'Mostly support-free; the crab claws and the little hands of Qoder / ZCode overhang slightly underneath — use auto tree supports, build plate only, threshold about 30°' },
    { zh: '多色打印会生成擦料塔，属正常现象；不想换色太多可在切片里把小件颜色合并', en: 'Multi-colour prints produce a wipe tower — that is normal; merge colours of small parts in the slicer to reduce changes' },
    { zh: '如需放大 / 缩小，在切片软件里等比缩放（建议不低于 80%，否则五官太细）', en: 'Scale uniformly in the slicer if needed (not below 80%, or the facial features get too thin)' },
  ],
};
export const VERSION_EXTRA: Partial<Record<string, Partial<Record<Ver, Note>>>> = {
  antigravity: { v1: { zh: '5 色模型；单 AMS 可把黑色换成已有颜色', en: '5-colour model; with a single AMS you can swap black for a colour you already have loaded' }, pixel: { zh: '5 色模型（黑 / 蓝 / 红 / 黄 / 绿）', en: '5-colour model (black / blue / red / yellow / green)' } },
};
