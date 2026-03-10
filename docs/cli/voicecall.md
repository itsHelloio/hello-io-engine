---
summary: "CLI reference for `hello-io voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `hello-io voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
hello-io voicecall status --call-id <id>
hello-io voicecall call --to "+15555550123" --message "Hello" --mode notify
hello-io voicecall continue --call-id <id> --message "Any questions?"
hello-io voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
hello-io voicecall expose --mode serve
hello-io voicecall expose --mode funnel
hello-io voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
