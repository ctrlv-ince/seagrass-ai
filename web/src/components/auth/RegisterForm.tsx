import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SocialLogin } from "./SocialLogin";
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const { signUpWithEmail, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    const result = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms,
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path) formattedErrors[path] = issue.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    try {
      setLoading(true);
      const { error } = await signUpWithEmail(email, password, fullName);
      if (error) {
        setErrorMessage(error.message);
      } else {
        if (!isConfigured) {
          navigate("/dashboard");
        } else {
          setSuccessMessage("Account created successfully! Redirecting...");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1200);
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {!isConfigured && (
        <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 shrink-0" />
          <span>
            <strong>Demo Sandbox Active:</strong> Supabase credentials not set. Creating an account will initialize your demo session and take you straight to the dashboard!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Google OAuth Option */}
      <SocialLogin
        onSuccess={() => navigate("/dashboard")}
        onError={(msg) => setErrorMessage(msg)}
      />

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="register-fullname" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            FULL NAME
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Mercer"
              required
              aria-invalid={Boolean(fieldErrors.fullName)}
              aria-describedby={fieldErrors.fullName ? "register-fullname-error" : undefined}
              className={`w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.fullName
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500"
              }`}
            />
          </div>
          {fieldErrors.fullName && (
            <p id="register-fullname-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="register-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
              className={`w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.email
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p id="register-email-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="register-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
              className={`w-full pl-9 pr-10 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="register-password-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="register-confirm-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined}
              className={`w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.confirmPassword
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500"
              }`}
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p id="register-confirm-password-error" role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms agreement */}
        <div className="flex items-start">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            aria-invalid={Boolean(fieldErrors.agreeTerms)}
            aria-describedby={fieldErrors.agreeTerms ? "agree-terms-error" : undefined}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500/20 cursor-pointer"
          />
          <label htmlFor="agree-terms" className="ml-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            I agree to the{" "}
            <span className="text-teal-700 dark:text-teal-400 hover:underline">Terms of Service</span> and{" "}
            <span className="text-teal-700 dark:text-teal-400 hover:underline">Privacy Policy</span>
          </label>
        </div>
        {fieldErrors.agreeTerms && (
          <p id="agree-terms-error" role="alert" className="text-xs text-rose-600 dark:text-rose-400">{fieldErrors.agreeTerms}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
