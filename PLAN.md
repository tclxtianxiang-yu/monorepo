# 重构 @monorepo/web-ui: React + Storybook + Radix UI + Tailwind CSS

## 项目概述

将 `@monorepo/web-ui` 从 DOM 工厂函数重构为现代化 React 组件库，使用 Radix UI 原语和 Tailwind CSS。同时创建独立的 Storybook 应用用于组件开发和文档。

**关键变更**:

- 版本: v0.1.0 → v1.0.0 (Breaking change)
- 技术栈: Vanilla JS/CSS → React + Radix UI + Tailwind CSS
- 构建工具: `tsc` → `tsup` (支持 JSX)
- 新增: `apps/storybook` 独立应用
- API: DOM 工厂 → React 组件 (forwardRef + Radix Slot)

## 核心决策

1. **独立发布包** - 继续发布到 Verdaccio，作为可复用的 React 组件库
2. **Storybook 独立应用** - 在 `apps/storybook` 创建，与组件库分离
3. **不保持向后兼容** - 完全重写为 React 组件，移除旧的 DOM API
4. **全面使用 Radix UI** - 即使简单组件也使用 Radix Slot、Primitive 等

## 当前状态分析

### 现有 web-ui 包 (v0.1.0)

- **位置**: `/packages/web-ui`
- **实现**: DOM 工厂函数 (createButton, createInput, createCard)
- **样式**: 嵌入 CSS 字符串，运行时注入
- **依赖**: 零运行时依赖
- **构建**: 简单的 `tsc` 编译到 `dist/`

### 设计令牌 (需优化)

```css
--web-ui-bg: #f8f5ef
--web-ui-ink: #222222
--web-ui-ink-muted: #5c5c5c
--web-ui-accent: #1b7f5c
--web-ui-accent-strong: #136246
--web-ui-surface: #ffffff
--web-ui-border: #d6cfc2
--web-ui-shadow: 0 6px 18px rgba(17, 17, 17, 0.12)
--web-ui-radius: 12px
```

## 实施步骤

### 阶段 1: web-ui 包基础设施重构

#### 1.1 更新 package.json

**文件**: `/packages/web-ui/package.json`

关键变更:

- 版本号更新为 `1.0.0`
- 添加 peer dependencies: `react@^18.0.0 || ^19.0.0`, `react-dom`
- 添加 dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`
- 添加 dev dependencies: `tsup`, `tailwindcss`, `autoprefixer`, `postcss`
- 更新 scripts: `build: "tsup && pnpm run build:css"`, `build:css: "tailwindcss -i ./src/styles.css -o ./dist/index.css --minify"`
- 导出 CSS: `exports: { ".": {...}, "./styles.css": "./dist/index.css" }`

#### 1.2 创建构建配置

**tsup.config.ts**:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
  onSuccess: 'pnpm run build:css',
});
```

**tsconfig.json** 更新:

- 添加 `jsx: "react-jsx"`
- 添加 `moduleResolution: "bundler"`
- 保持 `strict: true`

**tailwind.config.ts**:

```typescript
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { 'web-ui': { /* 设计令牌 */ } },
      boxShadow: { 'web-ui': '...' },
      borderRadius: { 'web-ui': '12px', 'web-ui-card': '18px' },
      // ... 其他令牌
    },
  },
};
```

**postcss.config.mjs**: 标准 Tailwind + Autoprefixer 配置

**src/styles.css**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 阶段 2: React 组件实现

#### 2.1 工具函数

**文件**: `/packages/web-ui/src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 2.2 Button 组件 ⭐ 核心模式

**文件**: `/packages/web-ui/src/components/Button.tsx`

关键特性:

- 使用 `@radix-ui/react-slot` 实现 `asChild` 模式
- 使用 `class-variance-authority` (CVA) 管理变体
- 支持 `forwardRef`
- 变体: `primary`, `ghost`, `outline`
- 尺寸: `sm`, `default`, `lg`
- 保留原始 hover 效果 (`translateY(-1px)`)

```typescript
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans text-sm...',
  {
    variants: {
      variant: { primary: '...', ghost: '...', outline: '...' },
      size: { sm: '...', default: '...', lg: '...' },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} {...props} />;
  }
);
```

#### 2.3 Input 组件

**文件**: `/packages/web-ui/src/components/Input.tsx`

- 简单的 `forwardRef` 包装
- Tailwind 样式匹配原始设计
- Focus ring: `ring-[3px] ring-web-ui-accent/15`
- 支持所有原生 input props

#### 2.4 Card 组件（可组合）

**文件**: `/packages/web-ui/src/components/Card.tsx`

导出组件:

- `Card` - 主容器
- `CardHeader` - 头部区域
- `CardTitle` - 标题 (h2)
- `CardDescription` - 副标题
- `CardBody` - 内容区域
- `CardFooter` - 底部区域

所有组件使用 `forwardRef`，支持 `className` 扩展。

#### 2.5 入口文件

**文件**: `/packages/web-ui/src/index.tsx`

```typescript
// Components
export { Button, buttonVariants } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from './components/Card';

// Utilities
export { cn } from './lib/utils';
```

### 阶段 3: Storybook 应用创建

#### 3.1 初始化 apps/storybook

目录结构:

```
apps/storybook/
├── .storybook/
│   ├── main.ts           # Storybook 配置
│   ├── preview.ts        # 全局装饰器和参数
│   └── preview-head.html # 字体加载
├── src/
│   └── stories/
│       ├── Button.stories.tsx
│       ├── Input.stories.tsx
│       └── Card.stories.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── postcss.config.mjs
```

#### 3.2 package.json

**文件**: `/apps/storybook/package.json`

- `dependencies`: `@monorepo/web-ui: workspace:*`, `react@^19`, `react-dom@^19`
- `devDependencies`: Storybook 8.x, Tailwind CSS, TypeScript
- Scripts: `dev: "storybook dev -p 6006"`, `build: "storybook build"`

#### 3.3 Storybook 配置

**文件**: `/apps/storybook/.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', ...],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: { '@monorepo/web-ui': '/../../packages/web-ui/src' },
      },
    });
  },
};
```

**文件**: `/apps/storybook/.storybook/preview.ts`

```typescript
import '@monorepo/web-ui/dist/index.css';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'web-ui',
      values: [{ name: 'web-ui', value: '#f8f5ef' }],
    },
  },
};
```

**文件**: `/apps/storybook/.storybook/preview-head.html`

加载 Space Grotesk 字体。

#### 3.4 Tailwind 配置

**文件**: `/apps/storybook/tailwind.config.ts`

```typescript
import webUiConfig from '../../packages/web-ui/tailwind.config';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/web-ui/src/**/*.{ts,tsx}',
  ],
  presets: [webUiConfig],
};
```

### 阶段 4: 编写 Storybook Stories

#### 4.1 Button Stories

**文件**: `/apps/storybook/src/stories/Button.stories.tsx`

Stories:

- Primary, Ghost, Outline (变体)
- Disabled (禁用状态)
- AsChild (演示 Radix Slot 用法)
- AllVariants (所有变体对比)

#### 4.2 Input Stories

**文件**: `/apps/storybook/src/stories/Input.stories.tsx`

Stories:

- Default, Email, Password, Search (类型)
- WithValue (预填值)
- Disabled (禁用)
- WithLabel (带标签示例)

#### 4.3 Card Stories

**文件**: `/apps/storybook/src/stories/Card.stories.tsx`

Stories:

- Default (基础卡片)
- WithFooter (完整卡片)
- LoginForm (真实场景：登录表单)
- Minimal (最小化卡片)

### 阶段 5: Monorepo 集成

#### 5.1 更新 turbo.json

**文件**: `/turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "storybook-static/**", "!.next/cache/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "storybook": {
      "cache": false,
      "persistent": true,
      "dependsOn": ["^build"]
    },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    },
    "test": { "outputs": [] },
    "lint": { "outputs": [] }
  }
}
```

关键点:

- 新增 `storybook` 任务（dev 模式）
- 新增 `build-storybook` 任务（静态构建）
- 都依赖 `^build` 确保 web-ui 先构建

#### 5.2 根 package.json（可选）

添加便捷脚本:

```json
{
  "scripts": {
    "storybook": "turbo run storybook --filter=storybook",
    "build-storybook": "turbo run build-storybook --filter=storybook"
  }
}
```

### 阶段 6: 文档与迁移指南

#### 6.1 创建迁移指南

**文件**: `/packages/web-ui/MIGRATION.md`

内容包括:

- Breaking changes 说明
- API 变更对照表
- 代码迁移示例
- 分步迁移指导
- 常见问题解决

#### 6.2 更新 README

**文件**: `/packages/web-ui/README.md`

- 安装说明
- 快速开始
- 组件 API 文档
- Tailwind 主题配置
- Storybook 链接

## 关键文件路径

### web-ui 包（需创建/修改）

1. `/packages/web-ui/package.json` - 依赖和构建脚本
2. `/packages/web-ui/tsup.config.ts` - 构建配置
3. `/packages/web-ui/tailwind.config.ts` - Tailwind 主题
4. `/packages/web-ui/src/lib/utils.ts` - cn 工具函数
5. `/packages/web-ui/src/components/Button.tsx` - Button 组件
6. `/packages/web-ui/src/components/Input.tsx` - Input 组件
7. `/packages/web-ui/src/components/Card.tsx` - Card 组件
8. `/packages/web-ui/src/index.tsx` - 入口文件
9. `/packages/web-ui/src/styles.css` - Tailwind 入口
10. `/packages/web-ui/MIGRATION.md` - 迁移指南

### Storybook 应用（全新创建）

1. `/apps/storybook/package.json`
2. `/apps/storybook/.storybook/main.ts`
3. `/apps/storybook/.storybook/preview.ts`
4. `/apps/storybook/.storybook/preview-head.html`
5. `/apps/storybook/tailwind.config.ts`
6. `/apps/storybook/tsconfig.json`
7. `/apps/storybook/src/stories/Button.stories.tsx`
8. `/apps/storybook/src/stories/Input.stories.tsx`
9. `/apps/storybook/src/stories/Card.stories.tsx`

### Monorepo 配置

1. `/turbo.json` - 添加 Storybook 任务

## 依赖清单

### packages/web-ui

**Peer Dependencies**:

- `react@^18.0.0 || ^19.0.0`
- `react-dom@^18.0.0 || ^19.0.0`

**Dependencies**:

- `@radix-ui/react-slot@^1.1.1`
- `class-variance-authority@^0.7.1`
- `clsx@^2.1.1`
- `tailwind-merge@^2.6.0`

**Dev Dependencies**:

- `tsup@^8.3.5`
- `tailwindcss@^3.4.17`
- `autoprefixer@^10.4.20`
- `postcss@^8.4.49`
- `typescript@^5.7.2`
- `react@^19.0.0` (dev only)
- `react-dom@^19.0.0` (dev only)

### apps/storybook

**Dependencies**:

- `@monorepo/web-ui@workspace:*`
- `react@^19.0.0`
- `react-dom@^19.0.0`

**Dev Dependencies**:

- `@storybook/react-vite@^8.5.0`
- `@storybook/addon-essentials@^8.5.0`
- `storybook@^8.5.0`
- `vite@^6.0.0`
- `tailwindcss@^3.4.17`
- `typescript@^5.7.2`

## 执行顺序

1. **重构 web-ui 包** (2 小时)
   - 更新 package.json 和构建配置
   - 安装依赖: `cd packages/web-ui && pnpm install`
   - 创建工具函数和组件
   - 测试构建: `pnpm build`

2. **创建 Storybook 应用** (1.5 小时)
   - 创建目录结构
   - 配置 Storybook
   - 安装依赖: `cd apps/storybook && pnpm install`
   - 编写 stories
   - 测试运行: `pnpm dev`

3. **更新 monorepo** (30 分钟)
   - 更新 turbo.json
   - 测试构建流程: `turbo run build`
   - 测试 Storybook: `turbo run storybook`

4. **文档和发布** (1 小时)
   - 编写 MIGRATION.md
   - 更新 README.md
   - 创建 changeset (Major)
   - 版本升级: `pnpm version-packages`
   - 发布: `pnpm publish-packages`

**总时间**: 约 5 小时

## 验证清单

- [ ] web-ui 构建成功 (`pnpm build`)
- [ ] 生成 `dist/index.js`, `dist/index.d.ts`, `dist/index.css`
- [ ] TypeScript 类型正确 (`pnpm lint`)
- [ ] Storybook 启动成功 (`pnpm dev`)
- [ ] 所有 stories 正确渲染
- [ ] Button hover 效果正常 (translateY)
- [ ] Input focus ring 正常 (3px, 15% opacity)
- [ ] Card 阴影和圆角匹配原设计
- [ ] asChild 模式工作正常
- [ ] Tailwind 类正确应用
- [ ] Space Grotesk 字体加载
- [ ] 可以发布到 Verdaccio
- [ ] 文档完整 (README, MIGRATION)

## 潜在问题与解决方案

### 1. Storybook 无法解析 @monorepo/web-ui

**原因**: workspace 依赖未构建
**解决**: 确保 `turbo.json` 中 storybook 任务依赖 `^build`

### 2. Tailwind 类在 Storybook 中不生效

**原因**: Tailwind 未扫描 web-ui 包
**解决**: 在 `apps/storybook/tailwind.config.ts` 的 `content` 中添加 `'../../packages/web-ui/src/**/*.{ts,tsx}'`

### 3. TypeScript 找不到 @monorepo/web-ui 类型

**原因**: 包未构建或 exports 配置错误
**解决**: 验证 `package.json` 中的 `types` 和 `exports` 字段

### 4. Space Grotesk 字体不加载

**原因**: 字体链接缺失
**解决**: 在 `apps/storybook/.storybook/preview-head.html` 中添加 Google Fonts 链接

## 设计决策说明

### 为何选择 tsup 而非 tsc?

- 零配置 JSX 转换
- 内置打包和 tree-shaking
- CSS 处理集成
- 更快的构建速度（esbuild）

### 为何使用 CVA (Class Variance Authority)?

- 类型安全的变体管理
- 符合 shadcn/ui 行业标准
- IDE 自动补全支持
- 比手动 clsx 更清晰

### 为何 Storybook 独立而非在 web-ui 内?

- 关注点分离（开发 vs 库）
- 避免污染包的 devDependencies
- 更容易独立版本管理
- 符合 monorepo 最佳实践

### 为何导出 Tailwind config?

- 消费者可扩展设计令牌
- 确保跨项目一致性
- JIT 模式需要扫描包组件

### CSS 分发策略

选择分发原始 Tailwind（而非内联 CSS-in-JS）因为:

- 最小化打包体积（JIT tree-shaking）
- 最大化定制灵活性
- 消费者已有 Tailwind（web-app）
- 最佳性能
