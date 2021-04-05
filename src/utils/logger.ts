import { Config } from '@constants';
import Store from '@redux/store';

const logTypes = ['critical', 'error', 'warning', 'info', 'http', 'verbose', 'debug'] as const;

const logObj = (data: object) => {
  const properties = Object.getOwnPropertyNames(data);
  // Find how many properties fit withing 20 characters
  let charCount = 0;
  let propertyIndex = 0;

  for (let i = 0; i < properties.length; i++) {
    charCount += properties[i].length;
    if (charCount >= 20) {
      break;
    }
    propertyIndex = i;
  }

  const display = properties.slice(0, propertyIndex + 1);
  const rest = properties.slice(propertyIndex + 1);

  let str = `{ ${display.join(', ')}`;
  if (rest.length !== 0) {
    str += ` + ${rest.length} }`;
  } else {
    str += ' }';
  }
  return str;
};

export type LogLevel = typeof logTypes[number];

type ConfigureType = {
  level: LogLevel;
};

type HTTPLog = {
  status?: number;
  params?: { [key: string]: any };
  data?: object;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  endpoint: string;
  sent?: boolean;
};

class Logger {
  level: LogLevel;

  constructor({ level }: ConfigureType) {
    if (!logTypes.includes(level)) {
      console.error(`Incorrect logger level ${level}`);
    }
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    return (
      logTypes.indexOf(level) <= logTypes.indexOf(this.level) &&
      !Config.logger.exclude.includes(level)
    );
  }

  critical(...msgs: any[]) {
    if (this.shouldLog('critical')) console.error(...msgs);
  }

  error(...msgs: any[]) {
    if (this.shouldLog('error')) console.error(...msgs);
  }

  warn(...msgs: any[]) {
    if (this.shouldLog('warning')) console.warn(...msgs);
  }

  info(...msgs: any[]) {
    if (this.shouldLog('info')) console.info(...msgs);
  }

  http({ status, method, endpoint, params, data, sent = false }: HTTPLog) {
    if (this.shouldLog('http')) {
      const { useDevServer } = Store.getState().preferences;
      const server = useDevServer ? 'api-dev' : 'api';

      let logEntry = `[http] ${method.toUpperCase()} `;

      if (sent) logEntry += 'sent ';
      else logEntry += `${status || '???'} `;

      logEntry += `to ${server}/${endpoint} `;

      if (sent && params) logEntry += `with params ${logObj(params)}`;
      if (!sent && data) logEntry += `with data ${logObj(data)}`;

      console.log(logEntry);
    }
  }

  verbose(...msgs: any[]) {
    if (this.shouldLog('verbose')) console.log(...msgs);
  }

  debug(...msgs: any[]) {
    if (this.shouldLog('debug')) console.log(...msgs);
  }
}

const logger = new Logger({ level: Config.logger.level });

export default logger;
