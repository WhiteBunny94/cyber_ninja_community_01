import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const taskCompletionsApi = createApi({
    reducerPath: 'tasks_completions',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/',
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