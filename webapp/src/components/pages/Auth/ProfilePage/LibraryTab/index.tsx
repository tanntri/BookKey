import { Segment } from "../../../../shared/Segment/segment";
import css from "../index.module.scss";
import { trpc } from "../../../../../lib/trpc";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../../lib/routes";
import { getCoverImage } from "../index";
import { Loader } from "../../../../shared/Loader";

export const LibraryTab = ({ userId }: { userId: string }) => {
    const { data: booksPossessedData, isLoading } = trpc.getLibrary.useQuery(
        { userId },
        {
            staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
            cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
            refetchOnWindowFocus: false, // avoid refetching every time user switches tab
        });

    if (isLoading) {
        return <Loader type="section" />;
    }

    if (!booksPossessedData || booksPossessedData.length === 0) {
        return <div>No books in library found.</div>;
    }

    return (
        <div className={css.books}>
            {booksPossessedData.map((bookPossessed) => (
                <div className={css.book} key={bookPossessed?.id} onMouseLeave={() => {}}>
                    {getCoverImage(bookPossessed?.title, bookPossessed?.cover)}
                    <Segment
                        size={2}
                        title={
                            <Link className={css.bookLink} to={getViewBookRoute({ olid: bookPossessed?.id })}>{bookPossessed?.title}</Link>
                        }
                        // description={`Authors: ${bookPossessed.author}`}>
                        >
                    </Segment>
                </div>
            ))}
        </div>
    );
}