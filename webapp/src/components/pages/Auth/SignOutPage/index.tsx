import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSignInRoute } from "../../../../lib/routes";
import { trpc } from "../../../../lib/trpc";
import { Loader } from "../../../shared/Loader";

export const SignOutPage = () => {
    const navigate = useNavigate();
    const trpcUtils = trpc.useUtils();

    useEffect(() => {
        Cookies.remove('token');
        void trpcUtils.invalidate()
            .then(() => {
                navigate(getSignInRoute(), { replace: true })
            })
    }, [])

    return <Loader type="page" />;
}