import { useMemo } from 'react';
import styles from './QuickStats.module.css';

export default function QuickStats({ transactions }) {
  const stats = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgTransaction = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

    const topCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const topCategoryName = Object.keys(topCategory).length > 0
      ? Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0][0]
      : 'None';

    return {
      monthIncome,
      monthExpense,
      avgTransaction,
      topCategory: topCategoryName,
      totalTransactions: transactions.length
    };
  }, [transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div className={styles.content}>
          <p className={styles.label}>This Month</p>
          <p className={styles.value}>₹{stats.monthIncome.toFixed(0)} / ₹{stats.monthExpense.toFixed(0)}</p>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        </div>
        <div className={styles.content}>
          <p className={styles.label}>Avg Transaction</p>
          <p className={styles.value}>₹{stats.avgTransaction.toFixed(0)}</p>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div className={styles.content}>
          <p className={styles.label}>Top Category</p>
          <p className={styles.value}>{stats.topCategory}</p>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <div className={styles.content}>
          <p className={styles.label}>Total Transactions</p>
          <p className={styles.value}>{stats.totalTransactions}</p>
        </div>
      </div>
    </div>
  );
}
