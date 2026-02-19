import { useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './RadarWeb.module.css';

export default function RadarWeb({ transactions }) {
  const { data, hasData } = useMemo(() => {
    if (transactions.length === 0) {
      return {
        data: [
          { category: 'Food', value: 50, fullMark: 100 },
          { category: 'Transport', value: 30, fullMark: 100 },
          { category: 'Shopping', value: 40, fullMark: 100 },
          { category: 'Entertainment', value: 20, fullMark: 100 },
          { category: 'Bills', value: 60, fullMark: 100 },
          { category: 'Health', value: 25, fullMark: 100 }
        ],
        hasData: false
      };
    }

    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const maxValue = Math.max(...Object.values(categoryTotals), 1);
    
    const data = Object.entries(categoryTotals).map(([category, value]) => ({
      category,
      value: (value / maxValue) * 100,
      fullMark: 100,
      actualValue: value
    }));

    return { data, hasData: true };
  }, [transactions]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Spending Web</h3>
        <p className={styles.subtitle}>Category-wise expense distribution</p>
      </div>
      <div className={`${styles.chartWrapper} ${!hasData ? styles.disabled : ''}`}>
        {!hasData && (
          <div className={styles.overlay}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p>Add your first transaction to see the web</p>
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            />
            <Radar
              name="Expenses"
              dataKey="value"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              formatter={(value, name, props) => {
                if (hasData && props.payload.actualValue) {
                  return [`₹${props.payload.actualValue.toLocaleString('en-IN')}`, 'Amount'];
                }
                return [value.toFixed(0), 'Value'];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
