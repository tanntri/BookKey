import { promises as fs } from "fs";
import path from "path";
import { type Review, type User, type Book } from "@prisma/client";
import fg from "fast-glob";
import _ from "lodash";
import { env } from "./env";
import Handlebars from "handlebars";
import { sendEmailWithBrevo } from "./brevo";

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

const sendEmail = async ({
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
            homeUrl: env.WEBAPP_URL
        }
        console.log(fullTemplateVariables.homeUrl)
        const html = await getEmailHtml(templateName, fullTemplateVariables)
        const { loggableResponse } = await sendEmailWithBrevo({ to, subject, html });
        console.info('sendEmail', {
            to,
            templateName,
            templateVariables,
            response: loggableResponse
        })
        return { ok: true }
    } catch (error) {
        console.error(error);
        return { ok: false }
    }
}

export const sendRegistrationEmail = async ({ user }: { user: Pick<User, 'username' | 'email'> }) => {
    return await sendEmail({
        to: user.email,
        subject: 'Thanks for Registration!',
        templateName: 'register',
        templateVariables: {
            username: user.username
        }
    })
}

export const sendBlockedReviewEmail = async ({ user, review }: 
    { user: Pick<User, 'username' | 'email'>;review: Review }) => {
    return await sendEmail({
        to: user.email,
        subject: 'Your Review is Blocked',
        templateName: 'reviewBlocked',
        templateVariables: {
            book: review.bookId
        }
    })
}

