---
summary: "CLI reference for `hello-io doctor` (health checks + guided repairs)"
read_when:
  - You have connectivity/auth issues and want guided fixes
  - You updated and want a sanity check
title: "doctor"
---

# `hello-io doctor`

Health checks + quick fixes for the gateway and channels.

Related:

- Troubleshooting: [Troubleshooting](/gateway/troubleshooting)
- Security audit: [Security](/gateway/security)

## Examples

```bash
hello-io doctor
hello-io doctor --repair
hello-io doctor --deep
```

Notes:

- Interactive prompts (like keychain/OAuth fixes) only run when stdin is a TTY and `--non-interactive` is **not** set. Headless runs (cron, Telegram, no terminal) will skip prompts.
- `--fix` (alias for `--repair`) writes a backup to `~/.hello-io/hello-io.json.bak` and drops unknown config keys, listing each removal.
- State integrity checks now detect orphan transcript files in the sessions directory and can archive them as `.deleted.<timestamp>` to reclaim space safely.
- Doctor also scans `~/.hello-io/cron/jobs.json` (or `cron.store`) for legacy cron job shapes and can rewrite them in place before the scheduler has to auto-normalize them at runtime.
- Doctor includes a memory-search readiness check and can recommend `hello-io configure --section model` when embedding credentials are missing.
- If sandbox mode is enabled but Docker is unavailable, doctor reports a high-signal warning with remediation (`install Docker` or `hello-io config set agents.defaults.sandbox.mode off`).

## macOS: `launchctl` env overrides

If you previously ran `launchctl setenv HELLO_IO_GATEWAY_TOKEN ...` (or `...PASSWORD`), that value overrides your config file and can cause persistent “unauthorized” errors.

```bash
launchctl getenv HELLO_IO_GATEWAY_TOKEN
launchctl getenv HELLO_IO_GATEWAY_PASSWORD

launchctl unsetenv HELLO_IO_GATEWAY_TOKEN
launchctl unsetenv HELLO_IO_GATEWAY_PASSWORD
```
