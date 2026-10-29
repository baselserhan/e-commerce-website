'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, addOrder } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Autofill forms if user is logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name);
      setCardName(user.name);
    }
  }, [user]);

  const shippingCost = 15;
  const taxRate = 0.08;
  const taxCost = Math.round(cartTotal * taxRate);
  const grandTotal = cartTotal + shippingCost + taxCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    // Simulate API latency & write order record
    setTimeout(async () => {
      try {
        const generatedId = await addOrder(
          orderItems,
          cartTotal,
          shippingCost,
          taxCost,
          grandTotal,
          name
        );
        setOrderId(generatedId);
        setOrderCompleted(true);
        clearCart();
      } catch (err) {
        console.error('Error saving order', err);
      } finally {
        setLoading(false);
      }
    }, 1800);
  };

  if (orderCompleted) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const formattedDelivery = deliveryDate.toLocaleDateString('en-US', dateOptions);

    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className={styles.successTitle}>Order Placed!</h1>
            <p className={styles.successText}>
              Thank you for shopping with Luxura. Your order has been successfully placed, and a confirmation email has been dispatched to <strong>{email}</strong>.
            </p>

            <div className={styles.successDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Order ID</span>
                <span className={styles.detailVal}>{orderId}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Shipping To</span>
                <span className={styles.detailVal}>{name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Estimated Delivery</span>
                <span className={styles.detailVal}>{formattedDelivery}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Total Charge</span>
                <span className={styles.detailVal}>${grandTotal}</span>
              </div>
            </div>

            <Link href="/dashboard" className={styles.homeBtn} style={{ marginBottom: '10px' }}>
              View in Dashboard
            </Link>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              Return to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>Checkout</h1>

        {cart.length === 0 ? (
          <div className={styles.emptyCartView}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Please add some items to your cart before proceeding to checkout.</p>
            <Link href="/" className={styles.homeBtn} style={{ marginTop: '10px' }}>
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className={styles.checkoutLayout}>
            {/* Left Column: Forms */}
            <form onSubmit={handleSubmit} className={styles.formSection}>
              {/* Customer Contact */}
              <div className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>
                <div className={styles.inputFieldFull}>
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Shipping Details</h2>
                <div className={styles.inputGrid}>
                  <div className={styles.inputFieldFull}>
                    <label htmlFor="name" className={styles.label}>Full Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputFieldFull}>
                    <label htmlFor="address" className={styles.label}>Street Address</label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Luxury Lane"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="city" className={styles.label}>City</label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="zip" className={styles.label}>ZIP / Postal Code</label>
                    <input
                      type="text"
                      id="zip"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="94103"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className={styles.formGroup}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                <div className={styles.inputGrid}>
                  <div className={styles.inputFieldFull}>
                    <label htmlFor="cardName" className={styles.label}>Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jane Doe"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputFieldFull}>
                    <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      required
                      pattern="\d{16}"
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4111222233334444"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="expiry" className={styles.label}>Expiry Date</label>
                    <input
                      type="text"
                      id="expiry"
                      required
                      pattern="\d{2}/\d{2}"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length === 2 && !val.includes('/')) {
                          val += '/';
                        }
                        setExpiry(val);
                      }}
                      placeholder="MM/YY"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputField}>
                    <label htmlFor="cvv" className={styles.label}>CVV</label>
                    <input
                      type="password"
                      id="cvv"
                      required
                      pattern="\d{3,4}"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? 'Processing...' : `Pay $${grandTotal}`}
              </button>
            </form>

            {/* Right Column: Order Summary */}
            <div className={styles.summarySection}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.itemList}>
                {cart.map((item) => (
                  <div key={item.product.id} className={styles.item}>
                    <span className={styles.itemName}>
                      {item.product.name}
                      <span className={styles.itemQty}>x {item.quantity}</span>
                    </span>
                    <span className={styles.itemPrice}>${item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className={styles.calcBlock}>
                <div className={styles.calcRow}>
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className={styles.calcRow}>
                  <span>Shipping</span>
                  <span>${shippingCost}</span>
                </div>
                <div className={styles.calcRow}>
                  <span>Estimated Tax</span>
                  <span>${taxCost}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
