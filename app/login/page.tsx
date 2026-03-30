'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setMessage(data.mode === 'demo' ? 'Logged in using demo mode.' : 'Logged in successfully.');
      router.push('/products');
    } catch (requestError) {
      const nextError = requestError instanceof Error ? requestError.message : 'Login failed';
      setError(nextError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <span className="eyebrow">Welcome back</span>
      <h1 className="section-title">Login</h1>
      <p className="section-copy">
        Demo credentials: <strong>demo@example.com</strong> / <strong>demo1234</strong>
      </p>
      <form onSubmit={handleSubmit} className="form-card">
        {message ? <div className="success">{message}</div> : null}
        {error ? <div className="error">{error}</div> : null}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="inline-actions">
        <Link href="/signup" className="button-secondary">
          Need an account?
        </Link>
        <Link href="/" className="button-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
