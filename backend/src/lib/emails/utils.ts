import { env } from "../env";
import { promises as fs } from "fs";
import path from "path";
import fg from "fast-glob";
import _ from "lodash";
import Handlebars from "handlebars";
import { sendEmailWithBrevo } from "../brevo";
import { getAllBooksRoute } from "@bookkey/webapp/src/lib/routes";
import { logger } from "../logger";

const getHandlebarTemplates = _.memoize(async () => {        // use memoize to cache so we only call this once during run time
    const htmlPathsPattern = path.resolve(__dirname, "../emails/dist/**/*.html");
    const htmlPaths = fg.sync(htmlPathsPattern);
    const handlebarTemplates: Record<string, HandlebarsTemplateDelegate> = {};
    for (const htmlPath of htmlPaths) {
        const templateName = path.basename(htmlPath, ".html");
        const htmlTemplate = await fs.readFile(htmlPath, "utf-8");
        handlebarTemplates[templateName] = Handlebars.compile(htmlTemplate);
    }
    return handlebarTemplates;
})

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
    const handlebarTemplates = await getHandlebarTemplates();
    const handlebarTemplate = handlebarTemplates[templateName];
    const html = handlebarTemplate(templateVariables);
    return html;
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateVariables = {}
}: {
    to: string,
    subject: string,
    templateName: string,
    templateVariables?: Record<string, any>
}) => {
    try {
        const fullTemplateVariables = {
            ...templateVariables,
            homeUrl: env.WEBAPP_URL || getAllBooksRoute({ abs: true })
        }
        console.log(fullTemplateVariables.homeUrl)
        const html = await getEmailHtml(templateName, fullTemplateVariables)
        const { loggableResponse } = await sendEmailWithBrevo({ to, subject, html });
        logger.info('email', 'sendEmail', {
            to,
            templateName,
            templateVariables,
            response: loggableResponse
        })
        return { ok: true }
    } catch (error) {
        logger.error('email', error, {
            to,
            templateName,
            templateVariables
        });
        return { ok: false }
    }
}
