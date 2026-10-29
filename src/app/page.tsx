'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { getLocalProducts, Product } from '@/data/products';
import styles from './page.module.css';

function HomePageContent() {
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Load custom products on mount
  useEffect(() => {
    setProductsList(getLocalProducts());
  }, []);

  // Show a selection of featured products
  const featuredProducts = productsList.slice(0, 3);

  return (
    <div className={styles.container}>
      <Navbar />

      <main>
        {/* Immersive Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Exclusive Curated Release</span>
            <h1 className={styles.heroTitle}>
              Design-Forward <span>Hardware</span> For Minimalists
            </h1>
            <p className={styles.heroDescription}>
              Elevate your workspace and lifestyle with our handpicked selection of premium mechanical keyboards, audiophile sound equipment, and luxury wearables. Built for details.
            </p>
            <div className={styles.heroActions}>
              <button
                className={styles.ctaPrimary}
                onClick={() => {
                  const element = document.getElementById('catalog');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Catalog
              </button>
              <Link href="/product/headphones" className={styles.ctaSecondary}>
                View Featured Item
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.glow} />
            <div className={styles.heroImageCard}>
              <Image
                src="/images/headphones.jpg"
                alt="AeroSound X1 Headphones"
                width={420}
                height={315}
                style={{ borderRadius: '12px', display: 'block', objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className={styles.mainContent}>
          <div className={styles.catalogHeader}>
            <div className={styles.catalogTitleSection}>
              <h2 className={styles.catalogTitle}>Featured Goods</h2>
              <p className={styles.catalogSubtitle}>
                Our handpicked hardware collection
              </p>
            </div>
          </div>

          <div className={styles.grid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Link href="/products" className={styles.ctaPrimary}>
              Explore Full Catalog
            </Link>
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

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080c14', color: '#fff' }}>
        <p>Loading Luxura Store...</p>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
