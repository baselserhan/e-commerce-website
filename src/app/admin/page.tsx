'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthGuard } from '@/components/AuthGuard';
import { getLocalProducts, saveLocalProducts, Product } from '@/data/products';
import styles from './admin.module.css';

function AdminContent() {
  const { orders, users } = useAuth();
  
  // Custom products inventory state
  const [productsList, setProductsList] = useState<Product[]>([]);
  
  // Track whether we are creating or editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
  // Form states
  const [prodId, setProdId] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Workstation');
  const [prodDesc, setProdDesc] = useState('');
  const [prodSpecs, setProdSpecs] = useState('Connection: USB-C, Warranty: 1 Year');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const formSectionRef = useRef<HTMLDivElement>(null);

  // Load custom products on mount
  useEffect(() => {
    setProductsList(getLocalProducts());
  }, []);

  // 1. Calculate General Store Analytics
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = orders.length;
  const avgOrderVal = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 2. Calculate Category Revenue for Charts
  const categoryRevenues: Record<string, number> = {
    Audio: 0,
    Workstation: 0,
    Wearables: 0,
  };

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const itemProduct = productsList.find((p) => p.id === item.productId);
      const cat = itemProduct ? itemProduct.category : 'Workstation';
      categoryRevenues[cat] = (categoryRevenues[cat] || 0) + item.price * item.quantity;
    });
  });

  const maxCategoryRevenue = Math.max(...Object.values(categoryRevenues), 1);

  // Helper to enter edit mode for an existing product
  const handleStartEdit = (product: Product) => {
    setEditingProductId(product.id);
    setProdId(product.id);
    setProdName(product.name);
    setProdPrice(String(product.price));
    setProdCategory(product.category);
    setProdDesc(product.description || '');
    
    // Format details object to comma-separated key: value
    if (product.details) {
      const formattedSpecs = Object.entries(product.details)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      setProdSpecs(formattedSpecs);
    } else {
      setProdSpecs('');
    }

    setError('');
    setSuccess(`Editing product: "${product.name}"`);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to cancel edit mode
  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProdId('');
    setProdName('');
    setProdPrice('');
    setProdCategory('Workstation');
    setProdDesc('');
    setProdSpecs('Connection: USB-C, Warranty: 1 Year');
    setError('');
    setSuccess('');
  };

  // Helper to delete product
  const handleDeleteProduct = (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${productName}" from the store catalog?`)) {
      return;
    }

    const updated = productsList.filter((p) => p.id !== productId);
    setProductsList(updated);
    saveLocalProducts(updated);

    if (editingProductId === productId) {
      handleCancelEdit();
    }

    setSuccess(`Product "${productName}" has been removed.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  // Handle Add or Update Product
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!prodId || !prodName || !prodPrice) {
      setError('Please fill in all required fields.');
      return;
    }

    // Parse specifications comma-separated string (e.g. "Key: Value, Key2: Value2")
    const specDetails: Record<string, string> = {};
    prodSpecs.split(',').forEach((spec) => {
      const parts = spec.split(':');
      if (parts.length === 2) {
        specDetails[parts[0].trim()] = parts[1].trim();
      }
    });

    if (editingProductId) {
      // UPDATE EXISTING PRODUCT
      const existingProduct = productsList.find((p) => p.id === editingProductId);
      if (!existingProduct) {
        setError('Product not found to update.');
        return;
      }

      const updatedProduct: Product = {
        ...existingProduct,
        name: prodName.trim(),
        price: Number(prodPrice),
        category: prodCategory,
        description: prodDesc.trim() || 'No description provided.',
        details: specDetails,
      };

      const updatedList = productsList.map((p) =>
        p.id === editingProductId ? updatedProduct : p
      );

      setProductsList(updatedList);
      saveLocalProducts(updatedList);
      setSuccess(`Successfully updated "${prodName}".`);
      handleCancelEdit();
      setTimeout(() => setSuccess(''), 4000);
    } else {
      // ADD NEW PRODUCT
      const idExists = productsList.some((p) => p.id.toLowerCase() === prodId.trim().toLowerCase());
      if (idExists) {
        setError('Product ID already exists. Use a unique identifier.');
        return;
      }

      // Default mock images matching categories
      let categoryImage = '/images/keyboard.jpg';
      if (prodCategory === 'Audio') categoryImage = '/images/headphones.jpg';
      else if (prodCategory === 'Wearables') categoryImage = '/images/watch.jpg';
      else if (prodCategory === 'Workstation' && prodId.toLowerCase().includes('lamp')) categoryImage = '/images/lamp.jpg';

      const newProduct: Product = {
        id: prodId.trim().toLowerCase(),
        name: prodName.trim(),
        price: Number(prodPrice),
        description: prodDesc.trim() || 'No description provided.',
        category: prodCategory,
        image: categoryImage,
        rating: 5.0,
        reviews: 1,
        details: specDetails,
      };

      const updatedList = [...productsList, newProduct];
      setProductsList(updatedList);
      saveLocalProducts(updatedList);

      setSuccess(`Successfully added dynamic product "${prodName}".`);
      handleCancelEdit();
      setTimeout(() => setSuccess(''), 4000);
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
        {/* Admin Title */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Store Control Panel</h1>
            <p className={styles.subtitle}>Curated overview of orders, inventory, and analytics trends.</p>
          </div>
          <span className={styles.adminBadge}>Admin Mode</span>
        </div>

        {/* Analytics Widgets */}
        <section className={styles.statsGrid}>
          <div className={styles.statsCard}>
            <div className={styles.statsMeta}>
              <span className={styles.statsLabel}>Gross Revenue</span>
              <svg className={styles.statsIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <span className={styles.statsValue}>${totalRevenue}</span>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsMeta}>
              <span className={styles.statsLabel}>Total Transactions</span>
              <svg className={styles.statsIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <span className={styles.statsValue}>{totalOrders}</span>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsMeta}>
              <span className={styles.statsLabel}>Average Basket Value</span>
              <svg className={styles.statsIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <span className={styles.statsValue}>${avgOrderVal}</span>
          </div>

          <div className={styles.statsCard}>
            <div className={styles.statsMeta}>
              <span className={styles.statsLabel}>Registered Accounts</span>
              <svg className={styles.statsIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span className={styles.statsValue}>{users.length}</span>
          </div>
        </section>

        {/* Visual Charts & Product Form */}
        <section className={styles.dashboardSection}>
          {/* Custom CSS Sales Chart */}
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Revenue by Product Category</h2>
            <div className={styles.chartContainer}>
              {Object.entries(categoryRevenues).map(([cat, total]) => {
                const widthPercent = maxCategoryRevenue > 0 ? (total / maxCategoryRevenue) * 100 : 0;
                return (
                  <div key={cat} className={styles.barRow}>
                    <div className={styles.barMeta}>
                      <span className={styles.barName}>{cat}</span>
                      <span className={styles.barTotal}>${total}</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${Math.max(widthPercent, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add or Update Catalog Item Form */}
          <div className={styles.sectionCard} ref={formSectionRef}>
            <div className={styles.formHeaderRow}>
              <h2 className={styles.sectionTitle}>
                {editingProductId ? 'Update Product' : 'Add Catalog Item'}
              </h2>
              {editingProductId && (
                <span className={styles.editModeBadge}>Edit Mode</span>
              )}
            </div>

            {success && <div className={styles.successAlert}>{success}</div>}
            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmitProduct} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputField}>
                  <label htmlFor="prodId" className={styles.label}>
                    Product ID (Slug) {editingProductId && '(Fixed)'}
                  </label>
                  <input
                    type="text"
                    id="prodId"
                    required
                    disabled={!!editingProductId}
                    value={prodId}
                    onChange={(e) => setProdId(e.target.value)}
                    placeholder="e.g. keyboard-pro"
                    className={`${styles.input} ${editingProductId ? styles.inputDisabled : ''}`}
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="prodPrice" className={styles.label}>Unit Price ($)</label>
                  <input
                    type="number"
                    id="prodPrice"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="e.g. 199"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.inputFieldFull}>
                <label htmlFor="prodName" className={styles.label}>Product Title</label>
                <input
                  type="text"
                  id="prodName"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Tactile Mechanical Keyboard"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputFieldFull}>
                <label htmlFor="prodCategory" className={styles.label}>Category</label>
                <select
                  id="prodCategory"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="Audio">Audio</option>
                  <option value="Workstation">Workstation</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>

              <div className={styles.inputFieldFull}>
                <label htmlFor="prodDesc" className={styles.label}>Description</label>
                <textarea
                  id="prodDesc"
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Summarize product features..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.inputFieldFull}>
                <label htmlFor="prodSpecs" className={styles.label}>Specs Sheet (Comma-separated)</label>
                <input
                  type="text"
                  id="prodSpecs"
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  placeholder="Key: Value, Key2: Value2..."
                  className={styles.input}
                />
              </div>

              <div className={styles.btnGroup}>
                <button type="submit" className={styles.submitBtn} style={{ flex: 1 }}>
                  {editingProductId ? 'Save Changes' : 'Add to Inventory'}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* Global Transaction Orders Log */}
        <section className={styles.fullWidthGrid}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Global Transactions Log</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Order ID</th>
                    <th className={styles.th}>Customer</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Items Count</th>
                    <th className={styles.th}>Total Charged</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No transactions registered in this session.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className={styles.tr}>
                        <td className={`${styles.td} ${styles.tdPrimary}`}>{o.id}</td>
                        <td className={styles.td}>{o.userName} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.userEmail}</span></td>
                        <td className={styles.td}>{formatDate(o.date)}</td>
                        <td className={styles.td}>
                          <span className={`${styles.statusTag} ${getStatusClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className={styles.td}>
                          {o.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </td>
                        <td className={`${styles.td} ${styles.tdPrimary}`} style={{ color: 'var(--primary)' }}>
                          ${o.total}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Catalog Inventory Management */}
        <section className={styles.fullWidthGrid}>
          <div className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>Catalog Inventory ({productsList.length} items)</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Item Preview</th>
                    <th className={styles.th}>ID Slug</th>
                    <th className={styles.th}>Product Title</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Price</th>
                    <th className={styles.th}>Ratings</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((p) => (
                    <tr key={p.id} className={styles.tr}>
                      <td className={styles.td}>
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={48}
                          height={36}
                          style={{ borderRadius: '4px', objectFit: 'cover', background: '#0f172a' }}
                        />
                      </td>
                      <td className={`${styles.td} ${styles.tdPrimary}`}>{p.id}</td>
                      <td className={`${styles.td} ${styles.tdPrimary}`}>{p.name}</td>
                      <td className={styles.td}>{p.category}</td>
                      <td className={`${styles.td} ${styles.tdPrimary}`} style={{ color: 'var(--primary)' }}>
                        ${p.price}
                      </td>
                      <td className={styles.td}>
                        ★ {p.rating} ({p.reviews})
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionsCell}>
                          <button
                            onClick={() => handleStartEdit(p)}
                            className={styles.editActionBtn}
                            title={`Edit ${p.name}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className={styles.deleteActionBtn}
                            title={`Delete ${p.name}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <CartDrawer />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={true} allowedRoles={['admin']}>
      <AdminContent />
    </AuthGuard>
  );
}
