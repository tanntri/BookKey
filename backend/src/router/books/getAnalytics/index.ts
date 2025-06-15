import _ from 'lodash';
import { trpcLoggedProcedure } from '../../../lib/trpc';
import { z } from 'zod';
import { AppContext } from '../../../lib/ctx';

// Get book statistics for a user, grouped by month and source (bookRead or library)
const getBookStats = async (ctx: AppContext, userId: string) => {
    const year = 2025;

    // Raw SQL query to get counts of bookRead and library entries per month
    const result: { month: string; source: string; count: number }[] = await ctx.prisma.$queryRaw`
        SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, 'bookRead' AS source, COUNT(*) AS count
        FROM "BookRead"
        WHERE "userId" = ${userId}
        AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month

        UNION ALL

        SELECT TO_CHAR("createdAt", 'YYYY-MM') AS month, 'library' AS source, COUNT(*) AS count
        FROM "Library"
        WHERE "userId" = ${userId}
        AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY month`;

    // Generate a list of all months in the year
    const months = Array.from({ length: 12 }, (_, i) =>
        `${year}-${String(i + 1).padStart(2, '0')}`
    );
  
    // Map the results to ensure each month is represented, even if count is zero
    const output = months.map((month) => {
        const libraryEntry = result.find((r) => r.month === month && r.source === 'library');
        const bookReadEntry = result.find((r) => r.month === month && r.source === 'bookRead');
    
        return {
            name: month,
            library: Number(libraryEntry?.count || 0),
            bookRead: Number(bookReadEntry?.count || 0),
        };
    });
    return output
}

// TRPC route to get analytics data for a user
export const getAnalyticsTrpcRoute = trpcLoggedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
        const bookStats = await getBookStats(ctx, input.userId)
        return {
            bookStats
        }
    }
)