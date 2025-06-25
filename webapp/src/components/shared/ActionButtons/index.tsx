import { trpc } from '../../../lib/trpc';
import css from './index.module.scss';
import { useState } from 'react';
import { FaRegBookmark, FaBookmark, FaCheckCircle, FaRegCheckCircle, FaEye, FaRegEye } from 'react-icons/fa';
import { TrpcRouterOutput } from '@bookkey/backend/src/router';
import { Tooltip }from 'react-tooltip';

type ActionButtonsProps = {
    book: TrpcRouterOutput['getBooks']['books'][number];
    category: string;
    search: string | undefined;
    userId: string;
};

export const ActionButtons = ({ book, category, search, userId }: ActionButtonsProps) => {      

    const [isBookmarked, setIsBookmarked] = useState(book.savedByCurrUser);
    const [isRead, setIsRead] = useState(book.readByCurrUser);
    const [isPossessed, setIsPossessed] = useState(book.possessedByCurrUser);
    const trpcUtils = trpc.useUtils();

    const setBookmark = trpc.setBookmark.useMutation({
        onMutate: async ({ savedByCurrUser }) => {
            // Optimistically update local state
            setIsBookmarked(savedByCurrUser);

            // Cancel any outgoing refetches
            await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.key.split('/')[2];
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    savedByCurrUser,
                });
            }

            trpcUtils.getBooks.setInfiniteData({
                limit: 20,
                search: search,
                category: category === 'Home' ? 'fiction' : category}, oldData => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  pages: oldData.pages.map(page => ({
                    ...page,
                    books: page.books.map((b: TrpcRouterOutput['getBooks']['books'][number]) => {
                      if (b.key === book.key) {
                        return {
                          ...b,
                          savedByCurrUser,
                        };
                      }
                      return b;
                    }),
                  })),
                };
              }
            );

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
                const bookId = book.key.split('/')[2];
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });

    const setBookRead = trpc.setBookRead.useMutation({
        onMutate: async ({ readByCurrUser }) => {
            // Optimistically update local state
            setIsRead(readByCurrUser);

            // Cancel any outgoing refetches
            await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.key.split('/')[2];
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    readByCurrUser,
                });
            }

            trpcUtils.getBooks.setInfiniteData({
                limit: 20,
                search: search,
                category: category === 'Home' ? 'fiction' : category}, oldData => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  pages: oldData.pages.map(page => ({
                    ...page,
                    books: page.books.map((b: TrpcRouterOutput['getBooks']['books'][number]) => {
                      if (b.key === book.key) {
                        return {
                          ...b,
                          readByCurrUser,
                        };
                      }
                      return b;
                    }),
                  })),
                };
              }
            );

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
                const bookId = book.key.split('/')[2];
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });

    const setLibrary = trpc.setLibrary.useMutation({
        onMutate: async ({ possessedByCurrUser }) => {
            // Optimistically update local state
            setIsPossessed(possessedByCurrUser);

            // Cancel any outgoing refetches
            await trpcUtils.getBooks.cancel();

            // Update getBook cache if needed
            const bookId = book.key.split('/')[2];
            const previousData = trpcUtils.getBook.getData({ olid: bookId });

            if (previousData) {
                trpcUtils.getBook.setData({ olid: bookId }, {
                    ...previousData,
                    possessedByCurrUser,
                });
            }

            trpcUtils.getBooks.setInfiniteData({
                limit: 20,
                search: search,
                category: category === 'Home' ? 'fiction' : category}, oldData => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  pages: oldData.pages.map(page => ({
                    ...page,
                    books: page.books.map((b: TrpcRouterOutput['getBooks']['books'][number]) => {
                      if (b.key === book.key) {
                        return {
                          ...b,
                          possessedByCurrUser,
                        };
                      }
                      return b;
                    }),
                  })),
                };
              }
            );

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
                const bookId = book.key.split('/')[2];
                trpcUtils.getBook.setData({ olid: bookId }, context.previousData);
            }
        },
    });

    const handleClickBookmark = () => {
        setBookmark.mutate({
            bookId: book.key.split('/')[2],
            savedByCurrUser: !isBookmarked,
        });
    };

    const handleClickBookRead = () => {
        setBookRead.mutate({
            bookId: book.key.split('/')[2],
            readByCurrUser: !isRead,
        })
    }

    const handleClickLibrary = () => {
        setLibrary.mutate({
            bookId: book.key.split('/')[2],
            possessedByCurrUser: !isPossessed,
        })
    }

    return (
        <>
            <button 
                data-tooltip-id="action-tooltip"
                data-tooltip-content={isBookmarked ? "Unbookmark" : "Bookmark"}
                data-tooltip-place="top" 
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
                data-tooltip-place="top" 
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
                data-tooltip-place="top" 
                className={css.libraryBtn} 
                onClick={handleClickLibrary}>
                {isPossessed ? (
                    <FaCheckCircle className={css.iconFilled} />
                ) : (
                    <FaRegCheckCircle className={css.iconOutline} />
                )}
            </button>
            <Tooltip id="action-tooltip" />
        </>
    );
};