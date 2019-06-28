export interface IBlogData {
    content: string;
    description: string;
    title: string;
    authors: number[];
    comments: any[];
    tags: number[];
    categories: number[];
}

export interface IBlog extends IBlogData {
    id: number;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}
