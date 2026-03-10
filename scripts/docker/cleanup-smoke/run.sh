#!/usr/bin/env bash
set -euo pipefail

cd /repo

export HELLO_IO_STATE_DIR="/tmp/hello-io-test"
export HELLO_IO_CONFIG_PATH="${HELLO_IO_STATE_DIR}/hello-io.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${HELLO_IO_STATE_DIR}/credentials"
mkdir -p "${HELLO_IO_STATE_DIR}/agents/main/sessions"
echo '{}' >"${HELLO_IO_CONFIG_PATH}"
echo 'creds' >"${HELLO_IO_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${HELLO_IO_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm hello-io reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${HELLO_IO_CONFIG_PATH}"
test ! -d "${HELLO_IO_STATE_DIR}/credentials"
test ! -d "${HELLO_IO_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${HELLO_IO_STATE_DIR}/credentials"
echo '{}' >"${HELLO_IO_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm hello-io uninstall --state --yes --non-interactive

test ! -d "${HELLO_IO_STATE_DIR}"

echo "OK"
