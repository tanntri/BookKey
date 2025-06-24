import { trpc } from "../../../../lib/trpc";
import { Segment } from "../../../shared/Segment/segment";
import { FormItems } from "../../../shared/FormItems";
import { Input } from "../../../shared/Input/Input";
import { zSignInTrpcInput } from "@bookkey/backend/src/router/auth/signin/input";
import { Button } from "../../../shared/Button";
import { Alert } from "../../../shared/Alert";
import Cookies from "js-cookie";
import { useForm } from "../../../../lib/form";
import { withPageWrapper } from "../../../../lib/pageWrapper";
// import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { mixpanelIdentify, mixpanelTrackSignin } from "../../../../lib/mixpanel";

export const SignInPage = withPageWrapper({
    redirectAuthorized: true
})(() => {
    const trpcUtils = trpc.useUtils();
    const signin = trpc.signIn.useMutation();
    const { formik, buttonProps, alertProps } = useForm({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: zSignInTrpcInput,
        onSubmit: async (values) => {
            const { token, userId } = await signin.mutateAsync(values);
            mixpanelIdentify(userId);   // let mixpanel know which user is authenticated
            mixpanelTrackSignin();      // let mixpanel track sign in event
            Cookies.set('token', token, { expires: 99999 });
            void trpcUtils.invalidate();
            // With the wrapper, we don't need this navigate anymore
            // navigate(getAllBooksRoute());            
        },
        resetOnSuccess: false
    })

    useEffect(() => {
        document.title = 'Sign In -- BookKey';
    }, [])

    return (
        <Segment title="Log in">
            {/* for some reason helmet doesn't work */}
            {/* <Helmet>
                <title>Sign In - BookKey</title>
            </Helmet> */}
            <form onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
            }}>
                <FormItems>
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
                    <br />
                    <Alert {...alertProps} />
                    <Button {...buttonProps}>Log in</Button>
                </FormItems>
            </form>
        </Segment>
    )
})