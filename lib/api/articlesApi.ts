import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Article {
    _id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    author: {
        _id: string;
        fullName: string;
        username: string;
        avatar?: string;
    };
    topic: Array<{
        _id: string;
        name: string;
    }>;
    readCount: number;
    createdAt: string;
}

export const articlesApi = createApi({
    reducerPath: "articlesApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Articles"],
    endpoints: (builder) => ({
        getArticles: builder.query<{ success: boolean; data: Article[] }, { topic?: string; author?: string; page?: number; limit?: number; status?: 'published' | 'draft' }>({
            query: (params) => ({
                url: "/articles",
                method: "GET",
                params,
            }),
            providesTags: ["Articles"],
        }),
        getArticleById: builder.query<{ success: boolean; data: Article }, string>({
            query: (id) => ({
                url: `/articles/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Articles", id }],
        }),
        getArticleBySlug: builder.query<{ success: boolean; data: Article }, string>({
            query: (slug) => ({
                url: `/articles/slug/${slug}`,
                method: "GET",
            }),
            providesTags: (result, error, slug) => [{ type: "Articles", id: slug }],
        }),
    }),
});

export const { useGetArticlesQuery, useGetArticleByIdQuery, useGetArticleBySlugQuery } = articlesApi;
