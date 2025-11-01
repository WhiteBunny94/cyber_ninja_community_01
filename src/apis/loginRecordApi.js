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
                // query: () => {
                //     return {
                //         url: '/login_records',
                //         method: 'GET',
                //     };
                // },
                 async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.login_records || [];
                    return { data };
                },
            }),
            addLoginRecord: builder.mutation({
                invalidatesTags: ['Task'],
                // query: (data) => {
                //     return {
                //         url: '/login_records',
                //         method: 'POST',
                //         body: data,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.login_records || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        login_records: updatedList,
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

export const { useFetchLoginRecordQuery, useAddLoginRecordMutation } = loginRecordApi;
export {loginRecordApi};