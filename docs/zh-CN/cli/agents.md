---
read_when:
  - 你需要多个隔离的智能体（工作区 + 路由 + 认证）
summary: "`hello-io agents` 的 CLI 参考（列出/添加/删除/设置身份）"
title: agents
x-i18n:
  generated_at: "2026-02-01T19:58:38Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 30556d81636a9ad8972573cc6b498e620fd266e1dfb16eef3f61096ea62f9896
  source_path: cli/agents.md
  workflow: 14
---

# `hello-io agents`

管理隔离的智能体（工作区 + 认证 + 路由）。

相关内容：

- 多智能体路由：[多智能体路由](/concepts/multi-agent)
- 智能体工作区：[智能体工作区](/concepts/agent-workspace)

## 示例

```bash
hello-io agents list
hello-io agents add work --workspace ~/.hello-io/workspace-work
hello-io agents set-identity --workspace ~/.hello-io/workspace --from-identity
hello-io agents set-identity --agent main --avatar avatars/hello-io.png
hello-io agents delete work
```

## 身份文件

每个智能体工作区可以在工作区根目录包含一个 `IDENTITY.md`：

- 示例路径：`~/.hello-io/workspace/IDENTITY.md`
- `set-identity --from-identity` 从工作区根目录读取（或从显式指定的 `--identity-file` 读取）

头像路径相对于工作区根目录解析。

## 设置身份

`set-identity` 将字段写入 `agents.list[].identity`：

- `name`
- `theme`
- `emoji`
- `avatar`（工作区相对路径、http(s) URL 或 data URI）

从 `IDENTITY.md` 加载：

```bash
hello-io agents set-identity --workspace ~/.hello-io/workspace --from-identity
```

显式覆盖字段：

```bash
hello-io agents set-identity --agent main --name "HelloIo" --emoji "🦞" --avatar avatars/hello-io.png
```

配置示例：

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "HelloIo",
          theme: "space lobster",
          emoji: "🦞",
          avatar: "avatars/hello-io.png",
        },
      },
    ],
  },
}
```
