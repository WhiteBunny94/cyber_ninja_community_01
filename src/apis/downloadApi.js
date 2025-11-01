import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const downloadApi = createApi({
    reducerPath: 'download_records',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchDownloadRecords: builder.query({
                providesTags: ['DownloadRecord'],
                // query: () => {
                //     return {
                //         url: '/download_records',
                //         method: 'GET',
                //     };
                // },
                async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.download_records || [];
                    return { data };
                },
            }),
            addDownloadRecord: builder.mutation({
                invalidatesTags: ['DownloadRecord'],
                // query: (user) => {
                //     return {
                //         url: '/download_records',
                //         method: 'POST',
                //         body: user,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.download_records || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        download_records: updatedList,
                    };

                    // 3️⃣ Send updated record back
                    const updateResponse = await baseQuery('', {
                        method: 'PUT', // or PATCH depending on JSONBin settings
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },

            }),
        };
    },
});

export const { useFetchDownloadRecordsQuery, useAddDownloadRecordMutation } = downloadApi;
export { downloadApi };