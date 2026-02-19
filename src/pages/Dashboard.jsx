import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import AdvancedChart from '../components/AdvancedChart';
import QuickStats from '../components/QuickStats';
import SpendingInsights from '../components/SpendingInsights';
import RadarWeb from '../components/RadarWeb';
import AIInsights from '../components/AIInsights';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'transactions'), 
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });
    return unsubscribe;
  }, [user]);

  const addTransaction = async (transaction) => {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      userId: user.uid,
      createdAt: new Date().toISOString()
    });
  };

  const updateTransaction = async (id, updates) => {
    await updateDoc(doc(db, 'transactions', id), updates);
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Date', 'Title', 'Type', 'Category', 'Amount'],
      ...transactions.map(t => [
        t.date,
        t.title,
        t.type,
        t.category,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className={styles.dashboard}>
      <Navbar onExport={handleExport} />
      
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Navigation</h3>
          <button className={styles.sidebarClose} onClick={() => setIsSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.navItem} ${activeSection === 'dashboard' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          
          <button 
            className={`${styles.navItem} ${activeSection === 'ai' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveSection('ai'); setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI Insights
          </button>
          
          <button 
            className={`${styles.navItem} ${activeSection === 'transactions' ? styles.navItemActive : ''}`}
            onClick={() => { setActiveSection('transactions'); setIsSidebarOpen(false); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Transactions
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.quickSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Balance</span>
              <span className={styles.summaryValue}>₹{balance.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Transactions</span>
              <span className={styles.summaryValue}>{transactions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && <div className={styles.sidebarBackdrop} onClick={() => setIsSidebarOpen(false)} />}

      {/* Mobile menu button */}
      <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div className={styles.mainContent}>
        <div className={styles.container}>
          {activeSection === 'dashboard' && (
            <>
              <SummaryCards balance={balance} income={totalIncome} expense={totalExpense} />
              <QuickStats transactions={transactions} />
              <AdvancedChart transactions={transactions} />
              <RadarWeb transactions={transactions} />
            </>
          )}

          {activeSection === 'ai' && (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>AI Financial Insights</h2>
                <p className={styles.sectionSubtitle}>Get personalized analysis and recommendations</p>
              </div>
              <AIInsights transactions={transactions} />
              <SpendingInsights transactions={transactions} />
              <AdvancedChart transactions={transactions} />
            </>
          )}

          {activeSection === 'transactions' && (
            <>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>All Transactions</h2>
                <p className={styles.sectionSubtitle}>Manage your income and expenses</p>
              </div>
              
              <div className={styles.filters}>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.search}
                />
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={styles.select}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </>
          )}

          <button className={styles.fab} onClick={() => setIsModalOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>

          {isModalOpen && (
            <TransactionModal
              transaction={editingTransaction}
              onSave={editingTransaction ? updateTransaction : addTransaction}
              onClose={handleModalClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
