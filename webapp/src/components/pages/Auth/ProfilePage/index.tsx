import { withPageWrapper } from "../../../../lib/pageWrapper";
import { getProfileRoute } from "../../../../lib/routes";
import { Segment } from "../../../shared/Segment/segment";
import css from "./index.module.scss";
import { getAvatarUrl } from "@bookkey/shared/src/cloudinary";
import { trpc } from "../../../../lib/trpc";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { RES } from "@bookkey/shared/src/constants";
import { Suspense } from "react";
import { lazy } from "react";

export const ProfilePage = withPageWrapper({
    useQuery: () => {
        const { userId } = getProfileRoute.useParams();
        // return trpc.getBookmarks.useQuery({userId})
        // Not using me because we want to be able to view other people's profiles
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
    const LibraryTab = lazy(() => import('./LibraryTab').then(module => ({ default: module.LibraryTab })));
    const BookmarksTab = lazy(() => import('./BookmarksTab').then(module => ({ default: module.BookmarksTab })));
    const BooksReadTab = lazy(() => import('./BooksReadTab').then(module => ({ default: module.BooksReadTab })));
    const UserReviewsTab = lazy(() => import('./ReviewsTab').then(module => ({ default: module.UserReviewsTab })));
    const AnalyticsTab = lazy(() => import('./AnalyticsTab').then(module => ({ default: module.AnalyticsTab })));

    return (
        <Segment title={profileInfo.userInfo?.username}>
            <div className={css.profileHeader}>
                <img className={css.avatar} src={getAvatarUrl(profileInfo.userInfo?.avatar, 'small')} alt="" />
                <p>{profileInfo.userInfo?.username}</p>
            </div>
            <div>
                <Tabs>
                    <TabList>
                        <Tab>{RES.profile.books}</Tab>
                        <Tab>{RES.profile.reviews}</Tab>
                        {me?.username === profileInfo.userInfo?.username ?  <Tab>{RES.profile.analytics}</Tab> : null}
                    </TabList>
                    <TabPanel>
                        <Tabs>
                            <TabList>
                                <Tab>{RES.profile.library}</Tab>
                                {me?.username === profileInfo.userInfo?.username ? <Tab>{RES.profile.bookmarks}</Tab> : null}
                                <Tab>{RES.profile.read}</Tab>
                            </TabList>
                            <TabPanel>
                                <Suspense>
                                    <LibraryTab userId={profileInfo.userInfo?.id!} />
                                </Suspense>
                            </TabPanel>
                            {me?.username === profileInfo.userInfo?.username ? <TabPanel>
                                <Suspense>
                                    <BookmarksTab userId={profileInfo.userInfo?.id!} />
                                </Suspense>
                            </TabPanel> : null}
                            <TabPanel>
                                <Suspense>
                                    <BooksReadTab userId={profileInfo.userInfo?.id!} />
                                </Suspense>
                            </TabPanel>
                        </Tabs>
                    </TabPanel>
                    <TabPanel>
                        <Suspense>
                            <UserReviewsTab userId={profileInfo.userInfo?.id!} />
                        </Suspense>
                    </TabPanel>
                    <TabPanel>
                        <Suspense>
                            <AnalyticsTab userId={profileInfo.userInfo?.id!} />
                        </Suspense>
                    </TabPanel>
                </Tabs>
            </div>
        </Segment>
    );
});