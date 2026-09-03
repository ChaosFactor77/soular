import React, { useState } from "react";
import { supabase } from "./supabase";

export default function BirthForm({ user, onComplete }) {
  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    birth_time: "",
    birth_city: "",
    birth_state: "",
    birth_country: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.full_name || !form.birth_date || !form.birth_city) {
      setError("Please fill in your name, birth date, and city.");
      return;
    }

    setLoading(true);

    // Create profile if it doesn't exist
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: form.full_name
    });

    const { error } = await supabase
      .from("charts")
      .insert({
        user_id: user.id,
        full_name: form.full_name,
        birth_date: form.birth_date,
        birth_time: form.birth_time || null,
        birth_city: form.birth_city,
        birth_state: form.birth_state || null,
        birth_country: form.birth_country
      });

    if (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    } else {
      onComplete(form);
    }

    setLoading(false);
  }

  return (
    <div className="birth-wrap">
      <div className="birth-card">
        <img src="/oracle1.png" alt="Cosmyra" className="birth-avatar" />
        <h2 className="birth-title">Tell me when you arrived</h2>
        <p className="birth-sub">This is how I find your stars.</p>

        <div className="birth-field">
          <label>Your full name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>

        <div className="birth-row">
          <div className="birth-field">
            <label>Date of birth</label>
            <input
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleChange}
            />
          </div>
          <div className="birth-field">
            <label>Time of birth</label>
            <input
              name="birth_time"
              type="time"
              value={form.birth_time}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="birth-row">
          <div className="birth-field">
            <label>City of birth</label>
            <input
              name="birth_city"
              value={form.birth_city}
              onChange={handleChange}
              placeholder="e.g. Victoria"
            />
          </div>
          <div className="birth-field">
            <label>State / Province</label>
            <input
              name="birth_state"
              value={form.birth_state}
              onChange={handleChange}
              placeholder="e.g. Texas"
            />
          </div>
        </div>
        <div className="birth-field">
          <label>Country</label>
          <input
            name="birth_country"
            value={form.birth_country}
            onChange={handleChange}
            placeholder="e.g. United States"
          />
        </div>

        <p className="birth-note">
          ✦ Birth time helps find your Rising sign. If you are not sure, leave it blank.
        </p>

        {error && <p className="birth-error">{error}</p>}

        <button
          className="birth-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Finding your stars..." : "Find my stars"}
        </button>
        <button
          className="birth-back"
          onClick={() => window.location.reload()}
          style={{
            background: "transparent",
            border: "none",
            color: "#9b9080",
            fontSize: "0.8rem",
            cursor: "pointer",
            marginTop: "1rem",
            letterSpacing: "0.1em"
          }}
        >
          ← Back to Soular
        </button>
      </div>
    </div>
  );
}