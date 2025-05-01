import winston from "winston";
import { env } from "./env";
import { serializeError } from "serialize-error";
import _ from "lodash";
import { EOL } from "os";
import pc from "picocolors";
import { MESSAGE } from "triple-beam";
import * as yaml from "yaml";
import debug from "debug";
import { deepMap } from "../utils/deepMap";

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
                        /* tslint:disable:no-unused-variable */
                        yaml.stringify(visibleMessageTags, (_k, v) => (_.isFunction(v) ? 'Function' : v))
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

type Meta = Record<string, any> | undefined
const classifyMetadata = (metadata: Meta): Meta => {
    return deepMap(metadata, ({ key, value }) => {
        if (['email', 'password', 'newPassword', 'oldPassword', 'token'].includes(key)) {
            return '***'
        }
        return value
    })
}

export const logger = {
    info: (logType: string, message: string, meta?: Meta) => {
        if (!debug.enabled(`bookkey:${logType}`)) {
            return;
        }
        winstonLogger.info(message, { logType, ...classifyMetadata(meta) })
    },
    error: (logType: string, error: any, meta?: Meta) => {
        if (!debug.enabled(`bookkey:${logType}`)) {
            return;
        }
        const serializedLoggerError = serializeError(error);
        winstonLogger.error(serializedLoggerError.message || 'Unknown Error', {
            logType,
            error,
            errorStack: serializedLoggerError.stack,
            ...meta
        })
    }
}
