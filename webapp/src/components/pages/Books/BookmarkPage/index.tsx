import { withPageWrapper } from "../../../../lib/pageWrapper";
import { getBookMarksRoute } from "../../../../lib/routes";
import { trpc } from "../../../../lib/trpc";
import { Segment } from "../../../shared/Segment/segment";
import css from "./index.module.scss";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../lib/routes";

const getCoverImage = (title: string, coverId?: string) => {
    return (
      <div className={css.cover}>
        {coverId ? (
          <img src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`} alt={`${title} cover`} />
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
  };

export const BookMarkPage = withPageWrapper({
    useQuery: () => {
        const { userId } = getBookMarksRoute.useParams();
        const bookmarks = trpc.getBookmarks.useQuery(
            { userId },
            {
                staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
                cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
                refetchOnWindowFocus: false, // avoid refetching every time user switches tab
            }
        )
        return bookmarks;
    },
    setProps: ({ queryResult, ctx, checkExists }) => {
        const bookmarks = checkExists(queryResult?.data, 'Bookmarks empty');
        const me = ctx.me;
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            bookmarks, me  // pass in 'me' in case we need it in the future
        }
    }
})
(({ bookmarks }) => {
    return (
            <Segment title="Bookmarks">
                <div className={css.books}>
                    {bookmarks.map((bookmark) => {
                        return (<div className={css.book} key={bookmark.id} onMouseLeave={() => {}}>
                        {getCoverImage(bookmark.title, bookmark.cover)}
                        <Segment
                            size={2}
                            title={
                                <Link className={css.bookLink} to={getViewBookRoute({ olid: bookmark.id })}>{bookmark.title}</Link>
                            }
                            description={`Authors: ${bookmark.author}`}>
                        </Segment>
                    </div>)
                })}
                </div>
            </Segment>
    )
})