import { SignIn } from "@clerk/nextjs";
import AutoLoginButton from "@/components/auth/auth-login";
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignIn />
      <AutoLoginButton />
    </div>
  );
}
