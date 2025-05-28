import { withPageWrapper } from "../../../../lib/pageWrapper";
import { getProfileRoute } from "../../../../lib/routes";
import { Segment } from "../../../shared/Segment/segment";
import css from "./index.module.scss";
import { getAvatarUrl } from "@bookkey/shared/src/cloudinary";
import { trpc } from "../../../../lib/trpc";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from "react-router-dom";
import { getViewBookRoute } from "../../../../lib/routes";
import { RES } from "@bookkey/shared/src/constants";
import { Icon } from "../../../shared/Icons";

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

export const ProfilePage = withPageWrapper({
    useQuery: () => {
        const { userId } = getProfileRoute.useParams();
        // return trpc.getBookmarks.useQuery({userId})
        const profileInfo = trpc.getUserProfile.useQuery(
            {userId},
            {
                staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
                cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
                refetchOnWindowFocus: false, // avoid refetching every time user switches tab
            }
        )
        return profileInfo;
    },
    setProps: ({ queryResult, ctx, checkExists }) => {
        console.log(queryResult);
        const profileInfo = checkExists(queryResult?.data, 'Bookmarks empty');
        const me = ctx.me
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            profileInfo, me  // pass in 'me' in case we need it in the future
        }
    }
})
(({ profileInfo, me }) => {
    console.log(profileInfo);
    const allBookmark = profileInfo.booksMarked?.map((bookmark: any) => {
        console.log(bookmark);
        return (
                <div className={css.book} key={bookmark.key} onMouseLeave={() => {}}>
                    {getCoverImage(bookmark.title, bookmark.cover)}
                    <Segment
                        size={2}
                        title={
                            <Link className={css.bookLink} to={getViewBookRoute({ olid: bookmark.id })}>{bookmark.title}</Link>
                        }
                        score={bookmark.avgScore}
                        description={`${RES.common.authors}: ${bookmark.author}`}>
                    </Segment>
                </div>
        )
    })

    const allBooksRead = profileInfo.booksRead?.map((bookRead: any) => {
        return (
            <div className={css.book} key={bookRead.key} onMouseLeave={() => {}}>
                {getCoverImage(bookRead.title, bookRead.cover)}
                <Segment
                    size={2}
                    title={
                        <Link className={css.bookLink} to={getViewBookRoute({ olid: bookRead.id })}>{bookRead.title}</Link>
                    }
                    score={bookRead.avgScore}
                    description={`${RES.common.authors}: ${bookRead.author}`}>
                </Segment>
            </div>
    )
    })

    const allBooksPossessed = profileInfo.booksPossessed?.map((bookPossessed: any) => {
        return (
            <div className={css.book} key={bookPossessed.key} onMouseLeave={() => {}}>
                {getCoverImage(bookPossessed.title, bookPossessed.cover)}
                <Segment
                    size={2}
                    title={
                        <Link className={css.bookLink} to={getViewBookRoute({ olid: bookPossessed.id })}>{bookPossessed.title}</Link>
                    }
                    score={bookPossessed.avgScore}
                    description={`Authors: ${bookPossessed.author}`}>
                </Segment>
            </div>
    )
    })

    const userReviews = profileInfo.booksReviewed?.map((bookReview: any) => {
        return (
            <div className={css.review} key={bookReview.review.id} onMouseLeave={() => {}}>
                {getCoverImage(bookReview.book.title, bookReview.book.cover)}
                <Segment
                    size={2}
                    title={
                        <Link className={css.bookLink} to={getViewBookRoute({ olid: bookReview.book.id })}>{bookReview.book.title}</Link>
                    }>
                    <h2 className={css.reviewTitle}>{bookReview.review.title}</h2>
                    <div className={css.stars}>
                        {[...Array(5)].map((_, i) => (
                            <Icon
                                key={i}
                                name="star"
                                className={`${i < bookReview.review.score ? css.filledStar : css.emptyStar}`}
                                // style={{ color: i < bookReview.review.score ? 'var(--yellow)' : '#ccc' }}
                                size={20} />
                            ))}
                    </div>
                    <p>{bookReview.review.text}</p>
                </Segment>
            </div>
        )
    })

    return (
        <Segment title={me ? `${RES.profile.userProfile(me.username)}` : `${RES.profile.profilePage}`}>
            <div className={css.profileHeader}>
                <img className={css.avatar} src={getAvatarUrl(profileInfo.userInfo?.avatar, 'small')} alt="" />
                <p>{profileInfo.userInfo?.username}</p>
            </div>
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Library</Tab>
                        <Tab>Bookmarks</Tab>
                        <Tab>Read</Tab>
                        <Tab>Reviews</Tab>
                    </TabList>

                    <TabPanel>
                        <div className={css.books}>
                            {allBooksPossessed}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={css.books}>
                            {allBookmark}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={css.books}>
                            {allBooksRead}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={css.reviews}>
                            {userReviews}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </Segment>
    )
})