import styles from './SummaryCards.module.css';

export default function SummaryCards({ balance, income, expense }) {
  const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0;
  
  return (
    <div className={styles.cards}>
      <div className={`${styles.card} ${styles.balance}`}>
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/><polyline points="17 5 12 1 7 5"/><polyline points="7 19 12 23 17 19"/>
            </svg>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>Total Balance</p>
            <h2 className={styles.amount}>₹{balance.toLocaleString('en-IN')}</h2>
            <p className={`${styles.change} ${balance >= 0 ? styles.positive : styles.negative}`}>
              {balance >= 0 ? '+' : '-'} {Math.abs(balance).toFixed(0)}
            </p>
          </div>
        </div>
      </div>
      <div className={`${styles.card} ${styles.income}`}>
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>Total Income</p>
            <h2 className={styles.amount}>₹{income.toLocaleString('en-IN')}</h2>
            <p className={`${styles.change} ${styles.positive}`}>
              This month
            </p>
          </div>
        </div>
      </div>
      <div className={`${styles.card} ${styles.expense}`}>
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>Total Expense</p>
            <h2 className={styles.amount}>₹{expense.toLocaleString('en-IN')}</h2>
            <p className={`${styles.change} ${styles.negative}`}>
              This month
            </p>
          </div>
        </div>
      </div>
      <div className={`${styles.card} ${styles.savings}`}>
        <div className={styles.cardInner}>
          <div className={styles.iconWrapper}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className={styles.content}>
            <p className={styles.label}>Savings Rate</p>
            <h2 className={styles.amount}>{savingsRate}%</h2>
            <p className={`${styles.change} ${savingsRate > 20 ? styles.positive : styles.negative}`}>
              {savingsRate > 20 ? 'Great!' : 'Improve'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
