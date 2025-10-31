import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const loginRecordApi = createApi({
    reducerPath: 'login_records',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
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