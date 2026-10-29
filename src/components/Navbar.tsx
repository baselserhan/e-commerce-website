'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

interface NavbarProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'All',
  setSelectedCategory,
}) => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
    if (pathname !== '/products') {
      router.push(`/products?search=${encodeURIComponent(val)}`);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (val) {
        params.set('search', val);
      } else {
        params.delete('search');
      }
      router.push(`/products?${params.toString()}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`${styles.navbar} glass`}>
      <Link href="/" className={styles.logo}>
        LUXURA<span className={styles.logoAccent}>.</span>
      </Link>

      <ul className={styles.navLinks}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`${styles.navLink} ${
                isActive(item.path) ? styles.navLinkActive : ''
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <div className={styles.searchContainer}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery ? searchQuery : localSearch}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className={styles.cartButton}
          aria-label="Toggle Shopping Cart"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>

        {/* User Authentication Menu */}
        {user ? (
          <div className={styles.profileMenu} ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={styles.avatar}
              aria-label="Open User Menu"
            >
              {getInitials(user.name)}
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <div style={{ padding: '8px 16px', fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <span style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>Role: {user.role}</span>
                </div>
                <Link
                  href="/dashboard"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="3" x2="9" y2="21"></line>
                      <line x1="15" y1="3" x2="15" y2="21"></line>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="3" y1="15" x2="21" y2="15"></line>
                    </svg>
                    Admin Panel
                  </Link>
                )}
                <div className={styles.dropdownDivider} />
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                    router.push('/');
                  }}
                  className={styles.dropdownItem}
                  style={{ color: 'var(--danger)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className={styles.signInBtn}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
