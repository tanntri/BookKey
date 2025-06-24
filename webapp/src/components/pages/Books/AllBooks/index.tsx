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
// import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { DropdownButton } from '../../../shared/Dropdown';
import { RES } from '@bookkey/shared/src/constants';
import { getViewBookRoute } from '../../../../lib/routes';
import { useMe } from '../../../../lib/ctx';
import { CoverImage } from '../../../shared/CoverImage';
import { getAuthorNames } from '../../../../utils/utils';
import { ActionButtons } from '../../../shared/ActionButtons';

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
            {/* <Helmet>
                <title>BookKey</title>
            </Helmet> */}
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
                                            {me && <div className={css.actionButtons}><ActionButtons book={book} category={category} search={debounceSearch} userId={me.id} /></div>}
                                            {<CoverImage title={book.title as string} coverId={(book.cover_id || book.cover_i) as string} />}
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
                                    )
                                )
                            }
                    </div>
                </InfiniteScroll>)
            }
        </Segment>
    );
};
