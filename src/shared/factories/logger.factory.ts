import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston'
import { format, transports } from 'winston'

export const LoggerFactory = () => {
  const appName = process.env.APP_NAME
  const showPrettierLogs = process.env.APP_ENV === 'local'

  const consoleFormat = showPrettierLogs
    ? format.combine(
        format.timestamp(),
        format.ms(),
        format.printf(({ level, message, timestamp, context }) => {
          return `${timestamp} [${context}] ${level}: ${message}`
        }),
        nestWinstonModuleUtilities.format.nestLike(appName, {
          colors: true,
          prettyPrint: true,
        }),
      )
    : format.combine(format.ms(), format.timestamp(), format.json())

  return WinstonModule.createLogger({
    level: showPrettierLogs ? 'debug' : 'info',
    format: consoleFormat,
    transports: [new transports.Console()],
  })
}
