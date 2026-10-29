'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthGuard } from '@/components/AuthGuard';
import styles from './dashboard.module.css';

function DashboardContent() {
  const { user, orders, updateProfile } = useAuth();
  
  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync profile fields with user context state
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Filter orders for the current user
  const userOrders = orders.filter(
    (o) => o.userEmail.toLowerCase() === (user?.email || '').toLowerCase()
  );

  // Total spent across orders
  const totalSpent = userOrders.reduce((acc, curr) => acc + curr.total, 0);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSaving(true);

    try {
      const ok = await updateProfile(name, email);
      if (ok) {
        setSuccess('Profile updated successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Email address is already in use.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return styles.statusPending;
      case 'shipped': return styles.statusShipped;
      case 'delivered': return styles.statusDelivered;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>Account Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {user?.name}. Manage your profile and review orders.</p>
        </div>

        <div className={styles.dashboardLayout}>
          {/* Left Column: Profile Card & Summary widgets */}
          <div className={styles.sidebar}>
            {/* Profile Update Panel */}
            <div className={styles.profileCard}>
              <h2 className={styles.profileTitle}>Profile Information</h2>

              {success && <div className={styles.successAlert}>{success}</div>}
              {error && <div className={styles.errorAlert}>{error}</div>}

              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <div className={styles.inputField}>
                  <label htmlFor="name" className={styles.label}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
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
                  />
                </div>

                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>

            {/* Total Spent summary */}
            <div className={styles.statsCard}>
              <div className={styles.statsIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className={styles.statsInfo}>
                <span className={styles.statsLabel}>Total Spent</span>
                <span className={styles.statsVal}>${totalSpent}</span>
              </div>
            </div>

            {/* Total Orders count */}
            <div className={styles.statsCard}>
              <div className={styles.statsIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <div className={styles.statsInfo}>
                <span className={styles.statsLabel}>Total Orders</span>
                <span className={styles.statsVal}>{userOrders.length}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order History list */}
          <div className={styles.historySection}>
            <h2 className={styles.historyTitle}>Purchase History</h2>

            {userOrders.length === 0 ? (
              <div className={styles.noOrdersCard}>
                <svg
                  className={styles.noOrdersIcon}
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                  <line x1="6" y1="21" x2="18" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
                <p style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>No orders placed yet</p>
                <p style={{ fontSize: '0.85rem' }}>You have not completed any purchases on this account.</p>
                <Link href="/" className={styles.browseBtn}>
                  Browse Premium Goods
                </Link>
              </div>
            ) : (
              userOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderMetaGroup}>
                      <div className={styles.orderMetaItem}>
                        <span className={styles.orderMetaLabel}>Order ID</span>
                        <span className={styles.orderMetaVal}>{order.id}</span>
                      </div>
                      <div className={styles.orderMetaItem}>
                        <span className={styles.orderMetaLabel}>Date Placed</span>
                        <span className={styles.orderMetaVal}>{formatDate(order.date)}</span>
                      </div>
                      <div className={styles.orderMetaItem}>
                        <span className={styles.orderMetaLabel}>Total Charge</span>
                        <span className={styles.orderMetaVal} style={{ color: 'var(--primary)' }}>${order.total}</span>
                      </div>
                    </div>

                    <span className={`${styles.statusTag} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.productId} className={styles.orderItemRow}>
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={60}
                          height={45}
                          className={styles.orderItemImage}
                        />
                        <div className={styles.orderItemInfo}>
                          <h4 className={styles.orderItemName}>{item.productName}</h4>
                          <span className={styles.orderItemQty}>Qty: {item.quantity}</span>
                        </div>
                        <span className={styles.orderItemPrice}>${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['user', 'admin']}>
      <DashboardContent />
    </AuthGuard>
  );
}
