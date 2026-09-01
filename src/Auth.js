import React, { useState } from "react";
import { supabase } from "./supabase";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } }
      });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
      if (error) setError(error.message);
      else onAuth(data.user);
    }

    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Soular</div>
        <p className="auth-tagline">Your soul. Your stars. Your journey.</p>

        <div className="auth-tabs">
          <button
            className={"auth-tab" + (mode === "signup" ? " active" : "")}
            onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>
            Begin your journey
          </button>
          <button
            className={"auth-tab" + (mode === "login" ? " active" : "")}
            onClick={() => { setMode("login"); setError(""); setMessage(""); }}>
            Welcome back
          </button>
        </div>

        {mode === "signup" && (
          <div className="auth-field">
            <label>Your name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Lainie Sisson" />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="at least 8 characters" />
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        {mode === "signup" && (
          <p className="auth-legal">
            By creating an account you agree to our{" "}
            <a href="/terms" target="_blank">Terms of Service</a> and{" "}
            <a href="/privacy" target="_blank">Privacy Policy</a>.
          </p>
        )}

        <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "One moment..." : mode === "signup" ? "Create my account" : "Sign in"}
        </button>

        {mode === "signup" && (
          <p className="auth-trial">✦ 72 hours free · no credit card required</p>
        )}
      </div>
    </div>
  );
}