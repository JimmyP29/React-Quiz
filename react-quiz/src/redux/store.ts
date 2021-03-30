import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quiz';

const store = configureStore({
    reducer: {
        quiz: quizReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
