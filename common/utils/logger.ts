import { config } from '@root/app.json';

const logTypes = ['critical', 'error', 'warning', 'info', 'http', 'verbose', 'debug'] as const;

const truncateLength = 100;

const logObj = (data: any) => {
  const str = JSON.stringify(data);
  let truncatedStr = str.substring(0, truncateLength);
  if (str.length !== truncatedStr.length) truncatedStr += ' ...';
  return truncatedStr;
};

type LevelType = typeof logTypes[number];

type ConfigureType = {
  level: LevelType;
};

type HTTPLog = {
  status?: number;
  params?: { [key: string]: any };
  data?: any;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  endpoint: string;
};

class Logger {
  level: LevelType;

  constructor({ level }: ConfigureType) {
    if (!logTypes.includes(level)) {
      console.error(`Incorrect logger level ${level}`);
    }
    this.level = level;
  }

  private shouldLog(level: LevelType) {
    return (
      logTypes.indexOf(level) <= logTypes.indexOf(this.level) &&
      !config.logger?.exclude?.includes(level)
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

  http({ status, method, endpoint, params, data }: HTTPLog) {
    if (this.shouldLog('http')) {
      let logEntry = `[request] ${method.toUpperCase()} `;
      if (status) logEntry += `${status} `;
      else logEntry += 'sent ';
      logEntry += `to ${endpoint} `;
      if (params) logEntry += `with params ${logObj(params)} `;
      if (params && data) logEntry += 'and ';
      if (data) logEntry += `with data ${logObj(data)}`;
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

const logger = new Logger({ level: config.logger?.level as LevelType });

export default logger;
