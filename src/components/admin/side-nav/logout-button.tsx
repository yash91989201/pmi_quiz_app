import { Button } from "@/components/ui/button";
// ICONS
import { Power } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      className="justify-between text-lg [&>svg]:size-4"
      variant="outline"
    >
      <span>Logout</span>
      <Power />
    </Button>
  );
}
