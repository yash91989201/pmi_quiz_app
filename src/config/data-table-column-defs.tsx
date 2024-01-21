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

const userTableColumns: ColumnDef<UserSchemaType>[] = [
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
      const isDummyEmail = email.startsWith("dummy_email");

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
];

const quizzesTableColumns: ColumnDef<QuizTableSchemaType>[] = [
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

// const userQuizzesTableColumns=[]

export { userTableColumns, quizzesTableColumns };
