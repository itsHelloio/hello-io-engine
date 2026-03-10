---
summary: "CLI reference for `hello-io reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `hello-io reset`

Reset local config/state (keeps the CLI installed).

```bash
hello-io backup create
hello-io reset
hello-io reset --dry-run
hello-io reset --scope config+creds+sessions --yes --non-interactive
```

Run `hello-io backup create` first if you want a restorable snapshot before removing local state.
