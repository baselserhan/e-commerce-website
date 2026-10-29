'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductCard } from '@/components/ProductCard';
import { getLocalProducts, Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './product.module.css';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProductsList(getLocalProducts());
    setIsLoading(false);
  }, []);

  // Reset quantity when dynamic product changes
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          color: 'var(--text-secondary)'
        }}>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  const product = productsList.find((p) => p.id === id);

  if (!product) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          color: 'var(--text-muted)'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 style={{ color: 'var(--text-primary)', marginTop: '20px', marginBottom: '8px' }}>Product Not Found</h2>
          <p style={{ marginBottom: '24px' }}>The item you are looking for does not exist or has been removed.</p>
          <Link href="/" style={{
            background: 'var(--primary)',
            color: '#000',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600
          }}>
            Return to Store
          </Link>
        </div>
        <CartDrawer />
      </div>
    );
  }

  const relatedProducts = productsList.filter((p) => p.id !== product.id).slice(0, 3);

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.backBar}>
        <Link href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Curated Goods
        </Link>
      </div>

      <main className={styles.mainContent}>
        <div className={styles.productLayout}>
          {/* Left Column: Visual Gallery */}
          <div className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={450}
                className={styles.mainImage}
                priority
              />
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className={styles.infoSection}>
            <div>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.title}>{product.name}</h1>
            </div>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={styles.starIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ))}
              </div>
              <span className={styles.ratingText}>{product.rating}</span>
              <span className={styles.reviewsCount}>({product.reviews} reviews)</span>
            </div>

            <div className={styles.price}>${product.price}</div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.purchaseBlock}>
              <div className={styles.quantitySelector}>
                <button
                  onClick={handleDecrement}
                  className={styles.quantityBtn}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.quantityVal}>{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className={styles.quantityBtn}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className={styles.cartBtn}
                aria-label={`Add ${quantity} of ${product.name} to cart`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Shopping Cart
              </button>
            </div>

            {/* Specifications Sheet */}
            {product.details && Object.keys(product.details).length > 0 && (
              <div className={styles.specifications}>
                <h2 className={styles.specsTitle}>Specifications</h2>
                <table className={styles.specsTable}>
                  <tbody>
                    {Object.entries(product.details).map(([key, val]) => (
                      <tr key={key} className={styles.specsRow}>
                        <td className={styles.specsKey}>{key}</td>
                        <td className={styles.specsValue}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Items Section */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
