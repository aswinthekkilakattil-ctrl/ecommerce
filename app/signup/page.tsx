'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Signup failed');
      }

      setMessage(data.mode === 'demo' ? 'Account created in demo mode. Please login.' : 'Signup successful! Please login.');
      router.push('/login');
    } catch (requestError) {
      const nextError = requestError instanceof Error ? requestError.message : 'Signup failed';
      setError(nextError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <span className="eyebrow">Create an account</span>
      <h1 className="section-title">Signup</h1>
      <p className="section-copy">Create a new shopper account to test the cart and checkout flow.</p>
      <form onSubmit={handleSubmit} className="form-card">
        {message ? <div className="success">{message}</div> : null}
        {error ? <div className="error">{error}</div> : null}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Signup'}
        </button>
      </form>
      <div className="inline-actions">
        <Link href="/login" className="button-secondary">
          Already have an account?
        </Link>
        <Link href="/" className="button-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
