
import { Segment } from "../../../../shared/Segment/segment";
import css from "../index.module.scss";
import { trpc } from "../../../../../lib/trpc";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../../lib/routes";
import { getCoverImage } from "../index";
import { Loader } from "../../../../shared/Loader";

export const BooksReadTab = ({ userId }: { userId: string }) => {
    const { data: booksReadData, isLoading } = trpc.getBooksRead.useQuery(
        { userId },
        {
            staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
            cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
            refetchOnWindowFocus: false, // avoid refetching every time user switches tab
        });

    if (isLoading) {
        return <Loader type="section" />;
    }

    if (!booksReadData || booksReadData.length === 0) {
        return <div>No books read found.</div>;
    }

    return (
        <div className={css.books}>
            {booksReadData.map((bookRead) => (
                <div className={css.book} key={bookRead?.id} onMouseLeave={() => {}}>
                    {getCoverImage(bookRead?.title, bookRead?.cover)}
                    <Segment
                        size={2}
                        title={
                            <Link className={css.bookLink} to={getViewBookRoute({ olid: bookRead?.id })}>{bookRead?.title}</Link>
                        }
                        // description={`${RES.common.authors}: ${bookRead.author}`}>
                        >
                    </Segment>
                </div>
            ))}
        </div>
    );
}