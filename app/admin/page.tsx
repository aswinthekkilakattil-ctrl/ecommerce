'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSuccess(true);
      localStorage.setItem('adminToken', data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="page" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '64px', height: '64px', background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✓</div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 1rem' }}>Admin Access Granted</h2>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Welcome to the NexCart control panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ paddingTop: '4rem' }}>
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="eyebrow">Restricted Area</span>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem', letterSpacing: '-0.02em', color: '#111827' }}>Admin System</h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>Enter your credentials to access the dashboard.</p>
        </div>
        
        {error && (
          <div className="error" style={{ marginBottom: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '1rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="username" style={{ color: '#374151', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: '#f9fafb', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <div className="field" style={{ marginTop: '1.25rem' }}>
          <label htmlFor="password" style={{ color: '#374151', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: '#f9fafb', fontSize: '1rem', width: '100%', outline: 'none' }}
          />
        </div>
        <button type="submit" className="button" style={{ 
          width: '100%', 
          marginTop: '2rem', 
          padding: '1.1rem', 
          fontSize: '1.05rem', 
          background: '#000', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '12px', 
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          transition: 'all 0.2s'
        }}>
          Secure Login
        </button>
      </form>
    </div>
  );
}
