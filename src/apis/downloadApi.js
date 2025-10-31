import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const downloadApi = createApi({
    reducerPath: 'download_records',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/',
    }),
    endpoints(builder) {
        return {
            fetchDownloadRecords: builder.query({
                providesTags: ['DownloadRecord'],
                query: () => {
                    return {
                        url: '/download_records',
                        method: 'GET',
                    };
                },
            }),
            addDownloadRecord: builder.mutation({
                invalidatesTags: ['DownloadRecord'],
                query: (user) => {
                    return {
                        url: '/download_records',
                        method: 'POST',
                        body: user,
                    }
                }
            }),
        };
    },
});

export const { useFetchDownloadRecordsQuery, useAddDownloadRecordMutation } = downloadApi;
export {downloadApi};