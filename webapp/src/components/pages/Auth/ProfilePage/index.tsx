// TODO: Make TRPC calls separately for each tab

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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        const profileInfo = checkExists(queryResult?.data, 'Bookmarks empty');
        const me = ctx.me;
        // just an example on the use of checkAccess
        // checkAccess(ctx.me?.id === book.id, 'Book not by current user')
        return {
            profileInfo, me  // pass in 'me' in case we need it in the future
        }
    }
})
(({ profileInfo, me }) => {
    const allBookmark = profileInfo.booksMarked?.map((bookmark: any) => {
        return (
            <div className={css.book} key={bookmark.key} onMouseLeave={() => {}}>
                {getCoverImage(bookmark.title, bookmark.cover)}
                <Segment
                    size={2}
                    title={
                        <Link className={css.bookLink} to={getViewBookRoute({ olid: bookmark.id })}>{bookmark.title}</Link>
                    }
                    score={bookmark.avgScore}
                    // description={`${RES.common.authors}: ${bookmark.author}`}>
                    >
                </Segment>
            </div>
        );
    });

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
                    // description={`${RES.common.authors}: ${bookRead.author}`}>
                    >
                </Segment>
            </div>
        );
    });

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
                    // description={`Authors: ${bookPossessed.author}`}>
                    >
                </Segment>
            </div>
        );
    });

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
                                size={20} />
                            ))}
                    </div>
                    <p>{bookReview.review.text}</p>
                </Segment>
            </div>
        );
    });

    console.log(profileInfo.bookStats);

    return (
        <Segment title={me ? `${RES.profile.userProfile(me.username)}` : `${RES.profile.profilePage}`}>
            <div className={css.profileHeader}>
                <img className={css.avatar} src={getAvatarUrl(profileInfo.userInfo?.avatar, 'small')} alt="" />
                <p>{profileInfo.userInfo?.username}</p>
            </div>
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Books</Tab>
                        <Tab>Reviews</Tab>
                        <Tab>Analytics</Tab>
                    </TabList>
                    <TabPanel>
                        <Tabs forceRenderTabPanel>
                            <TabList>
                                <Tab>Library</Tab>
                                <Tab>Bookmarks</Tab>
                                <Tab>Read</Tab>
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
                        </Tabs>
                    </TabPanel>
                    <TabPanel>
                        <div className={css.reviews}>
                            {userReviews}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className={css.chartContainer}>
                            <h3 className={css.chartTitle}>Books Statistics</h3>
                            <ResponsiveContainer width="100%" aspect={3} className={css.responsiveContainer}>
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={profileInfo.bookStats}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="library" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="bookRead" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                            <ResponsiveContainer width="100%" aspect={3} className={css.responsiveContainer}>
                                <BarChart width={730} height={250} data={profileInfo.bookStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="library" fill="#8884d8" />
                                    <Bar dataKey="bookRead" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </Segment>
    );
});