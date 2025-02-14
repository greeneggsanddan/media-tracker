import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { logout } from "../login/actions";

export default function LogOutButton({ user }: { user: User }) {
  return (
    <Button variant="secondary" onClick={logout}>
      Log out {user.email}
    </Button>
  );
}