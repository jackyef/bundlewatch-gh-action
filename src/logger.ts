import chalk from 'chalk';

const stdout = console.log;
const stderr = console.error;

const debug = (error: any) => {
  if (process.env.DEBUG) {
    const debugObject = error.response ? error.response.data : error.response;
    stdout(chalk.greenBright(`[DEBUG] ${error.message}`));
    stderr(error);
    try {
      stderr(JSON.stringify(debugObject, undefined, 2));
    } catch {
      // no-op
    }
  }
};

const log = (message: string) => {
  stdout(message);
};

const info = (message: string) => {
  stdout(chalk.cyan(`[INFO] ${message}`));
};

const warn = (message: string) => {
  stdout(chalk.yellow(`[WARNING] ${message}`));
};

const error = (messsage, errorStack = undefined) => {
  if (errorStack) {
    stdout(errorStack);
  }

  stderr(chalk.red(`[ERROR] ${messsage}`));
};

const fatal = (messsage: string, errorStack) => {
  if (errorStack) {
    stdout(errorStack);
  }

  stderr(chalk.black.bgRed(`[FATAL] ${messsage}`));
};

export const logger = {
  debug,
  log,
  info,
  warn,
  error,
  fatal
};

