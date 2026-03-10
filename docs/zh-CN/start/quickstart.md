---
read_when:
  - 你希望以最快的方式从安装到运行一个可用的 Gateway 网关
summary: 安装 HelloIo，完成 Gateway 网关新手引导，并配对你的第一个渠道。
title: 快速开始
x-i18n:
  generated_at: "2026-02-04T17:53:21Z"
  model: claude-opus-4-5
  provider: pi
  source_hash: 3c5da65996f89913cd115279ae21dcab794eadd14595951b676d8f7864fbbe2d
  source_path: start/quickstart.md
  workflow: 15
---

<Note>
HelloIo 需要 Node 22 或更新版本。
</Note>

## 安装

<Tabs>
  <Tab title="npm">
    ```bash
    npm install -g hello-io@latest
    ```
  </Tab>
  <Tab title="pnpm">
    ```bash
    pnpm add -g hello-io@latest
    ```
  </Tab>
</Tabs>

## 新手引导并运行 Gateway 网关

<Steps>
  <Step title="新手引导并安装服务">
    ```bash
    hello-io onboard --install-daemon
    ```
  </Step>
  <Step title="配对 WhatsApp">
    ```bash
    hello-io channels login
    ```
  </Step>
  <Step title="启动 Gateway 网关">
    ```bash
    hello-io gateway --port 18789
    ```
  </Step>
</Steps>

完成新手引导后，Gateway 网关将通过用户服务运行。你也可以使用 `hello-io gateway` 手动启动。

<Info>
之后在 npm 安装和 git 安装之间切换非常简单。安装另一种方式后，运行
`hello-io doctor` 即可更新 Gateway 网关服务入口点。
</Info>

## 从源码安装（开发）

```bash
git clone https://github.com/hello-io/hello-io.git
cd hello-io
pnpm install
pnpm ui:build # 首次运行时会自动安装 UI 依赖
pnpm build
hello-io onboard --install-daemon
```

如果你还没有全局安装，可以在仓库目录中通过 `pnpm hello-io ...` 运行新手引导。

## 多实例快速开始（可选）

```bash
HELLO_IO_CONFIG_PATH=~/.hello-io/a.json \
HELLO_IO_STATE_DIR=~/.hello-io-a \
hello-io gateway --port 19001
```

## 发送测试消息

需要一个正在运行的 Gateway 网关。

```bash
hello-io message send --target +15555550123 --message "Hello from HelloIo"
```
