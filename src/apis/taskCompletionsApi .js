import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const taskCompletionsApi = createApi({
    reducerPath: 'tasks_completions',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchTaskCompletions: builder.query({
                providesTags: ['Task_Completion'],
                // query: () => {
                //     return {
                //         url: '/task_completions',
                //         method: 'GET',
                //     };
                // },
                 async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.task_completions || [];
                    return { data };
                },
            }),
            addTaskCompletion: builder.mutation({
                invalidatesTags: ['Task_Completion'],
                // query: (data) => {
                //     return {
                //         url: '/task_completions',
                //         method: 'POST',
                //         body: data,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.task_completions || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        task_completions: updatedList,
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

export const { useFetchTaskCompletionsQuery, useAddTaskCompletionMutation } = taskCompletionsApi;
export {taskCompletionsApi};