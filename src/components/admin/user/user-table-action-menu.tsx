import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteUserModal } from "@/components/admin/quizzes/delete-user-modal";
// ICONS
import { MoreVertical, Edit2, Eye } from "lucide-react";

export default function UserTableActionMenu({ userId }: { userId: string }) {
  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="size-4 md:size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={8}
          alignOffset={8}
          className="space-y-2 p-0.5"
        >
          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/admin/users/${userId}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-fit w-full items-center justify-start space-x-2 p-0 [&>svg]:size-4",
              )}
            >
              <Eye />
              <span>User Info</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/users/${userId}/update-user`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-fit w-full items-center justify-start space-x-2 p-0 [&>svg]:size-4",
              )}
            >
              <Edit2 />

              <span>Quiz Results</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <DeleteUserModal id={userId} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
