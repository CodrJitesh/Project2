import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import styles from './AdvancedChart.module.css';

const COLORS = ['#13ecec', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];

export default function AdvancedChart({ transactions }) {
  const { categoryData, trendData, hasData } = useMemo(() => {
    // Show dummy data if no transactions
    if (transactions.length === 0) {
      return {
        categoryData: [
          { name: 'Food', value: 2500 },
          { name: 'Transport', value: 1500 },
          { name: 'Shopping', value: 3000 },
          { name: 'Bills', value: 2000 }
        ],
        trendData: [
          { date: 'Day 1', balance: 15000 },
          { date: 'Day 10', balance: 22000 },
          { date: 'Day 20', balance: 18000 },
          { date: 'Day 30', balance: 25000 }
        ],
        hasData: false
      };
    }

    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const categoryData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const last30Days = transactions
      .filter(t => {
        const date = new Date(t.date);
        const now = new Date();
        const diff = (now - date) / (1000 * 60 * 60 * 24);
        return diff <= 30;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let balance = 0;
    const trendData = last30Days.map(t => {
      balance += t.type === 'income' ? t.amount : -t.amount;
      return {
        date: new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        balance
      };
    });

    return { categoryData, trendData, hasData: true };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={`${styles.chartGrid} ${styles.disabled}`}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Balance Trend (30 Days)</h3>
            <div className={styles.disabledOverlay}>
              <p>Add transactions to see your balance trend</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Expense Breakdown</h3>
            <div className={styles.disabledOverlay}>
              <p>Add expenses to see category breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.3} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.chartGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Balance Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" style={{ fontSize: '0.75rem' }} />
              <YAxis stroke="var(--text-secondary)" style={{ fontSize: '0.75rem' }} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem'
                }}
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
