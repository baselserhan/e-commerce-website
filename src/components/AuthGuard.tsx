'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
  requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      if (requireAuth && !user) {
        // Redir to login with redirect back param
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        // Handled below by rendering access denied screen
      }
    }
  }, [isLoaded, user, requireAuth, allowedRoles, pathname, router]);

  // Loading Screen
  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#080c14',
        color: '#fff'
      }}>
        <p style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>Authorizing Session...</p>
      </div>
    );
  }

  // Not authenticated and requires auth - prevent flash of content before redirect hook fires
  if (requireAuth && !user) {
    return null;
  }

  // Authenticated but unauthorized role (e.g. standard user visiting /admin)
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '24px',
        background: '#080c14',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: '16px',
          borderRadius: '50%',
          color: '#f87171',
          marginBottom: '24px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '12px', fontWeight: 700 }}>Access Denied</h1>
        <p style={{ color: '#9ca3af', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.6 }}>
          You do not have the necessary permissions to access this page. This section is restricted to store administrators.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="/" style={{
            background: 'var(--primary, #d4a359)',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: 600,
            textDecoration: 'none'
          }}>
            Return Home
          </Link>
          <button
            onClick={() => router.back()}
            style={{
              background: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Success: Render content
  return <>{children}</>;
};
