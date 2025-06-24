// import css from "../index.module.scss";
// import { trpc } from "../../../../../lib/trpc";
// import { RES } from "@bookkey/shared/src/constants";
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Loader } from "../../../../shared/Loader";

// export const AnalyticsTab = ({userId}: {userId: string}) => {
    export const AnalyticsTab = () => {
    // const { data: analyticsData, isLoading } = trpc.getAnalytics.useQuery(
    //         { userId },
    //         {
    //             staleTime: 1000 * 60 * 5, // 5 minutes: data stays fresh
    //             cacheTime: 1000 * 60 * 10, // 10 minutes: keeps it in memory
    //             refetchOnWindowFocus: false, // avoid refetching every time user switches tab
    //         });
    
    //     if (isLoading) {
    //         return <Loader type="section" />;
    //     }
    
    //     if (!analyticsData) {
    //         return <div>No data found.</div>;
    //     }
    return (
        <div>Analytics Coming Soon!</div>
        // <div className={css.chartContainer}>
        //     <h3 className={css.chartTitle}>{RES.profile.booksStatistics}</h3>
        //     <ResponsiveContainer width="100%" aspect={3} className={css.responsiveContainer}>
        //         <LineChart
        //             width={500}
        //             height={300}
        //             data={analyticsData.bookStats}
        //             margin={{
        //                 top: 5,
        //                 right: 30,
        //                 left: 20,
        //                 bottom: 5,
        //             }}>
        //             <CartesianGrid strokeDasharray="3 3" />
        //             <XAxis dataKey="name" />
        //             <YAxis />
        //             <Tooltip />
        //             <Legend />
        //             <Line type="monotone" dataKey="library" stroke="#8884d8" activeDot={{ r: 8 }} />
        //             <Line type="monotone" dataKey="bookRead" stroke="#82ca9d" />
        //         </LineChart>
        //     </ResponsiveContainer>
        //     <ResponsiveContainer width="100%" aspect={3} className={css.responsiveContainer}>
        //         <BarChart width={730} height={250} data={analyticsData.bookStats}>
        //             <CartesianGrid strokeDasharray="3 3" />
        //             <XAxis dataKey="name" />
        //             <YAxis />
        //             <Tooltip />
        //             <Legend />
        //             <Bar dataKey="library" fill="#8884d8" />
        //             <Bar dataKey="bookRead" fill="#82ca9d" />
        //         </BarChart>
        //     </ResponsiveContainer>
        // </div>
    );
}