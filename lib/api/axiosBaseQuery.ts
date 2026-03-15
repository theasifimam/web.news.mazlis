import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { type AxiosRequestConfig, type AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const axiosBaseQuery =
    (
        { base }: { base?: string } = {}
    ): BaseQueryFn<
        {
            url: string;
            method?: AxiosRequestConfig["method"];
            data?: AxiosRequestConfig["data"];
            params?: AxiosRequestConfig["params"];
        },
        unknown,
        unknown
    > =>
    async ({ url, method = "GET", data, params }) => {
        try {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("mazlis_token")
                    : null;

            const headers: Record<string, string> = {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            };

            if (!(data instanceof FormData)) {
                headers["Content-Type"] = "application/json";
            }

            const result = await axios({
                url: (base ?? baseURL) + url,
                method,
                data,
                params,
                withCredentials: true,
                headers,
            });
            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };
