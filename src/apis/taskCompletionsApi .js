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
                query: () => {
                    return {
                        url: '/task_completions',
                        method: 'GET',
                    };
                },
            }),
            addTaskCompletion: builder.mutation({
                invalidatesTags: ['Task_Completion'],
                query: (data) => {
                    return {
                        url: '/task_completions',
                        method: 'POST',
                        body: data,
                    }
                }
            }),
        };
    },
});

export const { useFetchTaskCompletionsQuery, useAddTaskCompletionMutation } = taskCompletionsApi;
export {taskCompletionsApi};