import { z } from "zod";

export const zNonEmptyTrimmed = z.string().trim().min(1);
export const zNonEmptyTrimmedRequiredNonLocal = zNonEmptyTrimmed.optional().refine(
    (val) => `${process.env.HOST_ENV}` === 'local' || !!val,
    "Required on non local host"
)
export const zEnvHost = z.enum(['local'])

export const zStringRequired = z.string({ required_error: "Value Required" }).min(1);
export const zStringOptional = z.string().optional();
export const zEmailRequired = zStringRequired.email();
// export const zUsernameRequired = 

export const zStringMin = (min: number) => zStringRequired.min(min, `Length should be at least ${min} characters`);
export const zPasswordMustMatch = 
    (passwordFieldName: string, passwordConfirmFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
        if (val[passwordFieldName] !== val[passwordConfirmFieldName]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password Must be the Same',
                path: [passwordConfirmFieldName]
            })
        }
    }
