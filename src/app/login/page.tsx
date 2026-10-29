'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import styles from './login.module.css';

function LoginForm() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push(redirectPath);
      } else {
        setError('Invalid credentials. Check details or register.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const autofill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.header}>
        <h1 className={styles.logo}>
          LUXURA<span className={styles.logoAccent}>.</span>
        </h1>
        <p className={styles.subtitle}>Sign in to your premium account</p>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputField}>
          <label htmlFor="email" className={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="name@example.com"
          />
        </div>

        <div className={styles.inputField}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Quick Test Login Help */}
      <div className={styles.infoBox}>
        <p style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Quick Test Logins:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => autofill('admin@luxura.com', 'admin123')}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <span><strong>Admin:</strong> admin@luxura.com</span>
            <span style={{ color: 'var(--primary)' }}>Auto-fill</span>
          </button>
          <button
            onClick={() => autofill('jane@example.com', 'user123')}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <span><strong>User:</strong> jane@example.com</span>
            <span style={{ color: 'var(--primary)' }}>Auto-fill</span>
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href={`/register?redirect=${encodeURIComponent(redirectPath)}`} className={styles.footerLink}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContent}>
        <Suspense fallback={
          <div style={{ color: '#fff', fontSize: '1rem' }}>Loading Auth UI...</div>
        }>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
