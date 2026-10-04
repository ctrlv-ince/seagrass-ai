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
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-start gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
          <span>
            <strong>Demo Sandbox Active:</strong> Supabase credentials not set. Creating an account will initialize your demo session and take you straight to the dashboard!
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            FULL NAME
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Mercer"
              required
              className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.fullName
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 focus:border-teal-600"
              }`}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.email
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 focus:border-teal-600"
              }`}
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 focus:border-teal-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              className={`w-full pl-9 pr-4 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                fieldErrors.confirmPassword
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-300 focus:border-teal-600"
              }`}
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms agreement */}
        <div className="flex items-start">
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 cursor-pointer"
          />
          <label htmlFor="agree-terms" className="ml-2 text-xs text-slate-600 cursor-pointer select-none">
            I agree to the{" "}
            <span className="text-teal-700 hover:underline">Terms of Service</span> and{" "}
            <span className="text-teal-700 hover:underline">Privacy Policy</span>
          </label>
        </div>
        {fieldErrors.agreeTerms && (
          <p className="text-xs text-rose-600">{fieldErrors.agreeTerms}</p>
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
      <div className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-teal-700 hover:text-teal-800 font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
