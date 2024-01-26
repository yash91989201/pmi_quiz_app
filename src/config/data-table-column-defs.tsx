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
import { Badge } from "@/components/ui/badge";
import { DeleteQuizModal } from "@/components/admin/quizzes/delete-quiz-modal";
import { DeleteUserModal } from "@/components/admin/quizzes/delete-user-modal";
import DeleteUserQuizButton from "@/components/admin/user/delete-user-quiz-button";
// CONSTANTS
import { DUMMY_EMAIL_PREFIX, STATUS_TEXT } from "@/config/constants";
import { Edit2, Eye, FileCheck2 } from "lucide-react";

export const userTableColumns: ColumnDef<UserSchemaType>[] = [
  {
    accessorKey: "name",
    header: "Username",
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
      <div className="space-x-3">
        <Link
          title="View User Info"
          href={`/admin/users/${row.original.id}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-fit p-3 text-gray-700 hover:bg-amber-100 hover:text-amber-500 [&>svg]:size-4",
          )}
        >
          <Eye />
        </Link>
        <Link
          title="Update User Info"
          href={`/admin/users/${row.original.id}/update-user`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-fit p-3 text-gray-700 hover:bg-blue-100 hover:text-blue-500 [&>svg]:size-4",
          )}
        >
          <Edit2 />
        </Link>
        <DeleteUserModal id={row.original.id} />
      </div>
    ),
  },
];

export const quizTableColumns: ColumnDef<QuizTableSchemaType>[] = [
  {
    accessorKey: "quizTitle",
    header: "Quiz Title",
  },
  {
    accessorKey: "totalQuestions",
    header: "Questions",
  },
  {
    accessorKey: "totalMark",
    header: "Total Mark",
  },
  {
    accessorKey: "totalUsers",
    header: "Users",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="space-x-3">
        <Link
          title="View Quiz Info"
          href={`/admin/quizzes/${row.original.quizId}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-fit p-3 text-gray-700 hover:bg-amber-100 hover:text-amber-500 [&>svg]:size-4",
          )}
        >
          <Eye />
        </Link>
        <Link
          title="View Quiz Result"
          href={`/admin/quizzes/${row.original.quizId}/quiz-result`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-fit p-3 text-gray-700 hover:bg-green-100 hover:text-green-500 [&>svg]:size-4",
          )}
        >
          <FileCheck2 />
        </Link>
        <Link
          title="Edit Quiz"
          href={`/admin/quizzes/${row.original.quizId}/edit-quiz`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-fit p-3 text-gray-700 hover:bg-blue-100 hover:text-blue-500 [&>svg]:size-4",
          )}
        >
          <Edit2 />
        </Link>
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
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <>
          <DeleteUserQuizButton
            userQuizId={row.original.userQuizId}
            userQuizStatus={row.original.status}
          />
        </>
      ),
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
