"use client";
import { createId } from "@paralleldrive/cuid2";
import { useState } from "react";

type QuestionType = {
  id: string;
  quizId: string;
  questionText: string;
  mark: number;
};

type OptionType = {
  quizId: string;
  questionId: string;
  optionText: string;
  isCorrectOption: boolean;
};

export default function useQuiz() {
  const quizId = createId();
  const initialQuestion: QuestionType = {
    id: createId(),
    quizId,
    questionText: "",
    mark: 0,
  };
  const initialOption: OptionType[] = [
    {
      quizId,
      questionId: initialQuestion.id,
      optionText: "",
      isCorrectOption: true,
    },
    {
      quizId,
      questionId: initialQuestion.id,
      optionText: "",
      isCorrectOption: false,
    },
  ];
  const [questions, setQuestions] = useState<QuestionType[]>([initialQuestion]);
  const [options, setOptions] = useState<OptionType[]>(initialOption);
  const [totalMark, setTotalMark] = useState(5);

  const isAbleToDivideMarksEqually = totalMark / questions.length == 0;

  const addNewQuestion = () => {
    const newQuestion = {
      id: createId(),
      quizId,
      questionText: "",
      mark: 0,
    };
    // add new question object to list of all questions
    let updatedQuestions: QuestionType[] = [];
    if (questions?.length === 0) {
      updatedQuestions = [newQuestion];
    } else {
      updatedQuestions = [...questions, newQuestion].filter(Boolean);
    }

    setQuestions(updatedQuestions);
    // create two new options for newly created question
    const newQuestionOptions: OptionType[] = [
      {
        quizId,
        questionId: newQuestion.id,
        optionText: "",
        isCorrectOption: true,
      },
      {
        quizId,
        questionId: newQuestion.id,
        optionText: "",
        isCorrectOption: false,
      },
    ];
    let updatedQuestionOptions: OptionType[] = [];
    if (options?.length === 0) {
      updatedQuestionOptions = newQuestionOptions;
    } else {
      updatedQuestionOptions = [...options, ...newQuestionOptions];
    }
    setOptions(updatedQuestionOptions);
  };

  const appendOptionToQuestion = (questionId: string) => {
    const newOption = {
      quizId,
      questionId: questionId,
      optionText: "",
      isCorrectOption: false,
    };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
  };

  const setQuestionText = ({
    questionId,
    text,
  }: {
    questionId: string;
    text: string;
  }) => {
    const updatedQuestionList = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, questionText: text };
      }
      return question;
    });

    setQuestions(updatedQuestionList);
  };

  const getQuestionOptions = (questionId: string) => {
    const questionOptions = options.filter(
      (option) => option.questionId === questionId,
    );
    return questionOptions;
  };

  const divideMarksEqually = () => {
    const currentQuestionList = questions;
  };

  return {
    quizId,
    questions,
    options,
    totalMark,
    isAbleToDivideMarksEqually,
    getQuestionOptions,
    divideMarksEqually,
    addNewQuestion,
    setQuestionText,
    appendOptionToQuestion,
  };
}
