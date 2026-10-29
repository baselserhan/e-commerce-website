'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import styles from './register.module.css';

function RegisterForm() {
  const { register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
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
      const success = await register(name, email, password, role);
      if (success) {
        router.push(redirectPath);
      } else {
        setError('Email is already registered. Please login.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerCard}>
      <div className={styles.header}>
        <h1 className={styles.logo}>
          LUXURA<span className={styles.logoAccent}>.</span>
        </h1>
        <p className={styles.subtitle}>Create your premium account</p>
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
          <label htmlFor="name" className={styles.label}>Full Name</label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="Jane Doe"
          />
        </div>

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
            placeholder="Password"
          />
        </div>

        {/* Dynamic Role Selector for Testing Auth Configurations */}
        <div className={styles.inputField}>
          <label htmlFor="role" className={styles.label}>Account Type (Testing Mode)</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
            className={styles.select}
          >
            <option value="user">Standard Customer (Role: user)</option>
            <option value="admin">Store Administrator (Role: admin)</option>
          </select>
        </div>

        <div className={styles.infoBox}>
          <p>
            Selecting <strong>Store Administrator</strong> grants immediate access to the sales charts, inventory lists, and transaction reports on the <strong>Admin Panel</strong>.
          </p>
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className={styles.footer}>
        Already have an account?{' '}
        <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className={styles.footerLink}>
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.mainContent}>
        <Suspense fallback={
          <div style={{ color: '#fff', fontSize: '1rem' }}>Loading Signup UI...</div>
        }>
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
