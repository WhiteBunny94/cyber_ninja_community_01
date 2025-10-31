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