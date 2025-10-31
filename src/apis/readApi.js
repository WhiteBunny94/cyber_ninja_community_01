import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const readApi = createApi({
    reducerPath: 'read_records',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchReadRecords: builder.query({
                providesTags: ['ReadRecord'],
                query: () => {
                    return {
                        url: '/read_records',
                        method: 'GET',
                    };
                },
            }),
            addReadRecord: builder.mutation({
                invalidatesTags: ['ReadRecord'],
                query: (user) => {
                    return {
                        url: '/read_records',
                        method: 'POST',
                        body: user,
                    }
                }
            }),
        };
    },
});

export const { useFetchReadRecordsQuery, useAddReadRecordMutation } = readApi;
export {readApi};