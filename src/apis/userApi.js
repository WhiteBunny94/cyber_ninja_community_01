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
                    // 1️⃣ Fetch users
                    const usersResponse = await baseQuery('/users');
                    if (usersResponse.error) return { error: usersResponse.error };

                    // 2️⃣ Fetch majors
                    const majorsResponse = await baseQuery('/majors');
                    if (majorsResponse.error) return { error: majorsResponse.error };

                    const users = usersResponse.data;
                    const majors = majorsResponse.data;

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
                query: (user) => {
                    return {
                        url: '/users',
                        method: 'POST',
                        body: user,
                    }
                }
            }),
            editUser: builder.mutation({
                invalidatesTags: ['User'],
                query: (user) => {
                    return {
                        url: `/users/${user.id}`,
                        method: 'PATCH',
                        body: user,
                    }
                }
            }),
            deleteUser: builder.mutation({
                invalidatesTags: ['User'],
                query: (userId) => {
                    return {
                        url: `/users/${userId}`,
                        method: 'DELETE',
                    }
                }
            }),
        };
    },
});

export const { useFetchUserQuery, useAddUserMutation, useEditUserMutation, useDeleteUserMutation } = userApi;
export { userApi };