import { useState, useEffect } from "react";
import { trpc } from "../../../../lib/trpc";
import { useFormik } from "formik";
import { withZodSchema } from "formik-validator-zod";
import { Segment } from "../../../shared/Segment/segment";
import { FormItems } from "../../../shared/FormItems";
import { Input } from "../../../shared/Input/Input";
import { zSignUpTrpcInput } from "@bookkey/backend/src/router/auth/signup/input";
import { Button } from "../../../shared/Button";
import { Alert } from "../../../shared/Alert";
import Cookies from "js-cookie";
import { withPageWrapper } from "../../../../lib/pageWrapper";
// import { Helmet } from "react-helmet-async";
import { zPasswordMustMatch, zStringMin } from "@bookkey/shared/src/zod";
import { sentryCaptureException } from "../../../../lib/sentry";
import { mixpanelAlias, mixpanelTrackSignup } from "../../../../lib/mixpanel";

export const SignUpPage = withPageWrapper({
    redirectAuthorized: true
})(() => {
    const trpcUtils = trpc.useUtils();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const signup = trpc.signUp.useMutation();
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validate: withZodSchema(
            zSignUpTrpcInput
                .extend({
                    confirmPassword: zStringMin(5)
                })
                .superRefine(zPasswordMustMatch('password', 'confirmPassword'))
        ),
        onSubmit: async (values) => {
            try {
                setSubmitError(null);
                const { token, userId } = await signup.mutateAsync(values);
                mixpanelAlias(userId);
                mixpanelTrackSignup();          // inform mixpanel about sign up event
                Cookies.set('token', token, { expires: 99999 });
                void trpcUtils.invalidate();
                // with page wrapper, we don't need this navigate anymore
                // navigate(getAllBooksRoute());
            } catch(e: any) {
                sentryCaptureException(e);
                console.log(e)
                setSubmitError(e.message)
            }
        }
    })

    useEffect(() => {
        document.title = 'Sign Up -- BookKey';
    }, [])

    return (
        <Segment title="Sign Up">
            {/* for some reason helmet doesn't work */}
            {/* <Helmet>
                <title>Sign Up - BookKey</title>
            </Helmet> */}
            <form onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
            }}>
                <FormItems>
                    <Input 
                        key="email"
                        name="email"
                        label="Email"
                        formik={formik}
                    />
                    <Input
                        key="username"
                        name="username"
                        label="Username"
                        formik={formik}  
                    />
                    <Input
                        key="password"
                        name="password"
                        label="Password"
                        type="password"
                        formik={formik}
                    />
                    <Input 
                        key="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        formik={formik}
                    />
                    <br />
                    {submitError && <Alert color="red">{submitError}</Alert>}
                    <Button loading={formik.isSubmitting}>Sign Up</Button>
                </FormItems>
            </form>
        </Segment>
    )
})