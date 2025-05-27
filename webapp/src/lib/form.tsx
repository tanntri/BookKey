import { type FormikHelpers, useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { useMemo, useState } from "react";
import { type z } from "zod";
import { type AlertProps } from "../components/shared/Alert";
import { type ButtonProps } from "../components/shared/Button";
import { sentryCaptureException } from "./sentry";

export const useForm = <TZodSchema extends z.ZodTypeAny>({
    successMessage = false,
    resetOnSuccess = true,
    showValidationAlert = false,
    initialValues,
    validationSchema,
    onSubmit
}: {
    successMessage?: string | false
    resetOnSuccess?: boolean
    showValidationAlert?: boolean,
    initialValues?: z.infer<TZodSchema>
    validationSchema?: TZodSchema
    onSubmit?: (values: z.infer<TZodSchema>, action: FormikHelpers<z.infer<TZodSchema>>) => Promise<any> | any
}) => {
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const [submittingError, setSubmittingError] = useState<Error | null>(null)

    const formik = useFormik<z.infer<TZodSchema>>({
        initialValues: initialValues || ({} as any),
        ...(validationSchema && {validate: withZodSchema(validationSchema)}),
        onSubmit: async (values, formikHelpers) => {
            if (!onSubmit) {
                return;
            }
            try {
                setSubmittingError(null)
                await onSubmit(values, formikHelpers)
                if (resetOnSuccess) {
                    formik.resetForm();
                }
                setSuccessMessageVisible(true)
                setTimeout(() => {
                    setSuccessMessageVisible(false)
                }, 3000)
            } catch(error: any) {
                sentryCaptureException(error);
                setSubmittingError(error)
            }
        }
    })

    const alertProps = useMemo<AlertProps>(() => {
        if (submittingError) {
            return {
                hidden: false,
                children: submittingError.message,
                color: 'red'
            }
        }
        if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
            return {
                hidden: false,
                children: "Some fields are invalid",
                color: "red"
            }
        }
        if (successMessageVisible && successMessage) {
            return {
                hidden: false,
                children: successMessage,
                color: "green"
            }
        }
        return {
            color: "red",
            hidden: true,
            children: null
        }
    }, [submittingError, formik.isValid, formik.submitCount, successMessageVisible, successMessage, showValidationAlert])

    const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
        return {
            loading: formik.isSubmitting,
            disabled: !formik.dirty || formik.isSubmitting
        }
    }, [formik.isSubmitting, formik.dirty])

    return {
        formik,
        alertProps,
        buttonProps
    }
}