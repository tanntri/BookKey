import type { Review, User, Permission } from "@prisma/client"

type MaybeUser = Pick<User, 'permissions' | 'id'> | null;
type MaybeReview = Pick<Review, 'userId'> | null;

const hasPermission = (user: MaybeUser, permissions: Permission) => {
    return user?.permissions.includes(permissions) || user?.permissions.includes('ALL') || false; 
}

export const canBlockContent = (user: MaybeUser) => {
    return hasPermission(user, 'BLOCK_CONTENT');
}

export const canEditReview = (user: MaybeUser, review: MaybeReview) => {
    return !!user && !!review && (user?.id === review?.userId);
}
