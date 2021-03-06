import React, { useState } from 'react';

import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions, Difficulty, QuestionState } from './API';
import { GlobalStyle, Wrapper } from './App.styles';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { resetScore, setScore } from './redux/quiz'

export type AnswerState = {
  question: string;
  answer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerState[]>([]);
  const [gameOver, setGameOver] = useState(true);

  // score now retrieved from the redux store
  const { score } = useAppSelector((state) => state.quiz);
  const dispatch = useAppDispatch();

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY,
    );

    setQuestions(newQuestions);
    setUserAnswers([]);
    dispatch(resetScore());
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // Users answer
      const answer = e.currentTarget.value;

      // Check answer against the correct answer
      const isCorrect = questions[number].correct_answer === answer;

      // Add score if answer is correct (now added to the Redux store)
      if (isCorrect) dispatch(setScore(1))

      // Save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        isCorrect,
        correctAnswer: questions[number].correct_answer,
      };

      setUserAnswers(prev => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    // Move on to the next question if not the last question.
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {
          gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
            <button className='start' onClick={startTrivia}>Start</button>
          )
            :
            null
        }

        {!gameOver ? <p className='score'>Score: {score}</p> : null}

        {loading && <p>Loading Questions...</p>}

        {
          !loading && !gameOver &&
          <QuestionCard
            questionNumber={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        }

        {
          (
            !gameOver &&
            !loading &&
            userAnswers.length === number + 1 &&
            number !== TOTAL_QUESTIONS - 1
          )
            ?
            <button className='next' onClick={nextQuestion}>Next Question</button>
            :
            null
        }
      </Wrapper>
    </>
  );
}

export default App;
