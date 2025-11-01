import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { appBaseUrl } from '../Global';

const userApi = createApi({
    reducerPath: 'users',
    baseQuery: fetchBaseQuery({
        baseUrl: `${appBaseUrl}`,
    }),
    endpoints(builder) {
        return {
            fetchUser: builder.query({
                providesTags: ['User'],
                async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch response
                    const response = await baseQuery('');
                    if (response.error) return { error: response.error };

                    const users = response.data.record?.users || [];
                    const majors = response.data.record?.majors || [];

                    // 3️⃣ Merge by majorId
                    const data = users.map(user => {
                        const major = majors.find(m => m.id === user.majorId);
                        return {
                            ...user,
                            majorName: major ? major.name : 'Unknown Major',
                        };
                    });

                    return { data };
                },
            }),
            addUser: builder.mutation({
                invalidatesTags: ['User'],
                // query: (user) => {
                //     return {
                //         url: '/users',
                //         method: 'POST',
                //         body: user,
                //     }
                // }, 
                async queryFn(newUser, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentUsers = currentData.users || [];

                    // 2️⃣ Append new user
                    const updatedUsers = [...currentUsers, newUser];
                    const updatedRecord = {
                        ...currentData,
                        users: updatedUsers,
                    };

                    // 3️⃣ Update JSONBin
                    const updateResponse = await baseQuery('', {
                        method: 'PUT', // JSONBin replaces the whole record
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },
            }),
            editUser: builder.mutation({
                invalidatesTags: ['User'],
                // query: (user) => {
                //     return {
                //         url: `/users/${user.id}`,
                //         method: 'PATCH',
                //         body: user,
                //     }
                // },
                async queryFn(userToEdit, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentUsers = currentData.users || [];

                    // 2️⃣ Replace the user with matching id
                    const updatedUsers = currentUsers.map(u => u.id === userToEdit.id ? userToEdit : u);
                    const updatedRecord = {
                        ...currentData,
                        users: updatedUsers,
                    };

                    // 3️⃣ Update JSONBin
                    const updateResponse = await baseQuery('', {
                        method: 'PUT',
                        body: updatedRecord,
                    });

                    if (updateResponse.error) return { error: updateResponse.error };
                    return { data: updateResponse.data };
                },
            }),
            deleteUser: builder.mutation({
                invalidatesTags: ['User'],
                // query: (userId) => {
                //     return {
                //         url: `/users/${userId}`,
                //         method: 'DELETE',
                //     }
                // }
                async queryFn(userId, _queryApi, _extraOptions, baseQuery) {
                    // 1️⃣ Fetch current record
                    const currentResponse = await baseQuery('');
                    if (currentResponse.error) return { error: currentResponse.error };

                    const currentData = currentResponse.data.record || {};
                    const currentUsers = currentData.users || [];

                    // 2️⃣ Remove the user
                    const updatedUsers = currentUsers.filter(u => u.id !== userId);
                    const updatedRecord = {
                        ...currentData,
                        users: updatedUsers,
                    };

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

export const { useFetchUserQuery, useAddUserMutation, useEditUserMutation, useDeleteUserMutation } = userApi;
export { userApi };