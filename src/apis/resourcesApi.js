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

                    // 1️⃣ Fetch response
                    const response = await baseQuery('');
                    if (response.error) return { error: "KKK" + response.error };

                    const resources = response.data.record?.resources;
                    const categories = response.data.record?.resource_categories;

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
                // query: (userId) => {
                //     return {
                //         url: `/resources`,
                //         method: 'GET',
                //         params: {
                //             uploaderId: userId,
                //         },
                //     };
                // },
                async queryFn(uploaderId, _queryApi, _extraOptions, baseQuery) {
                    // async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {

                    // 1️⃣ Fetch response
                    const response = await baseQuery('');
                    if (response.error) return { error: "KKK" + response.error };

                    const resources = response.data.record?.resources;

                    const filteredResources = resources.filter(r => r.uploaderId === uploaderId);

                    return { data: filteredResources };
                },
            }),
            addResources: builder.mutation({
                invalidatesTags: ['Resource'],
                // query: (resource) => {
                //     return {
                //         url: '/resources',
                //         method: 'POST',
                //         body: resource,
                //     }
                // },
                async queryFn(newResource, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentResources = currentData.resources || [];

                    // 2️⃣ Append new resource
                    const updatedResources = [...currentResources, newResource];
                    const updatedRecord = { ...currentData, resources: updatedResources };

                    // 3️⃣ Update JSONBin
                    const updateResponse = await baseQuery('', {
                        method: 'PUT',
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },
            }),
            updateResources: builder.mutation({
                invalidatesTags: ['Resource'],
                // query: (data) => {
                //     return {
                //         url: `/resources/${data.id}`,
                //         method: "PATCH",
                //         body: data,
                //     }
                // },
                async queryFn(resourceToUpdate, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentResources = currentData.resources || [];

                    // 2️⃣ Replace the resource with matching id
                    const updatedResources = currentResources.map(r =>
                        r.id === resourceToUpdate.id ? resourceToUpdate : r
                    );
                    const updatedRecord = { ...currentData, resources: updatedResources };

                    // 3️⃣ Update JSONBin
                    const updateResponse = await baseQuery('', {
                        method: 'PUT',
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },
            }),
            deleteResource: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id: album.userId }];
                },
                // query: (id) => {
                //     return {
                //         url: `/resources/${id}`,
                //         method: 'DELETE'
                //     };
                // },
                async queryFn(resourceId, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentResources = currentData.resources || [];

                    // 2️⃣ Remove the resource
                    const updatedResources = currentResources.filter(r => r.id !== resourceId);
                    const updatedRecord = { ...currentData, resources: updatedResources };

                    // 3️⃣ Update JSONBin
                    const updateResponse = await baseQuery('', {
                        method: 'PUT',
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },
            }),
        };
    },
});

export const { useFetchResourcesQuery, useFetchResourcesByUserQuery, useAddResourcesMutation, useUpdateResourcesMutation, useDeleteResourceMutation } = resourcesApi;
export { resourcesApi };