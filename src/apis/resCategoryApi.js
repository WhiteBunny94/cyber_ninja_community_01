import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const resCategoryApi = createApi({
    reducerPath: 'resource_categories',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005/',
    }),
    endpoints(builder) {
        return {
            fetchCategory: builder.query({
                providesTags: ['Category'],
                query: () => {
                    return {
                        url: '/resource_categories',
                        method: 'GET',
                    };
                },
            }),
            addCategory: builder.mutation({
                invalidatesTags: ['Category'],
                query: (category) => {
                    return {
                        url: '/resource_categories',
                        method: 'POST',
                        body: category,
                    }
                }
            }),
        };
    },
});

export const { useFetchCategoryQuery, useAddCategoryMutation } = resCategoryApi;
export {resCategoryApi};