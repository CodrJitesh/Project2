import { useState } from 'react';
import { analyzeFinances } from '../services/geminiService';
import styles from './AIInsights.module.css';

export default function AIInsights({ transactions }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const getStoredApiKey = () => {
    return localStorage.getItem('gemini_api_key');
  };

  const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
  };

  const handleAnalyze = async () => {
    if (transactions.length === 0) {
      setError('Add some transactions first to get AI insights');
      return;
    }

    const storedKey = getStoredApiKey();
    if (!storedKey) {
      setShowApiKeyModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeFinances(transactions, storedKey);
      setAnalysis(result);
    } catch (err) {
      if (err.message.includes('API key')) {
        setShowApiKeyModal(true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    saveApiKey(apiKeyInput.trim());
    setShowApiKeyModal(false);
    setApiKeyInput('');
    handleAnalyze();
  };

  const formatAnalysis = (text) => {
    // Replace **text** with <strong>text</strong>
    return text.split('\n').map((line, index) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <p 
          key={index} 
          className={styles.line}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>AI Financial Insights</h3>
          <p className={styles.subtitle}>Get personalized analysis powered by Gemini AI</p>
        </div>
        <button 
          onClick={handleAnalyze} 
          className={styles.analyzeBtn}
          disabled={loading || transactions.length === 0}
        >
          {loading ? (
            <>
              <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Analyze with AI
            </>
          )}
        </button>
      </div>

      {showApiKeyModal && (
        <div className={styles.modalOverlay} onClick={() => setShowApiKeyModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Enter Gemini API Key</h3>
            <p className={styles.modalSubtitle}>
              Get your free API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
            <input
              type="text"
              placeholder="AIza..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button onClick={() => setShowApiKeyModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSaveApiKey} className={styles.saveBtn}>
                Save & Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {analysis && (
        <div className={styles.analysis}>
          <div className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            AI Generated
          </div>
          <div className={styles.content}>
            {formatAnalysis(analysis)}
          </div>
        </div>
      )}

      {!analysis && !error && !loading && (
        <div className={styles.placeholder}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/>
          </svg>
          <p>Click "Analyze with AI" to get personalized financial insights</p>
        </div>
      )}
    </div>
  );
}
