import { ErrorPage } from "../ErrorPage";
import notFound404Img from "../../../assets/images/vecteezy_404-error-in-webpages_24094883 (1).png"
import css from "./index.module.scss";

export const NotFoundPage = ({title = "Not Found", message = "Page does not exist"}: {
    title?: string,
    message?: string
}) => {
    return (
        <ErrorPage title={title} message={message}>
            <img src={notFound404Img} className={css.image} alt="" width="800" height="600" />
        </ErrorPage>
    )
}