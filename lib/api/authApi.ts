import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export interface User {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    role: "reader" | "author" | "editor" | "admin";
    status: "active" | "suspended" | "pending";
    avatar?: string;
    isVerified: boolean;
    bio?: string;
    location?: string;
    mNumber?: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
        website?: string;
    };
    bookmarks?: any[];
    followedTopics?: any[];
    createdAt: string;
    lastLogin?: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface OtpResponse {
    success: boolean;
    message: string;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        // Sign in with email + password
        signin: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: (credentials: any) => ({
                url: "/auth/signin",
                method: "POST",
                data: credentials,
            }),
        }),

        // Sign up (full registration)
        signup: builder.mutation<
            AuthResponse,
            { fullName: string; username: string; email: string; password: string }
        >({
            query: (body: any) => ({
                url: "/auth/signup",
                method: "POST",
                data: body,
            }),
        }),

        // Send OTP to email
        sendOtp: builder.mutation<OtpResponse, { email: string; fullName?: string; purpose: "signup" | "signin" }>({
            query: (body: any) => ({
                url: "/auth/otp/send",
                method: "POST",
                data: body,
            }),
        }),

        // Verify OTP
        verifyOtp: builder.mutation<OtpResponse, { email: string; otp: string }>({
            query: (body: any) => ({
                url: "/auth/otp/verify",
                method: "POST",
                data: body,
            }),
        }),

        // Get current user
        getMe: builder.query<{ success: boolean; data: { user: User } }, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
            }),
            providesTags: ["Auth"],
        }),

        // Sign out
        signout: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "/auth/signout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),

        // Update own password
        updatePassword: builder.mutation<
            { success: boolean; message: string },
            { currentPassword: string; newPassword: string }
        >({
            query: (body: any) => ({
                url: "/auth/update-password",
                method: "PATCH",
                data: body,
            }),
        }),

        // ─── USER PROFILE ENDPOINTS ───
        getProfile: builder.query<{ success: boolean; data: { user: User } }, void>({
            query: () => ({
                url: "/users/me/profile",
                method: "GET",
            }),
            providesTags: ["Auth"],
        }),

        getPublicProfile: builder.query<{ success: boolean; data: { user: User } }, string>({
            query: (username) => ({
                url: `/users/public/${username}`,
                method: "GET",
            }),
        }),

        updateProfile: builder.mutation<
            { success: boolean; message: string; data: { user: User } },
            FormData | (Partial<User> & { mNumber?: string; bio?: string; location?: string; socials?: any; settings?: any })
        >({
            query: (body: any) => ({
                url: "/users/me/update",
                method: "PATCH",
                data: body,
            }),
            invalidatesTags: ["Auth"],
        }),
    }),
});

export const {
    useSigninMutation,
    useSignupMutation,
    useSendOtpMutation,
    useVerifyOtpMutation,
    useGetMeQuery,
    useSignoutMutation,
    useUpdatePasswordMutation,
    useGetProfileQuery,
    useGetPublicProfileQuery,
    useUpdateProfileMutation,
} = authApi;
