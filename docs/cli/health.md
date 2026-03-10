---
summary: "CLI reference for `hello-io health` (gateway health endpoint via RPC)"
read_when:
  - You want to quickly check the running Gateway’s health
title: "health"
---

# `hello-io health`

Fetch health from the running Gateway.

```bash
hello-io health
hello-io health --json
hello-io health --verbose
```

Notes:

- `--verbose` runs live probes and prints per-account timings when multiple accounts are configured.
- Output includes per-agent session stores when multiple agents are configured.
