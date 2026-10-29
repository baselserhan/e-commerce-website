'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSending(true);
    // Simulate sending message
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <span className={styles.badge}>Contact Us</span>
          <h1 className={styles.title}>Let's Connect</h1>
          <p className={styles.subtitle}>Have a question about a product order, custom commission, or press inquiry? Drop us a message.</p>
        </div>

        <div className={styles.contactLayout}>
          {/* Left Side: Contact Form */}
          <div className={`${styles.formSection} glass`}>
            {submitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h2>Message Sent</h2>
                <p>Thank you for reaching out to LUXURA. Our concierge team will review your message and get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className={styles.resetBtn}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    placeholder="Tell us what you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" disabled={sending} className={styles.submitBtn}>
                  {sending ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Information details */}
          <div className={styles.infoSection}>
            <div className={`${styles.infoCard} glass`}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Client Support</h3>
                <p>For order status, shipping questions, or return assistance.</p>
                <span className={styles.email}>support@luxura.com</span>
              </div>
            </div>

            <div className={`${styles.infoCard} glass`}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l-7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Studio Address</h3>
                <p>LUXURA Design Labs HQ</p>
                <address className={styles.address}>
                  100 Minimalist Ave, Suite 400<br />
                  San Francisco, CA 94107
                </address>
              </div>
            </div>

            <div className={`${styles.infoCard} glass`}>
              <div className={styles.infoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className={styles.infoContent}>
                <h3>Operational Hours</h3>
                <p>Our support team and studio are available:</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Monday - Friday, 9:00 AM - 5:00 PM PST</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <h3 className={styles.footerLogo}>LUXURA.</h3>
            <p className={styles.footerDesc}>
              Crafting premium lifestyle hardware and workplace goods. Experience excellence in design, aesthetics, and hardware execution.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Shop Categories</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/products?category=Audio" className={styles.footerLink}>Audio</Link>
              </li>
              <li>
                <Link href="/products?category=Workstation" className={styles.footerLink}>Workstation</Link>
              </li>
              <li>
                <Link href="/products?category=Wearables" className={styles.footerLink}>Wearables</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Support</h4>
            <ul className={styles.footerLinks}>
              <li><Link href="/" className={styles.footerLink}>FAQ</Link></li>
              <li><Link href="/" className={styles.footerLink}>Shipping & Returns</Link></li>
              <li><Link href="/contact" className={styles.footerLink}>Contact Us</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4 className={styles.footerColTitle}>Stay Connected</h4>
            <p className={styles.footerDesc}>Subscribe to receive early announcements on exclusive drops.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter email address"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterBtn}>
                Join
              </button>
            </form>
          </div>
        </div>
        <div className={styles.copyrightRow}>
          <span>&copy; {new Date().getFullYear()} LUXURA. All rights reserved.</span>
          <span>Designed with premium aesthetics.</span>
        </div>
      </footer>
    </div>
  );
}
