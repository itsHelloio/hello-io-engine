---
summary: "Uninstall HelloIo completely (CLI, service, state, workspace)"
read_when:
  - You want to remove HelloIo from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `hello-io` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
hello-io uninstall
```

Non-interactive (automation / npx):

```bash
hello-io uninstall --all --yes --non-interactive
npx -y hello-io uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
hello-io gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
hello-io gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${HELLO_IO_STATE_DIR:-$HOME/.hello-io}"
```

If you set `HELLO_IO_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.hello-io/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g hello-io
pnpm remove -g hello-io
bun remove -g hello-io
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/HelloIo.app
```

Notes:

- If you used profiles (`--profile` / `HELLO_IO_PROFILE`), repeat step 3 for each state dir (defaults are `~/.hello-io-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `hello-io` is missing.

### macOS (launchd)

Default label is `ai.hello-io.gateway` (or `ai.hello-io.<profile>`; legacy `com.hello-io.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.hello-io.gateway
rm -f ~/Library/LaunchAgents/ai.hello-io.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.hello-io.<profile>`. Remove any legacy `com.hello-io.*` plists if present.

### Linux (systemd user unit)

Default unit name is `hello-io-gateway.service` (or `hello-io-gateway-<profile>.service`):

```bash
systemctl --user disable --now hello-io-gateway.service
rm -f ~/.config/systemd/user/hello-io-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `HelloIo Gateway` (or `HelloIo Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "HelloIo Gateway"
Remove-Item -Force "$env:USERPROFILE\.hello-io\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.hello-io-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://hello-io.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g hello-io@latest`.
Remove it with `npm rm -g hello-io` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `hello-io ...` / `bun run hello-io ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
