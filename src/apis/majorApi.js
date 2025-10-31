import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const majorApi = createApi({
    reducerPath: 'majors',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchMajor: builder.query({
                providesTags: ['Major'],
                query: () => {
                    return {
                        url: '/majors',
                        method: 'GET',
                    };
                },
            }),
            addMajor: builder.mutation({
                invalidatesTags: ['Major'],
                query: (major) => {
                    return {
                        url: '/majors',
                        method: 'POST',
                        body: major,
                    }
                }
            }),
        };
    },
});

export const { useFetchMajorQuery, useAddMajorMutation } = majorApi;
export {majorApi};