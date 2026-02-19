import { useState, useEffect } from 'react';
import styles from './TransactionModal.module.css';

const CATEGORIES = {
  expense: [
    { name: 'Food', icon: 'restaurant' },
    { name: 'Transport', icon: 'directions_car' },
    { name: 'Shopping', icon: 'shopping_bag' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Bills', icon: 'receipt' },
    { name: 'Health', icon: 'local_hospital' },
    { name: 'Education', icon: 'school' },
    { name: 'Other', icon: 'category' }
  ],
  income: [
    { name: 'Salary', icon: 'work' },
    { name: 'Investment', icon: 'trending_up' },
    { name: 'Freelance', icon: 'laptop_mac' },
    { name: 'Business', icon: 'business' },
    { name: 'Gift', icon: 'card_giftcard' },
    { name: 'Other', icon: 'category' }
  ]
};

export default function TransactionModal({ transaction, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, amount: parseFloat(formData.amount) };
    if (transaction) {
      await onSave(transaction.id, data);
    } else {
      await onSave(data);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{transaction ? 'Edit' : 'Add'} Transaction</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeSelector}>
              <button
                type="button"
                className={`${styles.typeBtn} ${formData.type === 'income' ? `${styles.active} ${styles.income}` : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
                Income
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${formData.type === 'expense' ? `${styles.active} ${styles.expense}` : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
                </svg>
                Expense
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <div className={styles.categoryGrid}>
              {CATEGORIES[formData.type].map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  className={`${styles.categoryBtn} ${formData.category === cat.name ? styles.active : ''}`}
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                >
                  <span className="material-symbols-outlined">{cat.icon}</span>
                  <span className={styles.categoryName}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={styles.input}
              required
              step="0.01"
              min="0"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
