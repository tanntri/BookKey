import { env } from "./env";
import { promises as fs } from "fs";
import path from "path";
import express, { type Express } from "express";
import { logger } from "./logger";

const checkFileExists = async (filePath: string) => {
    return await fs
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}

const findWebAppDistDir = async (dir: string): Promise<string | null> => {
    const maybeWebAppDistDir = path.resolve(dir, 'webapp/dist');
    if (await checkFileExists(maybeWebAppDistDir)) {
        return maybeWebAppDistDir;
    }
    if (dir === '/') {
        return null;
    }
    return await findWebAppDistDir(path.dirname(dir));
}

export const applyServeWebApp = async (expressApp: Express) => {
    const webappDistDir = await findWebAppDistDir(__dirname);
    if (!webappDistDir) {
        if (env.HOST_ENV === "production") {
            throw new Error("Webapp dist directory not found");
        } else {
            logger.error('webapp-serve', "Webapp sist directory not found");
            return;
        }
    }
    const htmlSource = await fs.readFile(path.resolve(webappDistDir, 'index.html'), 'utf-8');

    expressApp.use(express.static(webappDistDir, { index: false }));
    expressApp.get('/*', (req, res) => {
        res.send(htmlSource);
    })
}
