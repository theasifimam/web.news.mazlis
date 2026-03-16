import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { articlesApi } from "../api/articlesApi";
import { topicsApi } from "../api/topicsApi";
import { pagesApi } from "../api/pagesApi";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [articlesApi.reducerPath]: articlesApi.reducer,
        [topicsApi.reducerPath]: topicsApi.reducer,
        [pagesApi.reducerPath]: pagesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            articlesApi.middleware,
            topicsApi.middleware,
            pagesApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
