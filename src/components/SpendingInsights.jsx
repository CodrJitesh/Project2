import { useMemo } from 'react';
import styles from './SpendingInsights.module.css';

export default function SpendingInsights({ transactions }) {
  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    const avgExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
    const avgIncome = income.length > 0 ? totalIncome / income.length : 0;

    const categoryExpenses = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const topCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0];
    const topCategoryPercent = topCategory ? (topCategory[1] / totalExpense * 100).toFixed(1) : 0;

    const last7Days = expenses.filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      const diff = (now - date) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });

    const weeklySpend = last7Days.reduce((sum, t) => sum + t.amount, 0);
    const dailyAvg = weeklySpend / 7;

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

    const getInsightMessage = () => {
      if (savingsRate > 30) return { text: "Excellent! You're saving over 30% of your income.", emoji: '🎉', type: 'success' };
      if (savingsRate > 20) return { text: "Good job! You're maintaining a healthy savings rate.", emoji: '👍', type: 'success' };
      if (savingsRate > 10) return { text: "You're saving, but there's room for improvement.", emoji: '💡', type: 'warning' };
      if (savingsRate > 0) return { text: "Consider reducing expenses to save more.", emoji: '⚠️', type: 'warning' };
      return { text: "Warning: Your expenses exceed your income!", emoji: '🚨', type: 'danger' };
    };

    const insight = getInsightMessage();

    return {
      avgExpense,
      avgIncome,
      topCategory: topCategory ? topCategory[0] : 'None',
      topCategoryPercent,
      dailyAvg,
      weeklySpend,
      savingsRate,
      insight
    };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>💡 Smart Insights</h2>
      </div>
      
      <div className={styles.insightCard}>
        <div className={`${styles.mainInsight} ${styles[insights.insight.type]}`}>
          <span className={styles.emoji}>{insights.insight.emoji}</span>
          <p className={styles.message}>{insights.insight.text}</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Avg Expense</p>
            <p className={styles.statValue}>₹{insights.avgExpense.toFixed(0)}</p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Avg Income</p>
            <p className={styles.statValue}>₹{insights.avgIncome.toFixed(0)}</p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Top Spending</p>
            <p className={styles.statValue}>{insights.topCategory}</p>
            <p className={styles.statSubtext}>{insights.topCategoryPercent}% of expenses</p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Daily Average</p>
            <p className={styles.statValue}>₹{insights.dailyAvg.toFixed(0)}</p>
            <p className={styles.statSubtext}>Last 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
