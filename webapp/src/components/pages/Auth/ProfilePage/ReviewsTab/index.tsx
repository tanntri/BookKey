import { Segment } from "../../../../shared/Segment/segment";
import css from "../index.module.scss";
import { trpc } from "../../../../../lib/trpc";
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../../lib/routes";
import { CoverImage } from "../../../../shared/CoverImage";
import { Icon } from "../../../../shared/Icons";
import { Loader } from "../../../../shared/Loader";

export const UserReviewsTab = ({ userId }: { userId: string }) => {
    const { data: userReviewsData, isLoading } = trpc.getReviewsByUser.useQuery(
        { userId },
        {
            staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
            cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
            refetchOnWindowFocus: false, // avoid refetching every time user switches tab
        });

    if (isLoading) {
        return <Loader type="section" />;
    }

    if (!userReviewsData || userReviewsData.length === 0) {
        return <div>No reviews found.</div>;
    }

    return (
        <div className={css.reviews}>
            {userReviewsData.map((bookReview) => (
                <div className={css.review} key={bookReview?.id} onMouseLeave={() => {}}>
                    {<CoverImage title={bookReview?.book?.title as string} coverId={bookReview?.book?.cover as string} />}
                    <Segment
                        size={2}
                        title={
                            <Link className={css.bookLink} to={getViewBookRoute({ olid: bookReview?.book?.id })}>{bookReview?.book?.title}</Link>
                        }>
                        <h2 className={css.reviewTitle}>{bookReview?.title}</h2>
                        <div className={css.stars}>
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    name="star"
                                    className={`${i < bookReview?.score ? css.filledStar : css.emptyStar}`}
                                    size={20} />
                                ))}
                        </div>
                        <p>{bookReview?.text}</p>
                    </Segment>
                </div>
            ))}
        </div>
    );
}