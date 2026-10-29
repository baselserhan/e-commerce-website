'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <span className={styles.categoryTag}>{product.category}</span>
        <Link href={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className={styles.productImage}
            priority={false}
          />
        </Link>
      </div>

      <div className={styles.content}>
        <Link href={`/product/${product.id}`}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={styles.starIcon}
                width="14"
                height="14"
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

        <div className={styles.footerRow}>
          <span className={styles.price}>${product.price}</span>
          <button
            onClick={() => addToCart(product, 1)}
            className={styles.addButton}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
            <svg
              className={styles.addButtonIcon}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
