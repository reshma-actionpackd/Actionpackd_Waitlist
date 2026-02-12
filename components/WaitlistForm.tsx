"use client";

import { FormEvent, useState } from 'react';

const SOURCE_LABEL = "Actionpackd CLI Waitlist";

type Status = {
  state: "idle" | "submitting" | "success" | "error";
  message?: string;
};

const initialStatus: Status = { state: "idle" };

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>(initialStatus);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !phone.trim()) {
      setStatus({ state: "error", message: "Phone number and email are required." });
      return;
    }

    try {
      setStatus({ state: "submitting" });
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim(), source: SOURCE_LABEL }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "" }));
        throw new Error(data.error || "Unable to join the waitlist. Please try again.");
      }

      setEmail("");
      setPhone("");
      setStatus({ state: "success", message: "You're on the list! We'll reach out soon." });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Something went wrong." });
    }
  };

  return (
    <div className="form-card" aria-live="polite">
      <h2>Join the waitlist</h2>
      <p style={{ margin: "0 0 24px", color: "var(--text)", opacity: 0.8 }}>
        Secure early access to the Actionpackd CLI.
      </p>

      {status.state === "success" ? (
        <div className="success-banner">
          <div className="success-icon">&#10003;</div>
          <div className="success-text">
            <h3>You&apos;re on the list!</h3>
            <p>Thanks for signing up. We&apos;ll notify you as soon as Actionpackd CLI is ready.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email ID *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          <label htmlFor="phone">Phone number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 415 555 0199"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
          />

          <button className="cta-button" type="submit" disabled={status.state === "submitting"}>
            {status.state === "submitting" ? "Joining..." : "Join Waitlist"}
          </button>

          {status.state === "error" && status.message && (
            <p className="status-message error">
              {status.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
