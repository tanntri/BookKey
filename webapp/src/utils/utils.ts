
type OpenLibraryWorksAuthorResponse = {
    key: string,
    name: string
}

export const getAuthorNames = ({type, authors}: {type: string, authors: string[] | OpenLibraryWorksAuthorResponse[]}) => {
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