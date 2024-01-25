"use client";
import React from "react";
import Link from "next/link";
// UTILS
import { cn, formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
import type { QuizTableSchemaType, UserSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { DeleteQuizModal } from "@/components/admin/quizzes/delete-quiz-modal";
import { DeleteUserModal } from "@/components/admin/quizzes/delete-user-modal";
// CONSTANTS
import { DUMMY_EMAIL_PREFIX, STATUS_TEXT } from "@/config/constants";
import { Badge } from "@/components/ui/badge";

export const userTableColumns: ColumnDef<UserSchemaType>[] = [
  {
    accessorKey: "name",
    header: "Username",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.id}`}
        className={cn(buttonVariants({ variant: "link" }), "p-0 text-gray-700")}
      >
        {row.original.name}
      </Link>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.email;
      const isDummyEmail = email.startsWith(DUMMY_EMAIL_PREFIX);
      const fieldText = isDummyEmail ? "Not Added" : email;

      return (
        <Badge variant={isDummyEmail ? "destructive" : "outline"}>
          {fieldText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const emailVerified = row.original.emailVerified;
      const fieldText = !!emailVerified ? formatDate(emailVerified) : "No";
      return (
        <Badge variant={!!emailVerified ? "outline" : "destructive"}>
          {fieldText}
        </Badge>
      );
    },
  },
  {
    accessorKey: "totalQuizzes",
    header: "Total Quizzes",
  },
  {
    accessorKey: "Actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <DeleteUserModal id={row.original.id} />
      </div>
    ),
  },
];

export const quizzesTableColumns: ColumnDef<QuizTableSchemaType>[] = [
  {
    accessorKey: "quizTitle",
    header: "Quiz Title",
    cell: ({ row }) => (
      <Link
        href={`/admin/quizzes/${row.original.quizId}`}
        className={cn(buttonVariants({ variant: "link" }), "p-0 text-gray-700")}
      >
        {row.original.quizTitle}
      </Link>
    ),
  },
  {
    accessorKey: "totalQuestions",
    header: "Total Questions",
  },
  {
    accessorKey: "totalMark",
    header: "Total Mark",
  },
  {
    accessorKey: "totalUsers",
    header: "Total Users",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div>
        <DeleteQuizModal quizId={row.original.quizId} />
      </div>
    ),
  },
];

type UserQuizzesTableSchemaType = {
  userQuizId: string;
  userId: string;
  quizId: string;
  score: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  quizTitle: string | null;
  totalMark: number | null;
};

export const userQuizzesTableColumnsForAdmin: ColumnDef<UserQuizzesTableSchemaType>[] =
  [
    {
      accessorKey: "quizTitle",
      header: "Quiz",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <p>{STATUS_TEXT[row.original.status]}</p>,
    },
    {
      accessorKey: "score",
      header: "Score",
    },
    {
      accessorKey: "totalMark",
      header: "Total Mark",
    },
  ];

export const userQuizzesTableColumnsForUser: ColumnDef<UserQuizzesTableSchemaType>[] =
  [
    {
      accessorKey: "quizTitle",
      header: "Quiz",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <p>{STATUS_TEXT[row.original.status]}</p>,
    },
    {
      accessorKey: "score",
      header: "Score",
    },
    {
      accessorKey: "totalMark",
      header: "Total Mark",
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => (
        <Link
          href={`/quizzes/${row.original.userQuizId}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            " text-gray-700",
            row.original.status === "COMPLETED" &&
              "pointer-events-none text-gray-500",
          )}
        >
          Start Quiz
        </Link>
      ),
    },
  ];

type UsersQuizzesTableSchemaType = {
  userQuizId: string;
  userId: string;
  quizId: string;
  name: string | null;
  score: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  quizTitle: string | null;
  totalMark: number | null;
};

export const usersQuizzesTableColumns: ColumnDef<UsersQuizzesTableSchemaType>[] =
  [
    {
      accessorKey: "name",
      header: "Username",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <p>{STATUS_TEXT[row.original.status]}</p>,
    },
    {
      accessorKey: "score",
      header: "Score",
    },
    {
      accessorKey: "totalMark",
      header: "Total Mark",
    },
  ];
