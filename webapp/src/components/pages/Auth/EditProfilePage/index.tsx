import { zUpdateProfileTrpcInput } from "@bookkey/backend/src/router/auth/updateProfile/input";
import { Alert } from "../../../shared/Alert";
import { Button } from "../../../shared/Button";
import { FormItems } from "../../../shared/FormItems";
import { Input } from "../../../shared/Input/Input";
import { Segment } from "../../../shared/Segment/segment";
import { useForm } from "../../../../lib/form";
import { withPageWrapper } from "../../../../lib/pageWrapper";
import { trpc } from "../../../../lib/trpc";
import type { TrpcRouterOutput } from "@bookkey/backend/src/router";
import { zUpdatePasswordTrpcInput } from "@bookkey/backend/src/router/auth/updatePassword/input";
import { Helmet } from "react-helmet-async"
import { useEffect } from "react";
import { zPasswordMustMatch, zStringRequired } from "@bookkey/shared/src/zod";
import { UploadToCloudinary } from "../../../shared/UploadPicToCloudinary";
import { RES } from "@bookkey/shared/src/constants";

const General = ({me}: {me: NonNullable<TrpcRouterOutput['getMe']['me']>}) => {
    const trpcUtils = trpc.useUtils();
    const updateProfile = trpc.editProfile.useMutation();
    const { formik, alertProps, buttonProps } = useForm({
        initialValues: {
            username: me.username,
            avatar: me.avatar
        },
        validationSchema: zUpdateProfileTrpcInput,
        onSubmit: async (values) => {
            await updateProfile.mutateAsync(values);
            trpcUtils.invalidate()
        },
        successMessage: RES.editProfile.profileUpdated,
        resetOnSuccess: false
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormItems>
                <Input label="Username" name="username" formik={formik} />
                <UploadToCloudinary label="Avatar" name="avatar" type="avatar" formik={formik} preset="large" />
            </FormItems>
            <Alert {...alertProps} />
            <Button {...buttonProps}>{RES.editProfile.updateProfile}</Button>
        </form>
    )
}

const Password = () => {
    const updatePassword = trpc.updatePassword.useMutation();
    const { formik, alertProps, buttonProps } = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordConfirm: ''
        },
        validationSchema: zUpdatePasswordTrpcInput
            .extend({
                newPasswordConfirm: zStringRequired
            })
            .superRefine(zPasswordMustMatch('newPassword', 'newPasswordConfirm')),
            onSubmit: async ({ newPassword,oldPassword }) => {
                await updatePassword.mutateAsync({newPassword, oldPassword})
            },
            successMessage: RES.editProfile.passwordUpdated,
            resetOnSuccess: true
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <FormItems>
                <Input label="Old Password" name="oldPassword" formik={formik} />
                <Input label="New Password" name="newPassword" formik={formik} />
                <Input label="Confirm New Password" name="newPasswordConfirm" formik={formik} />
            </FormItems>
            <Alert {...alertProps} />
            <Button {...buttonProps}>{RES.editProfile.updatePassword}</Button>
        </form>
    )
}

export const EditProfilePage = withPageWrapper({
    authorizedOnly: true,
    setProps: ({ getAuthorizeMe }) => ({
        me: getAuthorizeMe()
    })
})(({ me }) => {
    useEffect(() => {
        document.title = "Edit Profile -- BookKey";
    }, [])
    return (
        <>
            <Helmet>
                <title>Edit Profile - BookKey</title>
            </Helmet>
            <Segment title="Edit Profile">
                <Segment title="General" size={2}>
                    <General me={me} />
                </Segment>
                <Segment title="Password" size={2}>
                    <Password />
                </Segment>
            </Segment>
        </>
    )
})