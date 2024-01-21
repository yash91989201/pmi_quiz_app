"use client";
import { useFormStatus } from "react-dom";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/server/actions/user";
// ICONS
import { Loader2, Power } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logoutUser}>
      <LogoutButtonWithStatus />
    </form>
  );
}

function LogoutButtonWithStatus() {
  const formStatus = useFormStatus();

  return (
    <Button
      className="w-full justify-between text-lg [&>svg]:size-4"
      variant="outline"
    >
      <span>Logout</span>
      {formStatus.pending ? <Loader2 /> : <Power />}
    </Button>
  );
}
