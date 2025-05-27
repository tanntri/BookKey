import { Alert } from "../Alert";
import { Segment } from "../Segment/segment";

export const ErrorPage = ({
    title = 'Oops, sorry',
    message = 'Something went wrong',
    children
}: {
    title?: string,
    message?: string,
    children?: React.ReactNode
}) => {
    return (
        <Segment title={title}>
            <Alert color="red">{message}</Alert>
            {children}
        </Segment>
    )
}