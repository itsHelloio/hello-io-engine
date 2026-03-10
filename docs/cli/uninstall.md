---
summary: "CLI reference for `hello-io uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `hello-io uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
hello-io backup create
hello-io uninstall
hello-io uninstall --all --yes
hello-io uninstall --dry-run
```

Run `hello-io backup create` first if you want a restorable snapshot before removing state or workspaces.
