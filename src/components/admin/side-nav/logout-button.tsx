"use client";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/server/actions/user";
// ICONS
import { Loader2, Power } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function LogoutButton() {
  return (
    <form action={logoutUser} className="w-full">
      <LogoutButtonWithStatus />
    </form>
  );
}

function LogoutButtonWithStatus() {
  const formStatus = useFormStatus();

  return (
    <Button
      className="justify-between text-lg [&>svg]:size-4"
      variant="outline"
    >
      <span>Logout</span>
      {formStatus.pending ? <Loader2 /> : <Power />}
    </Button>
  );
}
