import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const resourcesApi = createApi({
    reducerPath: 'resources',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchResources: builder.query({
                providesTags: ['Resource'],
                async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch resources
                    const resourceRes = await baseQuery('/resources');
                    if (resourceRes.error) return { error: resourceRes.error };

                    // 2️⃣ Fetch categories
                    const categoryRes = await baseQuery('/resource_categories');
                    if (categoryRes.error) return { error: categoryRes.error };

                    const resources = resourceRes.data;
                    const categories = categoryRes.data;

                    // 3️⃣ Merge by majorId
                    const data = resources.map(resource => {
                        const category = categories.find(c => c.id === resource.categoryId);
                        return {
                            ...resource,
                            categoryName: category ? category.name : 'Unknown Major',
                        };
                    });

                    return { data };
                },
            }),
            fetchResourcesByUser: builder.query({
                providesTags: ['Resource'],
                query: (userId) => {
                    return {
                        url: `/resources`,
                        method: 'GET',
                        params: {
                            uploaderId: userId,
                        },
                    };
                },
            }),
            addResources: builder.mutation({
                invalidatesTags: ['Resource'],
                query: (resource) => {
                    return {
                        url: '/resources',
                        method: 'POST',
                        body: resource,
                    }
                }
            }),
            updateResources: builder.mutation({
                invalidatesTags: ['Resource'],
                query: (data) => {
                    return {
                        url: `/resources/${data.id}`,
                        method: "PATCH",
                        body: data,
                    }
                },
            }),
            deleteResource: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id:  album.userId}];
                },
                query: (id) => {
                    return {
                        url: `/resources/${id}`,
                        method: 'DELETE'
                    };
                },
            }),
        };
    },
});

export const { useFetchResourcesQuery, useFetchResourcesByUserQuery, useAddResourcesMutation, useUpdateResourcesMutation, useDeleteResourceMutation } = resourcesApi;
export {resourcesApi};