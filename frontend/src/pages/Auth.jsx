import { useState } from "react";
import { useGame } from "../context/GameStateContext";

export default function Auth() {
  const { login, register } = useGame();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) {
          setError("Username is required");
          setLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      }
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
          <p className="text-sm text-secondary mt-1">Turn your tasks into adventures</p>
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-[var(--radius-md)] mb-6">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 rounded-[var(--radius-sm)] text-sm font-semibold transition-all cursor-pointer ${
                mode === m ? "bg-surface text-primary shadow-[var(--shadow-sm)]" : "text-secondary hover:text-primary"
              }`}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-sm text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
              <span>Username</span>
              <input type="text" value={form.username} onChange={update("username")} placeholder="Choose a username" autoFocus className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(156,175,136,0.1)] transition-all" />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Email</span>
            <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" autoFocus={mode === "login"} className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(156,175,136,0.1)] transition-all" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Password</span>
            <input type="password" value={form.password} onChange={update("password")} placeholder="Min 6 characters" className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(156,175,136,0.1)] transition-all" />
          </label>
          <button type="submit" disabled={loading} className="mt-2 px-6 py-3 bg-accent text-white rounded-[var(--radius-md)] font-semibold text-sm hover:bg-accent-hover shadow-[0_2px_8px_rgba(156,175,136,0.3)] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
