import { AuthLayout } from "../components/auth/AuthLayout";
import { RegisterForm } from "../components/auth/RegisterForm";

export function Register() {
  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Start scanning seagrass and computing wave attenuation impact."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
