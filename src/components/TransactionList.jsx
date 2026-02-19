import { useState } from 'react';
import styles from './TransactionList.module.css';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Transactions</h2>
        <div className={styles.viewToggle}>
          <button 
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={`${styles.viewBtn} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className={styles.empty}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>No transactions yet. Start tracking your finances!</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className={styles.grid}>
          {transactions.map(transaction => (
            <div key={transaction.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.transactionTitle}>{transaction.title}</h3>
                  <div className={styles.meta}>
                    <span className={styles.category}>
                      <span className="material-symbols-outlined">{getCategoryIcon(transaction.category)}</span>
                      {transaction.category}
                    </span>
                    <span className={styles.date}>
                      {new Date(transaction.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
                <span className={`${styles.badge} ${styles[transaction.type]}`}>
                  {transaction.type}
                </span>
              </div>
              <p className={`${styles.amount} ${styles[transaction.type]}`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
              </p>
              <div className={styles.actions}>
                <button onClick={() => onEdit(transaction)} className={styles.editBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button onClick={() => onDelete(transaction.id)} className={styles.deleteBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Title</div>
            <div>Type</div>
            <div>Category</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Actions</div>
          </div>
          {transactions.map(transaction => (
            <div key={transaction.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{transaction.title}</div>
              <div className={styles.tableCell}>
                <span className={`${styles.badge} ${styles[transaction.type]}`}>
                  {transaction.type}
                </span>
              </div>
              <div className={styles.tableCell}>{transaction.category}</div>
              <div className={`${styles.tableCell} ${styles.amount} ${styles[transaction.type]}`}>
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
              </div>
              <div className={styles.tableCell}>
                {new Date(transaction.date).toLocaleDateString('en-IN')}
              </div>
              <div className={styles.actions}>
                <button onClick={() => onEdit(transaction)} className={styles.editBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button onClick={() => onDelete(transaction.id)} className={styles.deleteBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'Food': 'restaurant',
    'Transport': 'directions_car',
    'Shopping': 'shopping_bag',
    'Entertainment': 'movie',
    'Bills': 'receipt',
    'Health': 'local_hospital',
    'Education': 'school',
    'Salary': 'work',
    'Investment': 'trending_up',
    'Freelance': 'laptop_mac',
    'Business': 'business',
    'Gift': 'card_giftcard',
    'Other': 'category'
  };
  return icons[category] || 'category';
}
