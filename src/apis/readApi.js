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
                // query: () => {
                //     return {
                //         url: '/read_records',
                //         method: 'GET',
                //     };
                // },
                 async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.read_records || [];
                    return { data };
                },
            }),
            addReadRecord: builder.mutation({
                invalidatesTags: ['ReadRecord'],
                // query: (user) => {
                //     return {
                //         url: '/read_records',
                //         method: 'POST',
                //         body: user,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.read_records || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        read_records: updatedList,
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

export const { useFetchReadRecordsQuery, useAddReadRecordMutation } = readApi;
export {readApi};