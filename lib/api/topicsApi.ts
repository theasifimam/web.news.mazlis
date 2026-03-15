import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface Topic {
    _id: string;
    name: string;
    description: string;
    isParent: boolean;
    articleCount?: number;
}

export const topicsApi = createApi({
    reducerPath: "topicsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Topics"],
    endpoints: (builder) => ({
        getTopics: builder.query<{ success: boolean; data: Topic[] }, void>({
            query: () => ({
                url: "/topics",
                method: "GET",
            }),
            providesTags: ["Topics"],
        }),
    }),
});

export const { useGetTopicsQuery } = topicsApi;
