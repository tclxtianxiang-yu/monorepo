# Storybook 构建修复记录

**日期**: 2025-12-26
**项目**: @monorepo/web-ui & Storybook 集成

在配置独立的 Storybook 应用以开发 `@monorepo/web-ui` 组件库时，遇到了一系列构建错误。以下是详细的错误分析及修复过程。

## 1. 路径解析错误 (Path Resolution Error)

### 错误现象

Storybook 构建失败，提示找不到文件：
`ENOENT: no such file or directory, open '.../apps/packages/web-ui/src/dist/index.css'`

### 原因分析

在 `apps/storybook/.storybook/main.ts` 中配置别名（Alias）时，相对路径计算错误。
配置使用了 `path.resolve(__dirname, '../../packages/web-ui/src')`。
由于配置文件位于 `.storybook` 子目录中 (`apps/storybook/.storybook/`)，`../../` 仅回退到了 `apps/storybook/` 目录，导致解析器试图在 `apps/packages/...` 下寻找文件，该路径不存在。

### 修复方案

修正相对路径层级，增加一级回退：

```typescript
// apps/storybook/.storybook/main.ts
'@monorepo/web-ui': path.resolve(__dirname, '../../../packages/web-ui/src'),
```

同时，为了支持开发时的热重载，将 `preview.ts` 中的 CSS 引用从构建产物 `dist/index.css` 改为源码 `styles.css`。

---

## 2. 入口文件冲突 (Entry File Conflict)

### 错误现象

构建报错，提示导出缺失：
`"Button" is not exported by "../../packages/web-ui/src/index.ts"`

### 原因分析

我们重构了包，将入口从 `index.ts` (旧版) 迁移到了 `index.tsx` (React版)。
虽然别名指向了 `src` 目录，但 Storybook 的构建工具（Vite/Rollup）在解析目录索引时，优先匹配了遗留的 `index.ts` 文件。由于我们已清空该旧文件，导致找不到组件导出。

### 修复方案

修改别名配置，不再模糊指向目录，而是**显式指向新的入口文件**：

```typescript
// apps/storybook/.storybook/main.ts
'@monorepo/web-ui': path.resolve(__dirname, '../../../packages/web-ui/src/index.tsx'),
```

---

## 3. 样式文件解析错误 (Style Import Resolution Error)

### 错误现象

构建报错，提示路径不是目录：
`ENOTDIR: not a directory, open '.../packages/web-ui/src/index.tsx/styles.css'`

### 原因分析

这是一个由上一步修复引发的副作用。
我们在 `preview.ts` 中引入了 `@monorepo/web-ui/styles.css`。
由于我们将 `@monorepo/web-ui` 别名直接映射到了文件 `index.tsx`，构建工具在解析 `@monorepo/web-ui/styles.css` 时，直接将别名替换，结果变成了尝试访问 `index.tsx/styles.css`。因为 `index.tsx` 是文件不是目录，所以抛出 `ENOTDIR` 错误。

### 修复方案

添加一个**更具体**的别名规则来专门处理样式文件，并将其放在通用规则之前以确保优先匹配：

```typescript
// apps/storybook/.storybook/main.ts
alias: {
  // 优先匹配样式文件，直接指向物理路径
  '@monorepo/web-ui/styles.css': path.resolve(__dirname, '../../../packages/web-ui/src/styles.css'),
  // 其次匹配包名，指向入口文件
  '@monorepo/web-ui': path.resolve(__dirname, '../../../packages/web-ui/src/index.tsx'),
}
```

## 总结

通过精确控制别名解析策略，我们解决了 Monorepo 环境下 Storybook 对 workspace 源码引用的路径问题，成功实现了组件库的开发预览环境。
