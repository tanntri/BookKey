import { withPageWrapper } from "../../../../lib/pageWrapper";
import { getBooksReadRoute } from "../../../../lib/routes";
import { trpc } from "../../../../lib/trpc";
import { Segment } from "../../../shared/Segment/segment";
import css from "./index.module.scss";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../lib/routes";
import { CoverImage } from "../../../shared/CoverImage";

export const BookReadPage = withPageWrapper({
    useQuery: () => {
        const { userId } = getBooksReadRoute.useParams();
        const booksRead = trpc.getBooksRead.useQuery(
            { userId },
            {
                staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
                cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
                refetchOnWindowFocus: false, // avoid refetching every time user switches tab
            }
        )
        return booksRead;
    },
    setProps: ({ queryResult, ctx, checkExists }) => {
        const booksRead = checkExists(queryResult?.data, 'Books Read empty');
        const me = ctx.me;
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            booksRead, me  // pass in 'me' in case we need it in the future
        }
    }
})
(({ booksRead }) => {
    return (
            <Segment title="Read">
                <div className={css.books}>
                    {booksRead.map((bookRead) => {
                        return (<div className={css.book} key={bookRead?.id} onMouseLeave={() => {}}>
                        <CoverImage title={bookRead?.title as string} coverId={bookRead?.cover as string} />
                        <Segment
                            size={2}
                            title={
                                // <Link className={css.bookLink} to={`/books/${book.key.split("/")[2]}`}>{book.title}</Link>
                                <Link className={css.bookLink} to={getViewBookRoute({ olid: bookRead?.id })}>{bookRead?.title}</Link>
                            }
                            // description={`Authors: ${bookRead?.author}`}>
                            >
                        </Segment>
                    </div>)
                })}
                </div>
            </Segment>
    )
})