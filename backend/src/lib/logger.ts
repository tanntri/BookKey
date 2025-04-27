import winston from "winston";
import { env } from "./env";
import { serializeError } from "serialize-error";
import _ from "lodash";
import { EOL } from "os";
import pc from "picocolors";
import { MESSAGE } from "triple-beam";
import * as yaml from "yaml";

export const winstonLogger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'backend', hostEnv: env.HOST_ENV },
    transports: [
        new winston.transports.Console({
            format: env.HOST_ENV !== 'local' 
                ? winston.format.json()
                : winston.format((logData) => {
                    const setColor = {
                        info: (str: string) => pc.blue(str),
                        error: (str: string) => pc.red(str),
                        debug: (str: string) => pc.cyan(str)
                    }[logData.level as 'info' | 'error' | 'debug'];
                    const levelAndType = `${logData.level} ${logData.logType}`
                    const topMessage = `${setColor(levelAndType)} ${logData.timestamp} ${EOL}${logData.message}`

                    const visibleMessageTags = _.omit(logData, [
                        'level', 'logType', 'timestamp', 'message', 'service', 'hostEnv'
                    ])

                    const stringifiedLogData = _.trim(
                        yaml.stringify(visibleMessageTags, (k, v) => (_.isFunction(v) ? 'Function' : v))
                    )

                    const resultLogData = {
                        ...logData,
                        [MESSAGE]:
                            [topMessage, Object.keys(visibleMessageTags).length > 0 ? `${EOL}${stringifiedLogData}` : '']
                                .filter(Boolean)
                                .join() + EOL
                    }

                    return resultLogData;
                })()
        })
    ]
})

export const logger = {
    info: (logType: string, message: string, meta?: Record<string, any>) => {
        winstonLogger.info(message, { logType, ...meta })
    },
    error: (logType: string, error: any, meta?: Record<string, any>) => {
        const serializedLoggerError = serializeError(error);
        winstonLogger.error(serializedLoggerError.message || 'Unknown Error', {
            logType,
            error,
            errorStack: serializedLoggerError.stack,
            ...meta
        })
    }
}
