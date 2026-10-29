'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isCartOpen ? styles.overlayActive : ''}`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.drawerActive : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shopping Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={styles.closeButton}
            aria-label="Close cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.itemList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your shopping cart is empty</p>
              <button
                className={styles.shopButton}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={80}
                  height={60}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <Link
                    href={`/product/${item.product.id}`}
                    onClick={() => setIsCartOpen(false)}
                    className={styles.itemName}
                  >
                    {item.product.name}
                  </Link>
                  <span className={styles.itemCategory}>{item.product.category}</span>
                  <span className={styles.itemPrice}>${item.product.price}</span>
                  
                  <div className={styles.controls}>
                    <div className={styles.quantitySelector}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className={styles.quantityBtn}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className={styles.quantityVal}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className={styles.quantityBtn}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className={styles.removeButton}
                      aria-label="Remove item"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Subtotal</span>
              <span className={styles.summaryVal}>${cartTotal}</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className={styles.checkoutButton}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
