export const HELLO_IO_CLI_ENV_VAR = "HELLO_IO_CLI";
export const HELLO_IO_CLI_ENV_VALUE = "1";

export function markHelloIoExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [HELLO_IO_CLI_ENV_VAR]: HELLO_IO_CLI_ENV_VALUE,
  };
}

export function ensureHelloIoExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[HELLO_IO_CLI_ENV_VAR] = HELLO_IO_CLI_ENV_VALUE;
  return env;
}
