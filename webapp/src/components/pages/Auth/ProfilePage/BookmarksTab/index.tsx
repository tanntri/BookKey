
import { Segment } from "../../../../shared/Segment/segment";
import css from "../index.module.scss";
import { trpc } from "../../../../../lib/trpc";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../../lib/routes";
import { getCoverImage } from "../index";
import { Loader } from "../../../../shared/Loader";

export const BookmarksTab = (({ userId }: { userId: string }) => {
    const { data: bookmarksData, isLoading } = trpc.getBookmarks.useQuery(
        { userId },
        {
            staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
            cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
            refetchOnWindowFocus: false, // avoid refetching every time user switches tab
        });

    if (isLoading) {
        return <Loader type="section" />;
    }

    if (!bookmarksData || bookmarksData.length === 0) {
        return <div>No bookmarks found.</div>;
    }

    return (
        <div className={css.books}>
            {bookmarksData.map((bookmark) => (
                <div className={css.book} key={bookmark?.id} onMouseLeave={() => {}}>
                    {getCoverImage(bookmark?.title, bookmark?.cover)}
                    <Segment
                        size={2}
                        title={
                            <Link className={css.bookLink} to={getViewBookRoute({ olid: bookmark?.id })}>{bookmark?.title}</Link>
                        }
                        // description={`${RES.common.authors}: ${bookmark.author}`}>
                        >
                    </Segment>
                </div>
            ))}
        </div>
    );
})