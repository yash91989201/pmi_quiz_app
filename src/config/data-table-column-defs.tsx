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

      return (
        <p
          className={cn(
            "w-fit rounded-full px-4 py-0.5",
            isDummyEmail && "bg-red-100 text-red-500",
          )}
        >
          {isDummyEmail ? "Not Added" : email}
        </p>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const emailVerified = row.original.emailVerified;

      return (
        <p
          className={cn(
            "w-fit rounded-full px-4 py-0.5",
            !!emailVerified
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500",
          )}
        >
          {!!emailVerified ? formatDate(emailVerified) : "No"}
        </p>
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
    accessorKey: "Actions",
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

export const userQuizzesTableColumns: ColumnDef<UserQuizzesTableSchemaType>[] =
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
