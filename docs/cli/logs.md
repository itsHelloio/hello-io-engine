---
summary: "CLI reference for `hello-io logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
title: "logs"
---

# `hello-io logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
hello-io logs
hello-io logs --follow
hello-io logs --json
hello-io logs --limit 500
hello-io logs --local-time
hello-io logs --follow --local-time
```

Use `--local-time` to render timestamps in your local timezone.
