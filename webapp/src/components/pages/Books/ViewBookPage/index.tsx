import { getViewBookRoute } from "../../../../lib/routes";
import { trpc } from "../../../../lib/trpc";
import { Segment } from "../../../shared/Segment/segment";
import { NewReview } from "../../NewReviewPage";
import { withPageWrapper } from "../../../../lib/pageWrapper";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { TrpcRouterOutput } from "@bookkey/backend/src/router";
import css from './index.module.scss';
import { FaRegBookmark, FaBookmark, FaCheckCircle, FaRegCheckCircle, FaEye, FaRegEye } from 'react-icons/fa';
import { Tooltip } from "react-tooltip";
import { Icon } from "../../../shared/Icons";

type BookDescription = {
    type: string,
    value: string
}

const ActionButtons = ({ book, userId }: { 
        book: TrpcRouterOutput['getBook']
        userId: string | undefined
    }) => {
    const [isBookmarked, setIsBookmarked] = useState(book.savedByCurrUser);
    const [isRead, setIsRead] = useState(book.readByCurrUser);
    const [isPossessed, setIsPossessed] = useState(book.possessedByCurrUser)
    const trpcUtils = trpc.useUtils();

    const setBookmark = trpc.setBookmark.useMutation({
        onMutate: async ({ savedByCurrUser }) => {
            // Optimistically update local state
            setIsBookmarked(savedByCurrUser);

            // Cancel any outgoing refetches
            // await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.id;
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    savedByCurrUser,
                });
            }

            return { previousData };
        },
        onSuccess: () => {
            // Invalidate profile cache to refetch latest bookmarks
            if (userId) {
                trpcUtils.getUserProfile.invalidate({ userId: userId });
            }
        },
        onError: (_err, _variables, context) => {
            // Revert on error
            setIsBookmarked(book.savedByCurrUser);
            if (context?.previousData) {
                const bookId = book.id;
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });

    const setBookRead = trpc.setBookRead.useMutation({
        onMutate: async ({ readByCurrUser }) => {
            // Optimistically update local state
            setIsRead(readByCurrUser);

            // Cancel any outgoing refetches
            // await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.id;
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    readByCurrUser,
                });
            }

            return { previousData };
        },
        onSuccess: () => {
            // Invalidate profile cache to refetch latest bookmarks
            if (userId) {
                trpcUtils.getUserProfile.invalidate({ userId: userId });
            }
        },
        onError: (_err, _variables, context) => {
            // Revert on error
            setIsRead(book.readByCurrUser);
            if (context?.previousData) {
                const bookId = book.id;
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });

    const setLibrary = trpc.setLibrary.useMutation({
        onMutate: async ({ possessedByCurrUser }) => {
            // Optimistically update local state
            setIsPossessed(possessedByCurrUser);

            // Cancel any outgoing refetches
            // await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.id;
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    possessedByCurrUser,
                });
            }

            return { previousData };
        },
        onSuccess: () => {
            // Invalidate profile cache to refetch latest bookmarks
            if (userId) {
                trpcUtils.getUserProfile.invalidate({ userId: userId });
            }
        },
        onError: (_err, _variables, context) => {
            // Revert on error
            setIsPossessed(book.possessedByCurrUser);
            if (context?.previousData) {
                const bookId = book.id;
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });


    const handleClickBookmark = () => {
        setBookmark.mutate({
            bookId: book.id,
            savedByCurrUser: !isBookmarked,
        });
    };

    const handleClickBookRead = () => {
        setBookRead.mutate({
            bookId: book.id,
            readByCurrUser: !isRead,
        })
    }

    const handleClickLibrary = () => {
        setLibrary.mutate({
            bookId: book.id,
            possessedByCurrUser: !isRead,
        })
    }

    return (
        <>
            <button 
                data-tooltip-id="action-tooltip"
                data-tooltip-content={isBookmarked ? "Unbookmark" : "Bookmark"}
                data-tooltip-place="bottom" 
                className={css.bookmarkBtn} 
                onClick={handleClickBookmark}>
                {isBookmarked ? (
                    <FaBookmark className={css.iconFilled} />
                ) : (
                    <FaRegBookmark className={css.iconOutline} />
                )}
            </button>
            <button 
                data-tooltip-id="action-tooltip"
                data-tooltip-content={isRead ? "Unread" : "Read"}
                data-tooltip-place="bottom" 
                className={css.bookReadBtn} 
                onClick={handleClickBookRead}>
                {isRead ? (
                    <FaEye className={css.iconFilled} />
                ) : (
                    <FaRegEye className={css.iconOutline} />
                )}
            </button>
            <button 
                data-tooltip-id="action-tooltip"
                data-tooltip-content={isPossessed ? "Remove from Library" : "Add to Library"}
                data-tooltip-place="bottom" 
                className={css.libraryBtn} 
                onClick={handleClickLibrary}>
                {isPossessed ? (
                    <FaCheckCircle className={css.iconFilled} />
                ) : (
                    <FaRegCheckCircle className={css.iconOutline} />
                )}
            </button>
            <Tooltip id="action-tooltip" className={css.actionTooltip} />
        </>
    );
};

const getDescription = (description: BookDescription | string) => {
    if (typeof description === 'string') {
        return description; 
    } else if (!description) {
        return undefined
    } else {
        return description.value;
    }
}

export const ViewBookPage = withPageWrapper({
    useQuery: () => {
        const { olid } = getViewBookRoute.useParams();
        return trpc.getBook.useQuery({olid})
    },
    // checkExists: ({ queryResult }) => !!queryResult.data.book,
    // checkExistsMessage: 'Book not found',
    setProps: ({ queryResult, ctx, checkExists }) => {
        const book = checkExists(queryResult.data, 'Book not found');
        const me = ctx.me
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            book, me
        }
    }
})
(({ book, me }) => {
    useEffect(() => {
        document.title = `${book.title} -- BookKey`
    }, []);

    const [avgScore, setAvgScore] = useState<number>(0);
    const description = getDescription(book.description);

    const handleSetAvgScore = (newAvg: number) => {
        setAvgScore(newAvg);
    }

    return (
        <Segment key={book.id} 
            title={<div className={css.pageTitle}>
                    <p>{book.title}</p>
                    {me && <div className={css.actionButtons}><ActionButtons book={book} userId={me?.id} /></div>}
                </div>}>
            <Helmet>
                <title>{book.title} - BookKey</title>
            </Helmet>

            {book.cover ? (
                <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`}
                    alt={`${book.title} cover`}
                    className={css.coverImage}
                    loading="lazy"
                />
            ) : (
                <div className={css.noCover}>{book.title}</div>
            )}

            <div className={css.authors}>{`Authors: ${book.author ? book.author : 'Not Available'}`}</div>
            <div className={css.stars}>
                {[...Array(5)].map((_, i) => (
                    <Icon
                        key={i}
                        name="star"
                        className={css.starIcon}
                        style={{ color: i < avgScore ? 'var(--yellow)' : '#ccc' }}
                        size={20}                              
                    />))
                }
            </div>
            <div className={css.description}>{description ? description : 'Description not available'}</div>

            {me && (
                <div className={css.likes}>
                    <br />
                    {/* <LikeButton book={book} /> */}
                </div>
            )}

            {book && <NewReview bookResult={book} handleSetAvgScore={handleSetAvgScore} />}
        </Segment>
    )
})