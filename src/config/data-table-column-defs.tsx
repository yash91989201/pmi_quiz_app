"use client";
import React from "react";
// UTILS
import { cn, formatDate } from "@/lib/utils";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";

import type { QuizTableSchemaType, UserSchemaType } from "@/lib/schema";

const userTableColumns: ColumnDef<UserSchemaType>[] = [
  {
    accessorKey: "userName",
    header: "Username",
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
];

export { userTableColumns, quizzesTableColumns };
