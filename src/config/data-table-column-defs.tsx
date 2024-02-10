"use client";
// UTILS
import { formatDate } from "@/lib/utils";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
import type {
  QuizTableSchemaType,
  UserQuizSchemaType,
  UserSchemaType,
} from "@/lib/schema";
// CUSTOM COMPONENTS
import { Badge } from "@/components/ui/badge";
import UserTableActions from "@/components/admin/user/user-table-actions";
import QuizTableActions from "@/components/admin/quizzes/quiz-table-actions";
import ResetUserQuizButton from "@/components/admin/user/reset-user-quiz-button";
import UserTableActionMenu from "@/components/admin/user/user-table-action-menu";
import DeleteUserQuizButton from "@/components/admin/user/delete-user-quiz-button";
import QuizTableActionMenu from "@/components/admin/quizzes/quiz-table-action-menu";
import { UpdateCertificateModal } from "@/components/admin/user/update-certificate-modal";
// CONSTANTS
import { DUMMY_EMAIL_PREFIX, STATUS_TEXT } from "@/config/constants";

export const userTableColumns: ColumnDef<UserSchemaType>[] = [
  {
    accessorKey: "name",
    header: "Username",
    cell: ({ row }) => <p className="min-w-32">{row.original.name}</p>,
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
    header: "Total Exams",
  },
  {
    accessorKey: "Actions",
    header: () => <p className="hidden lg:block">Actions</p>,
    cell: ({ row }) => (
      <>
        <UserTableActions userId={row.original.id} />
        <UserTableActionMenu userId={row.original.id} />
      </>
    ),
  },
];

export const quizTableColumns: ColumnDef<QuizTableSchemaType>[] = [
  {
    accessorKey: "quizTitle",
    header: "Exam Name",
    minSize: 360,
    cell: ({ row }) => <p className="min-w-36">{row.original.quizTitle}</p>,
  },
  {
    accessorKey: "totalQuestions",
    header: "Questions",
    cell: ({ row }) => (
      <p className="min-w-16">{row.original.totalQuestions}</p>
    ),
  },
  {
    accessorKey: "totalMark",
    header: "Total Mark",
    cell: ({ row }) => <p className="min-w-20">{row.original.totalMark}</p>,
  },
  {
    accessorKey: "totalUsers",
    header: "Users",
    cell: ({ row }) => <p className="min-w-12">{row.original.totalUsers}</p>,
  },
  {
    accessorKey: "actions",
    header: () => <p className="hidden lg:block">Actions</p>,
    cell: ({ row }) => (
      <>
        <QuizTableActions quizId={row.original.quizId} />
        <QuizTableActionMenu quizId={row.original.quizId} />
      </>
    ),
  },
];

export const userQuizzesTableColumns: ColumnDef<UserQuizSchemaType>[] = [
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
    accessorKey: "certificateId",
    header: "Certificate",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.certificateId === null ? "destructive" : "success"
        }
      >
        {row.original.certificateId === null ? "Not added" : "Added"}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ResetUserQuizButton
          userQuizId={row.original.userQuizId}
          userQuizStatus={row.original.status}
        />
        <UpdateCertificateModal
          userQuizId={row.original.userQuizId}
          userQuizStatus={row.original.status}
          certificateId={row.original.certificateId}
        />
        <DeleteUserQuizButton
          userQuizId={row.original.userQuizId}
          userQuizStatus={row.original.status}
        />
      </div>
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
