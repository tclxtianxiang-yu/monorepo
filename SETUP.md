# 项目从 0 到现在的搭建流程（细化版，含关键配置含义）

> 说明：以下流程按当前仓库结构与配置逆向整理，目标是“从空目录搭到现在这个状态”，并解释每条关键配置的含义与作用。

## 1. 初始化仓库与 monorepo 基础
### 1.1 创建仓库
```bash
mkdir monorepo
cd monorepo
pnpm init
```

### 1.2 根 `package.json` 关键配置
```json
{
  "private": true,
  "packageManager": "pnpm@10.23.0",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "storybook": "turbo run storybook",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "publish-packages": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.29.8",
    "turbo": "^2.7.2"
  }
}
```
关键点说明：
- `private: true`：避免根包被误发布；monorepo 根通常不发布。
- `packageManager`：锁定 pnpm 版本，保证团队环境一致。
- `turbo run <task>`：统一从根执行各包任务，按依赖拓扑并行/缓存。
- `changeset` 相关脚本：用于版本管理与发布流程（见第 6 节）。

### 1.3 pnpm workspace
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```
关键点说明：
- 声明工作区范围，pnpm 会把这些目录视为 workspace。
- `apps/*` 用于应用，`packages/*` 用于可复用库。

## 2. Turbo 配置与含义
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "storybook-static/**", "!.next/cache/**"]
    },
    "lint": { "dependsOn": ["^lint"] },
    "dev": { "cache": false, "persistent": true },
    "storybook": { "cache": false, "persistent": true, "dependsOn": ["^build"] },
    "build-storybook": {
      "dependsOn": ["^build"],
      "outputs": ["storybook-static/**"]
    }
  }
}
```
关键点说明：
- `globalDependencies`：当本地环境变量文件变化时，触发相关任务重新执行。
- `dependsOn: ["^build"]`：当前包 `build` 依赖其上游依赖的 `build`，保证构建顺序正确。
- `outputs`：声明构建产物，Turbo 用于缓存与命中判断。
- `dev`/`storybook`：`persistent: true` 表示常驻进程；`cache: false` 避免缓存影响。
- `storybook` 依赖 `^build`：确保组件库先构建，Storybook 再启动。

## 3. 创建 Next.js 应用（apps/web-app）
```bash
pnpm dlx create-next-app@latest apps/web-app \
  --ts --tailwind --eslint --app --src-dir false --import-alias "@/*"
```
关键点说明：
- `--app` 使用 App Router。
- `--tailwind` 自动生成 Tailwind 配置与 `globals.css`。
- `--src-dir false` 与当前目录结构匹配。

### 3.1 `apps/web-app/package.json` 关键配置
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@monorepo/hello-world": "workspace:*",
    "@monorepo/web-ui": "workspace:*"
  }
}
```
关键点说明：
- `workspace:*`：使用本地 workspace 包，避免发布后再安装。
- `next lint`：使用 Next.js 默认 ESLint 规则集。

### 3.2 Tailwind 配置的关键点（应用侧）
此项目使用 Next.js 默认 Tailwind 初始化，关键配置包括：
- `content`：扫描 `app/` 与 `components/` 等目录，确保类名被收集。
- `theme`：可扩展设计 token（颜色、字体、间距等）。
- `plugins`：按需引入。

典型示例（与实际文件结构一致时）：
```ts
// apps/web-app/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
```

## 4. 创建工具库（packages/hello-world）
### 4.1 `package.json` 关键配置
```json
{
  "name": "@monorepo/hello-world",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "files": ["dist"],
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```
关键点说明：
- `type: "module"`：输出 ESM。
- `main`/`types` 指向 `dist`：配合 `tsc` 输出。
- `prepublishOnly`：发布前强制构建，避免发未编译产物。
- `publishConfig.registry`：指向本地 registry（例如 verdaccio）。

### 4.2 `tsconfig.json` 关键配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src"]
}
```
关键点说明：
- `declaration: true`：生成类型声明供应用端使用。
- `outDir`/`rootDir`：固定输出路径，便于 `main`/`types` 指向。

## 5. 创建 UI 组件库（packages/web-ui）
### 5.1 `package.json` 关键配置
```json
{
  "name": "@monorepo/web-ui",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./styles.css": "./dist/index.css"
  },
  "scripts": {
    "build": "tsup && pnpm run build:css",
    "build:css": "tailwindcss -i ./src/styles.css -o ./dist/index.css --minify",
    "lint": "tsc",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```
关键点说明：
- `exports` 同时暴露 JS/类型 与 CSS 入口，确保应用可直接引入样式。
- `tsup` 负责打包 TS/TSX 代码；`tailwindcss` 单独输出样式文件。
- `peerDependencies` 避免重复安装 React，确保宿主应用统一 React 版本。

### 5.2 组件库的 Tailwind 生成与样式隔离
组件库使用独立 `src/styles.css` 作为 Tailwind 输入：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
通过脚本输出到 `dist/index.css`，并在 `exports` 中暴露 `./styles.css`。

意义：
- UI 库样式与应用样式解耦，可按需引入。
- 应用侧只需 `import '@monorepo/web-ui/styles.css'`。

## 6. Storybook 与 web-ui 的“库-UI 分离”
### 6.1 Storybook 的定位
Storybook 用于 **展示/验证 UI 组件库**，应与业务应用（web-app）解耦。

### 6.2 与 Turbo 的集成方式
在 `turbo.json`：
- `storybook` 任务设置为 `persistent`，避免退出。
- `storybook` 依赖 `^build`，确保组件库可被加载。
- `build-storybook` 产出 `storybook-static/**`，纳入缓存与产物。

### 6.3 典型工作流（概念说明）
1) 组件库 `packages/web-ui` 提供组件与样式。
2) Storybook 在 `packages/web-ui` 内读取组件故事文件。
3) 通过 `turbo run storybook` 统一启动，可自动处理依赖顺序。

## 7. monorepo 管理与 Turbo + Changeset 的集成
### 7.1 Turbo 负责“执行层”
- 统一执行 `build/dev/lint/test/storybook`。
- 根据依赖关系决定顺序与并行。
- 使用缓存提升多包构建速度。

### 7.2 Changeset 负责“版本与发布层”
根脚本：
- `changeset`：生成变更描述。
- `changeset version`：根据变更生成版本号与 changelog。
- `changeset publish`：发布到 registry。

集成方式：
- Turbo 负责构建产物（`prepublishOnly` 也保证发布前构建）。
- Changeset 负责版本管理与发布流程。

## 8. 依赖联动与应用集成
在 `apps/web-app/package.json` 通过 `workspace:*` 引入本地库：
```json
{
  "dependencies": {
    "@monorepo/hello-world": "workspace:*",
    "@monorepo/web-ui": "workspace:*"
  }
}
```
应用内使用：
```tsx
import '@monorepo/web-ui/styles.css';
import { Button } from '@monorepo/web-ui';
import { countdown } from '@monorepo/hello-world';
```

意义：
- 应用直接消费本地包，无需发布。
- Turbo 会保证依赖包先构建。

## 9. 开发与构建命令总结
```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm storybook
```

## 10. 发布到本地 registry（可选）
```bash
cd packages/hello-world
pnpm publish

cd packages/web-ui
pnpm publish
```
确保本地 registry（如 verdaccio）已启动，且 `publishConfig.registry` 指向正确地址。
