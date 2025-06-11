import { withPageWrapper } from "../../../../lib/pageWrapper";
import { getLibraryRoute } from "../../../../lib/routes";
import { trpc } from "../../../../lib/trpc";
import { Segment } from "../../../shared/Segment/segment";
import css from "./index.module.scss";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../lib/routes";

const getCoverImage = (title: string, coverId?: string) => {
    return (
      <div className={css.cover}>
        {coverId ? (
          <img src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`} alt={`${title} cover`} loading="lazy" />
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
  };

export const LibraryPage = withPageWrapper({
    useQuery: () => {
        const { userId } = getLibraryRoute.useParams();
        const booksPossessed = trpc.getLibrary.useQuery(
            { userId },
            {
                staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
                cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
                refetchOnWindowFocus: false, // avoid refetching every time user switches tab
            }
        )
        return booksPossessed;
    },
    setProps: ({ queryResult, ctx, checkExists }) => {
        const booksPossessed = checkExists(queryResult?.data, 'Bookmarks empty');
        const me = ctx.me;
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            booksPossessed, me  // pass in 'me' in case we need it in the future
        }
    }
})
(({ booksPossessed }) => {
    return (
            <Segment title="Library">
                <div className={css.books}>
                    {booksPossessed.map((bookPossessed) => {
                        return (<div className={css.book} key={bookPossessed?.id} onMouseLeave={() => {}}>
                        {getCoverImage(bookPossessed?.title, bookPossessed?.cover)}
                        <Segment
                            size={2}
                            title={
                                // <Link className={css.bookLink} to={`/books/${book.key.split("/")[2]}`}>{book.title}</Link>
                                <Link className={css.bookLink} to={getViewBookRoute({ olid: bookPossessed?.id })}>{bookPossessed?.title}</Link>
                            }
                            // description={`Authors: ${bookPossessed?.author}`}>
                            >
                        </Segment>
                    </div>)
                })}
                </div>
            </Segment>
    )
})