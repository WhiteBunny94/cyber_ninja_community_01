import { configureStore} from '@reduxjs/toolkit'
import { userApi } from '../apis/userApi';
import { majorApi } from '../apis/majorApi';
import { resCategoryApi } from '../apis/resCategoryApi';
import { resourcesApi } from '../apis/resourcesApi';
import { downloadApi } from '../apis/downloadApi';
import { taskApi } from '../apis/taskApi';
import { taskCompletionsApi } from '../apis/taskCompletionsApi ';
import { pointRecordApi } from '../apis/pointRecordApi';
import { loginRecordApi } from '../apis/loginRecordApi';
import { readApi } from '../apis/readApi';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath] : userApi.reducer,
        [majorApi.reducerPath] : majorApi.reducer,
        [resCategoryApi.reducerPath] : resCategoryApi.reducer,
        [resourcesApi.reducerPath] : resourcesApi.reducer,
        [downloadApi.reducerPath] : downloadApi.reducer,
        [taskApi.reducerPath] : taskApi.reducer,
        [taskCompletionsApi.reducerPath] : taskCompletionsApi.reducer,
        [pointRecordApi.reducerPath] : pointRecordApi.reducer,
        [loginRecordApi.reducerPath] : loginRecordApi.reducer,
        [readApi.reducerPath] : readApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(majorApi.middleware)
            .concat(resCategoryApi.middleware)
            .concat(resourcesApi.middleware)
            .concat(downloadApi.middleware)
            .concat(taskApi.middleware)
            .concat(taskCompletionsApi.middleware)
            .concat(pointRecordApi.middleware)
            .concat(loginRecordApi.middleware)
            .concat(readApi.middleware);
    }
});

window.Storage = store;

export { useFetchUserQuery, useAddUserMutation, useEditUserMutation, useDeleteUserMutation } from '../apis/userApi';
export { useFetchMajorQuery, useAddMajorMutation } from '../apis/majorApi';
export { useFetchCategoryQuery, useAddCategoryMutation } from '../apis/resCategoryApi';
export { useFetchResourcesQuery, useFetchResourcesByUserQuery, useAddResourcesMutation, useUpdateResourcesMutation, useDeleteResourceMutation } from '../apis/resourcesApi';
export { useFetchDownloadRecordsQuery, useAddDownloadRecordMutation } from '../apis/downloadApi';
export { useFetchTasksQuery, useAddTaskMutation } from '../apis/taskApi';
export { useFetchTaskCompletionsQuery, useAddTaskCompletionMutation } from '../apis/taskCompletionsApi ';
export { useFetchPointRecordQuery, useAddPointRecordMutation } from '../apis/pointRecordApi';
export { useFetchLoginRecordQuery, useAddLoginRecordMutation } from '../apis/loginRecordApi';
export { useFetchReadRecordsQuery, useAddReadRecordMutation } from '../apis/readApi';