import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameStateContext";

export default function ResetPassword() {
  const { resetPassword } = useGame();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const message = await resetPassword(token, password);
      setSuccess(message);
      setPassword("");
      setConfirm("");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="bg-surface border border-border/50 rounded-[var(--radius-xl)] p-8 w-full max-w-md shadow-[var(--shadow-lg)]">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🌿</span>
          <h1 className="text-3xl font-semibold text-primary">Questify</h1>
          <p className="text-sm text-secondary mt-1">Set a new password</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-[var(--radius-md)] text-sm text-green-600 font-medium">
            {success} Redirecting to log in...
          </div>
        )}

        {!token && !success && (
          <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] text-sm text-amber-700 font-medium">
            This reset link is missing a token. Please use the full link from your email.
          </div>
        )}

        {token && !success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
              <span>New password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" autoFocus className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(184,164,114,0.1)] transition-all" />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
              <span>Confirm password</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(184,164,114,0.1)] transition-all" />
            </label>
            <button type="submit" disabled={loading} className="mt-2 px-6 py-3 bg-accent text-white rounded-[var(--radius-md)] font-semibold text-sm hover:bg-accent-hover shadow-[0_2px_8px_rgba(184,164,114,0.3)] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
