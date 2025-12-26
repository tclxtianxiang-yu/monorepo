# Web UI 与 Storybook 分离重构指南

本文档记录了将 UI 组件库 (`@monorepo/web-ui`) 与预览环境 (`apps/storybook`) 进行分离架构重构的设计思路、操作流程及踩坑经验。

## 1. 设计思路 (Design Philosophy)

在 Monorepo 架构中，将 UI 库与文档/预览应用分离是最佳实践，主要基于以下考量：

1.  **关注点分离 (Separation of Concerns)**:
    *   `packages/web-ui`: 专注于组件的**实现**、打包和发布。它不应该包含任何预览逻辑或文档页面。
    *   `apps/storybook`: 专注于组件的**展示**、文档编写和交互测试。它只是 UI 库的一个消费者（Consumer），就像 `web-app` 一样。

2.  **单一数据源 (Single Source of Truth)**:
    *   样式定义（Design Tokens）应当存在于 UI 库中。
    *   消费者（App, Storybook）通过 **Tailwind Presets** 继承这些样式，而不是复制配置。

3.  **构建性能**:
    *   UI 库使用 `tsup` 进行快速、轻量的库打包（生成 ESM/CJS/DTS）。
    *   Storybook 使用 `Vite` 进行快速的开发环境启动。

## 2. 操作流程 (Implementation Flow)

### 阶段一：重构 `packages/web-ui` (生产者)

1.  **清理旧代码**: 移除原有的 DOM 操作代码，引入 React 生态。
2.  **配置构建工具**:
    *   使用 `tsup` (`tsup.config.ts`) 负责打包 TypeScript 到 `dist/`。
    *   配置 `package.json` 的 `exports` 字段，明确导出入口 (`.` -> `dist/index.js`) 和 样式 (`./styles.css` -> `dist/index.css`)。
3.  **配置 Tailwind**:
    *   创建 `tailwind.config.ts` 定义核心 Theme (Colors, Spacing)。
    *   **关键点**: 该配置应设计为可被外部引用的 `preset`。
4.  **实现组件**: 使用 `cva` (class-variance-authority) 管理组件样式变体，配合 `Radix UI` (可选) 处理无障碍交互。

### 阶段二：搭建 `apps/storybook` (消费者)

1.  **初始化结构**: 创建标准的 Storybook 目录结构 (`.storybook/`, `src/stories/`)。
2.  **集成 Tailwind**:
    *   在 `apps/storybook/tailwind.config.ts` 中引入 `presets: [require('../../packages/web-ui/tailwind.config')]`。
    *   这样 Storybook 就能直接解析 UI 库定义的颜色和类名。
3.  **引入样式**: 在 `.storybook/preview.ts` 中引入全局 CSS。

### 阶段三：Monorepo 联调

1.  **依赖管理**: 在 `apps/storybook/package.json` 中声明对 UI 库的依赖：`"@monorepo/web-ui": "workspace:*"`。
2.  **构建编排**: 更新 `turbo.json`，确保 `apps/storybook` 的构建任务依赖于 `packages/web-ui` 的构建任务。

## 3. 注意事项 (Key Considerations)

*   **Tailwind Preset 的使用**: 必须确保消费者应用（App/Storybook）的 `content` 配置能扫描到 UI 库的源码（如果使用源码引入）或者 UI 库已提供编译好的 CSS。在本项目中，采用了 Preset 共享变量 + 引入编译后/源码 CSS 的混合模式。
*   **导出策略**: `package.json` 的 `exports` 字段至关重要。现代工具（Vite, Next.js）会优先读取此字段。确保包含 `types`, `import`, 和 `require`。
*   **清理环境**: 确保根目录的 `pnpm-lock.yaml` 和 `node_modules` 在重构依赖后是最新的。

## 4. 踩坑记录 (Troubleshooting & Pitfalls)

在本次重构中，主要遇到了路径解析和模块引用的问题：

### 问题 1：Storybook 无法解析组件 (`.ts` vs `.tsx` 优先级)
*   **现象**: 构建报错 `export 'Button' (imported as 'Button') was not found in .../web-ui/src/index.ts`。
*   **原因**: 原项目中遗留了一个 `src/index.ts`（空文件或旧文件），而新组件入口是 `src/index.tsx`。构建工具在解析路径时，默认优先匹配了 `.ts` 文件，导致引用了一个空文件。
*   **解决**:
    1.  **清理**: 彻底删除或清空旧的 `index.ts`。
    2.  **明确别名**: 在 Storybook 配置中强制指定路径。

### 问题 2：Monorepo 中的路径别名 (Alias)
*   **现象**: Storybook 报错找不到样式文件或组件。
*   **原因**: 在开发模式下，Storybook (基于 Vite) 并不会自动去读 `packages/web-ui/dist`（除非先 build）。我们希望它直接读取 `src` 源码以支持热更新。
*   **解决**: 修改 `.storybook/main.ts` 中的 `viteFinal` 配置，手动添加别名映射：
    ```typescript
    alias: {
      '@monorepo/web-ui/styles.css': path.resolve(__dirname, '../../../packages/web-ui/src/styles.css'),
      '@monorepo/web-ui': path.resolve(__dirname, '../../../packages/web-ui/src/index.tsx'),
    }
    ```
    这告诉 Vite：当看到 `@monorepo/web-ui` 时，不要去管 `node_modules`，直接去读源码。

### 问题 3：样式文件导入错误 (`ENOENT` / `ENOTDIR`)
*   **现象**: `Could not load .../index.tsx/styles.css`。
*   **原因**: 别名配置不当导致解析器把目录当成了文件前缀。
*   **解决**: 为样式文件单独配置一条精确匹配的别名规则（如上所示），优先级高于通配符或包名规则。

---

*生成时间: 2025-12-26*
