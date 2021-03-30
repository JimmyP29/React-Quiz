import { createSlice } from '@reduxjs/toolkit';

export const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        score: 0,
    },
    reducers: {
        resetScore: (state) => {
            state.score = 0;
        },
        setScore: (state, action) => {
            state.score += action.payload;
        }
    }
});

export const { resetScore, setScore } = quizSlice.actions;

export default quizSlice.reducer;
