import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const resCategoryApi = createApi({
    reducerPath: 'resource_categories',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchCategory: builder.query({
                providesTags: ['Category'],
                // query: () => {
                //     return {
                //         url: '/resource_categories',
                //         method: 'GET',
                //     };
                // },
                 async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.resource_categories || [];
                    return { data };
                },
            }),
            addCategory: builder.mutation({
                invalidatesTags: ['Category'],
                // query: (category) => {
                //     return {
                //         url: '/resource_categories',
                //         method: 'POST',
                //         body: category,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.resource_categories || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        resource_categories: updatedList,
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

export const { useFetchCategoryQuery, useAddCategoryMutation } = resCategoryApi;
export {resCategoryApi};