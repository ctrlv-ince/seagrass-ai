import { AuthLayout } from "../components/auth/AuthLayout";
import { LoginForm } from "../components/auth/LoginForm";

export function Login() {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your seagrass scans, meadow specs, and wave models."
    >
      <LoginForm />
    </AuthLayout>
  );
}
