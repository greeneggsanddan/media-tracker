import { Button } from "@/components/ui/button";
import { logout } from "../login/actions";

export default function LogOutButton() {
  return (
    <Button variant="secondary" onClick={logout}>
      Log out
    </Button>
  );
}