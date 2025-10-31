import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const loginRecordApi = createApi({
    reducerPath: 'login_records',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/',
    }),
    endpoints(builder) {
        return {
            fetchLoginRecord: builder.query({
                providesTags: ['Task'],
                query: () => {
                    return {
                        url: '/login_records',
                        method: 'GET',
                    };
                },
            }),
            addLoginRecord: builder.mutation({
                invalidatesTags: ['Task'],
                query: (data) => {
                    return {
                        url: '/login_records',
                        method: 'POST',
                        body: data,
                    }
                }
            }),
        };
    },
});

export const { useFetchLoginRecordQuery, useAddLoginRecordMutation } = loginRecordApi;
export {loginRecordApi};