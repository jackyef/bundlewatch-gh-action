import chalk from 'chalk';
import { STATUSES } from 'bundlewatch';
import { logger } from './logger';
import { Result } from './types';

export const prettyPrintResults = (fullResults: Result[]) => {
  logger.log('');

  fullResults.forEach((result: Result) => {
    const filePath = chalk.italic(result.filePath) + ':';

    if (result.error) {
      logger.log(`${chalk.red('ERROR')} ${filePath} ${result.error}`);
      return;
    }

    if (result.status === STATUSES.FAIL) {
      logger.log(`${chalk.redBright('FAIL')} ${filePath} ${result.message}`);
      return;
    }

    if (result.status === STATUSES.WARN) {
      logger.log(`${chalk.yellowBright('WARN')} ${filePath} ${result.message}`);
      return;
    }

    logger.log(`${chalk.greenBright('PASS')} ${filePath} ${result.message}`);
  });

  logger.log('');
};
