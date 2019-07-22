export interface IBlogData {
    content: string;
    description: string;
    title: string;
    authors: number[];
    comments: number[];
    scanNumber: number;
    tags: number[];
    categories: number[];
}

export interface IBlog extends IBlogData {
    id: number;
    published: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}
