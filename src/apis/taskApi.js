import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const taskApi = createApi({
    reducerPath: 'tasks',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/',
    }),
    endpoints(builder) {
        return {
            fetchTasks: builder.query({
                providesTags: ['Task'],
                query: () => {
                    return {
                        url: '/tasks',
                        method: 'GET',
                    };
                },
            }),
            addTask: builder.mutation({
                invalidatesTags: ['Task'],
                query: (task) => {
                    return {
                        url: '/tasks',
                        method: 'POST',
                        body: task,
                    }
                }
            }),
        };
    },
});

export const { useFetchTasksQuery, useAddTaskMutation } = taskApi;
export {taskApi};