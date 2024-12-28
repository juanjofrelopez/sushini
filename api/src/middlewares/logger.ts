import { Request, Response, NextFunction } from 'express';

interface LoggerOptions {
  logBody?: boolean;
  format?: (req: Request, res: Response) => string;
}

export const logger = (options: LoggerOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      
      const logMessage = options.format ? options.format(req, res) : [
        `[${new Date().toISOString()}]`,
        `${req.method} ${req.originalUrl}`,
        `Status: ${res.statusCode}`,
        `Duration: ${duration}ms`,
        `IP: ${req.ip}`,
        options.logBody ? `Body: ${JSON.stringify(req.body)}` : '',
      ].filter(Boolean).join(' | ');

      console.log(logMessage);
    });

    next();
  };
};