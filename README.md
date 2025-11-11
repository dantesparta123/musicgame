# Edugame (Next.js 最小项目)

这是一个使用 Next.js App Router 的最小骨架：

- 入口：`app/page.js`
- 全局布局：`app/layout.js`
- 配置：`next.config.js`
- 依赖：`next`、`react`、`react-dom`

你可以直接开始在 `app/` 下新增页面与组件。

## 已集成 shadcn/ui

- 已添加依赖：`class-variance-authority`、`clsx`、`tailwind-merge`、`lucide-react`
- 已配置 Tailwind：`tailwind.config.js`、`postcss.config.js`、`app/globals.css`
- 提供基础组件：`components/ui/button.js`
- 路径别名：`@/*`（见 `jsconfig.json`）

在页面或组件中直接使用 `Button` 示例：

```jsx
import { Button } from "@/components/ui/button";

export default function Example() {
  return <Button variant="outline">Hello</Button>;
}
```

> 如需我提供“如何运行/构建”的命令行版本，请告诉我当前 Node 包管理器（npm/yarn/pnpm），我会给出最短步骤并保持简洁。


