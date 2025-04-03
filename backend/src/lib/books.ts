import _ from 'lodash';

export const reviews = _.times(100, (i) => {
    return {
        book: `Book ${i}`,
        author: `Author ${i}`,
        description: `Description for Book ${i}`,
    }
})