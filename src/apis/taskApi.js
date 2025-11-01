import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const taskApi = createApi({
    reducerPath: 'tasks',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchTasks: builder.query({
                providesTags: ['Task'],
                // query: () => {
                //     return {
                //         url: '/tasks',
                //         method: 'GET',
                //     };
                // },
                 async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const data = response.data.record?.tasks || [];
                    return { data };
                },
            }),
            addTask: builder.mutation({
                invalidatesTags: ['Task'],
                // query: (task) => {
                //     return {
                //         url: '/tasks',
                //         method: 'POST',
                //         body: task,
                //     }
                // },
                async queryFn(newRecord, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentList = currentData.tasks || [];

                    // 2️⃣ Append new record
                    const updatedList = [...currentList, newRecord];
                    const updatedRecord = {
                        ...currentData,
                        tasks: updatedList,
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

export const { useFetchTasksQuery, useAddTaskMutation } = taskApi;
export {taskApi};