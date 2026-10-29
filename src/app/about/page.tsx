'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Story Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Our Philosophy</span>
            <h1 className={styles.title}>Crafted for Details, <br /><span>Built for minimalists</span></h1>
            <p className={styles.subtitle}>
              LUXURA was born out of a desire to eliminate noise from daily workspace items. We create premium lifestyle hardware and workplace goods that merge aesthetic distinction with everyday function.
            </p>
          </div>
        </section>

        {/* Pillars / Values Section */}
        <section className={styles.valuesSection}>
          <h2 className={styles.sectionTitle}>The Luxura Standard</h2>
          <div className={styles.valuesGrid}>
            <div className={`${styles.valueCard} glass`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                  </svg>
                </div>
                <h3>Minimalist Design</h3>
              </div>
              <p>We strip away unnecessary elements, focusing entirely on essential form and pure user interactions. Every curve, line, and texture serves a purpose.</p>
            </div>

            <div className={`${styles.valueCard} glass`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3>Unrivaled Quality</h3>
              </div>
              <p>We select premium raw materials—such as solid walnut wood, anodized aerospace aluminum, and authentic calfskin leather—to guarantee durability and an exceptional tactile feel.</p>
            </div>

            <div className={`${styles.valueCard} glass`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3>Built to Last</h3>
              </div>
              <p>In a world of disposable electronics, we build for longevity. Our custom mechanical keyboards are hot-swappable, and our lifestyle devices are designed for repairability.</p>
            </div>
          </div>
        </section>

        {/* Narrative Banner */}
        <section className={`${styles.narrativeSection} glass`}>
          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeInfo}>
              <h2>The Journey So Far</h2>
              <p>
                Founded in 2024, LUXURA started as a small design workshop. We wanted to build a workspace environment that inspired focus rather than distraction. 
              </p>
              <p>
                Today, our handpicked catalog is loved by creative professionals, software engineers, and design enthusiasts worldwide. We remain committed to limited-run, design-forward drops.
              </p>
              <div style={{ marginTop: '24px' }}>
                <Link href="/products" className={styles.ctaBtn}>
                  Browse Our Catalog
                </Link>
              </div>
            </div>
            <div className={styles.narrativeStats}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>100%</span>
                <span className={styles.statLabel}>Original Designs</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>20k+</span>
                <span className={styles.statLabel}>Happy Minimalists</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>5-Year</span>
                <span className={styles.statLabel}>Product Support</span>
              </div>
            </div>
          </div>
        </section>
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
