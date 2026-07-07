# COC车卡工具（拆分版）

面向中文 COC 玩家、手机端优先的轻量车卡工具。当前阶段仍然是本地单页网页原型：不接服务器、不接 AI、不做账号系统。

## 文件结构

```text
index.html                页面结构与脚本加载顺序
css/styles.css            全局样式与响应式布局
data/occupations.js       职业数据库，由 Excel 职业列表转换
data/skills.js            技能数据库，由 Excel 技能表转换
js/app.js                 初始化入口
js/state.js               全局状态、常量、通用工具函数
js/storage.js             localStorage 保存/恢复与防抖写入
js/router.js              步骤切换与顶部进度
js/profile.js             基础信息与职业匹配
js/attributes.js          属性购点、随机属性、次要属性计算
js/skills.js              技能加点、职业联动、排序筛选与统计
js/background-items.js    背景、物品与资产计算
js/images.js              头像立绘、自定义图片与角色生成页摘要
js/preview.js             档案预览浮窗与按需渲染
js/notes.js               备忘笔记浮窗
js/modal.js               通用弹窗逻辑
docs/codex-refactor-prompt.md  交给 Codex 继续重构优化的提示词
AGENTS.md                 给 Codex 的项目长期约束
```

## 当前功能

- 基础信息
- 属性购点
- 技能加点
- 背景&物品
- 头像立绘
- 角色生成
- 备忘笔记浮窗
- 档案预览浮窗
- localStorage 本地保存

## 运行方式

直接打开 `index.html` 即可。

建议后续继续补齐角色生成后的查看与整理体验，再回头优化前面页面。

