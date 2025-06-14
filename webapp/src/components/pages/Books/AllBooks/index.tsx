import { trpc } from '../../../../lib/trpc';
import { Link } from 'react-router-dom';
import css from './index.module.scss';
import { Segment } from '../../../shared/Segment/segment';
import { Alert } from '../../../shared/Alert';
import InfiniteScroll from 'react-infinite-scroller';
import { layoutContentElRef } from '../../../core/Layout/layout';
import { Loader } from '../../../shared/Loader';
import { useForm } from '../../../../lib/form';
import { zGetBooksTrpcInput } from '@bookkey/backend/src/router/books/getBooks/input';
import { Input } from '../../../shared/Input/Input';
import { useDebounceValue } from 'usehooks-ts';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { FaRegBookmark, FaBookmark, FaCheckCircle, FaRegCheckCircle, FaEye, FaRegEye } from 'react-icons/fa';
import { DropdownButton } from '../../../shared/Dropdown';
import { TrpcRouterOutput } from '@bookkey/backend/src/router';
import { RES } from '@bookkey/shared/src/constants';
import { getViewBookRoute } from '../../../../lib/routes';
import { Tooltip }from 'react-tooltip'
import { useMe } from '../../../../lib/ctx';

type OpenLibraryWorksAuthorResponse = {
    key: string,
    name: string
}

const getAuthorNames = ({type, authors}: {type: string, authors: string[] | OpenLibraryWorksAuthorResponse[]}) => {
    // openlibrary api search uses 'docs' for books
    if (type === 'docs') {
        const authorNameJoined = authors ? authors.join(", ") : "None";
        const authorName = authorNameJoined.length > 100 ? authorNameJoined.slice(0, 97) + '...' : authorNameJoined;
        return authors ? `Authors: ${authorName}` : 'Authors: None';
    // openlibrary api category uses 'works' for books
    } else if (type === 'works') {
        if (!authors) {
            return undefined;
        }
        const getNames = authors.map((author: any) => {
            return author.name;
        })
        const authorNameJoined = getNames ? getNames.join(", ") : 'None';
        const authorName = authorNameJoined.length > 100 ? authorNameJoined.slice(0, 97) + '...' : authorNameJoined;
        return `Authors: ${authorName}`
    }
    return undefined;
}

const getCoverImage = (title: string, coverId?: string) => {
    return (
      <div className={css.cover}>
        {coverId ? (
          <img src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`} alt={`${title} cover`} loading='lazy' />
        ) : (
          <span>{title}</span>
        )}
      </div>
    );
  };

const ActionButtons = ({ book, category, search, userId }: { 
        book: TrpcRouterOutput['getBooks']['books'][number], 
        category: string, 
        search: string | undefined,
        userId: string
    }) => {       

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


export const AllBooksPages = () => {
    const me = useMe();
    const { formik } = useForm({
        initialValues: { search: '' },
        validationSchema: zGetBooksTrpcInput.pick({ search: true })
    })
    const [debounceSearch] = useDebounceValue(formik.values.search, 500);
    const [category, setCategory] = useState('Home');

    const handleCategoryChange = (newCategory: string) => {
        formik.setFieldValue('search', '');
        setCategory(newCategory)
    }

    // define event for resetting debouncesearch so it becomes empty
    // when logo or home is clicked
    useEffect(() => {
        const handleReset = () => {
            formik.setFieldValue('search', '');
            setCategory('Home');
        };

        window.addEventListener('resetBooksSearch', handleReset);
        
        return () => {
            window.removeEventListener('resetBooksSearch', handleReset);
        };
    }, [formik]);

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isRefetching,
    } = trpc.getBooks.useInfiniteQuery(
        {
            limit: 20,
            search: debounceSearch,
            category: category === 'Home' ? 'fiction' : category,
        },
        {
            getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
            staleTime: 1000 * 60 * 5, // Cache valid for 5 minutes
            keepPreviousData: true,
        }
      );

    useEffect(() => {
        document.title = 'BookKey'
    }, [])

    const type = data?.pages[0].type || '';

    return (
        <Segment title={category}>
            {/* for some reason helmet doesn't work */}
            <Helmet>
                <title>BookKey</title>
            </Helmet>
            <div className={css.searchBar}>
                <Input maxWidth={"100%"} name="search" formik={formik} search={true} />
                <DropdownButton onSelect={handleCategoryChange} optionsObject={RES.bookCategories} text="Categories" />
            </div>
            {isLoading || isRefetching ? (
                <Loader type="section" />) : isError ? (
                    <div><Alert color="red">{error.message}</Alert></div>
                ) : !data.pages[0].books.length ? (
                    <div><Alert color="brown">No Matches</Alert></div>
                ) : (
                    <InfiniteScroll
                        key={category}
                        threshold={250}
                        loadMore={() => {
                            if (!isFetchingNextPage && hasNextPage) {
                                void fetchNextPage();
                            }
                        }}
                        hasMore={hasNextPage}
                        loader={<div className={css.more} key="loader"><Loader type="section" /></div>}
                        useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
                        getScrollParent={() => layoutContentElRef.current}
                >
                    <div className={css.books}>
                        {
                            data.pages
                                .flatMap((pages) => pages.books)
                                .map((book) => (
                                    <div className={css.book} key={book.key} onMouseLeave={() => {}}>
                                        {me && <ActionButtons book={book} category={category} search={debounceSearch} userId={me.id} />}
                                        {getCoverImage(book.title, book.cover_id || book.cover_i)}
                                        <Segment
                                            size={2}
                                            title={
                                                // <Link className={css.bookLink} to={`/books/${book.key.split("/")[2]}`}>{book.title}</Link>
                                                <Link className={css.bookLink} to={getViewBookRoute({ olid: book.key.split("/")[2] })}>{book.title}</Link>
                                            }
                                            score={book.avgScore}
                                            description={getAuthorNames({type: type, authors: book.authors})  }>
                                        </Segment>
                                    </div>
                                ))
                            }
                    </div>
                </InfiniteScroll>)
                }
            </Segment>
          );
};
