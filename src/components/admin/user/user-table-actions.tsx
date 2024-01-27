import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import { DeleteUserModal } from "@/components/admin/quizzes/delete-user-modal";
// ICONS
import { Edit2, Eye } from "lucide-react";

export default function UserTableActions({ userId }: { userId: string }) {
  return (
    <div className="hidden min-w-40 space-x-3 lg:block">
      <Link
        title="View User Info"
        href={`/admin/users/${userId}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-fit p-3 text-gray-700 hover:bg-amber-100 hover:text-amber-500 [&>svg]:size-4",
        )}
      >
        <Eye />
      </Link>
      <Link
        title="Update User Info"
        href={`/admin/users/${userId}/update-user`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-fit p-3 text-gray-700 hover:bg-blue-100 hover:text-blue-500 [&>svg]:size-4",
        )}
      >
        <Edit2 />
      </Link>
      <DeleteUserModal id={userId} />
    </div>
  );
}
