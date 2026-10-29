'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { getLocalProducts, Product } from '@/data/products';
import styles from './products.module.css';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Load products on mount
  useEffect(() => {
    setProductsList(getLocalProducts());
  }, []);

  // Sync state with URL search parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  // Handle category selection
  const handleCategorySelect = (cat: string) => {
    const params = new URLSearchParams(window.location.search);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    router.push(`/products?${params.toString()}`);
  };

  // Reset all filters
  const resetFilters = () => {
    router.push('/products');
  };

  // Filter products based on active filters
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', 'Audio', 'Workstation', 'Wearables'];

  return (
    <div className={styles.container}>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className={styles.mainContent}>
        {/* Catalog Section */}
        <section className={styles.catalogSection}>
          <div className={styles.catalogHeader}>
            <div className={styles.catalogTitleSection}>
              <h1 className={styles.catalogTitle}>Premium Goods</h1>
              <p className={styles.catalogSubtitle}>
                {searchQuery ? `Search results for "${searchQuery}"` : 'Browse our collection of handpicked hardware and lifestyle goods.'}
              </p>
            </div>

            <div className={styles.filterTabs}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`${styles.filterTab} ${
                    selectedCategory === cat ? styles.filterTabActive : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className={styles.noResults}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your search keywords or active category filters.</p>
                <button onClick={resetFilters} className={styles.noResultsBtn}>
                  Clear All Filters
                </button>
              </div>
            )}
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
                <button onClick={() => handleCategorySelect('Audio')} className={styles.footerLink} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Audio</button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Workstation')} className={styles.footerLink} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Workstation</button>
              </li>
              <li>
                <button onClick={() => handleCategorySelect('Wearables')} className={styles.footerLink} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>Wearables</button>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080c14', color: '#fff' }}>
        <p>Loading Products Catalog...</p>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
