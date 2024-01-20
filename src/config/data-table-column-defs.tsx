"use client";
import React from "react";
// UTILS
import { cn, formatDate } from "@/lib/utils";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";

import type { QuizTableSchemaType, UserSchemaType } from "@/lib/schema";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
    accessorKey: "quizzesAdded",
    header: "Quizzes Added",
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

// const userQuizzesTableColumns=[]

export { userTableColumns, quizzesTableColumns };
