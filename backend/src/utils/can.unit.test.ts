import { hasPermission, canEditReview } from "./can";

describe('can', () => {
    it ('hasPermission return true for user with this particular permission', () => {
        expect(hasPermission({ permissions: ['BLOCK_CONTENT'], id: 'x' }, 'BLOCK_CONTENT')).toBeTruthy;
    })

    it ('hasPermission return false for user with no particular permission', () => {
        expect(hasPermission({ permissions: [], id: 'x' }, 'BLOCK_CONTENT')).toBeFalsy;
    })

    it ('hasPermission return true for user with "ALL" permissions', () => {
        expect(hasPermission({ permissions: ['ALL'], id: 'x' }, 'BLOCK_CONTENT')).toBeTruthy;
    })

    it ('only commenter can edit their own reviews', () => {
        expect(canEditReview({ permissions: [], id: 'x' }, { userId: 'x' })).toBeTruthy;
        expect(canEditReview({ permissions: [], id: 'unauthorized' }, { userId: 'x' })).toBeFalsy;
    })
})