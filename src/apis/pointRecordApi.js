import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const pointRecordApi = createApi({
    reducerPath: 'point_records',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchPointRecord: builder.query({
                providesTags: ['Task'],
                query: () => {
                    return {
                        url: '/point_records',
                        method: 'GET',
                    };
                },
            }),
            addPointRecord: builder.mutation({
                invalidatesTags: ['Task'],
                query: (data) => {
                    return {
                        url: '/point_records',
                        method: 'POST',
                        body: data,
                    }
                }
            }),
        };
    },
});

export const { useFetchPointRecordQuery, useAddPointRecordMutation } = pointRecordApi;
export {pointRecordApi};