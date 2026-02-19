import { GEMINI_API_KEY, GEMINI_API_URL } from '../config/gemini';

// Function to list available models
async function listAvailableModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available models:', data.models?.map(m => m.name));
    return data.models;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

export async function analyzeFinances(transactions, apiKey) {
  // Use provided API key or fall back to config
  const key = apiKey || GEMINI_API_KEY;
  
  // Check if API key is configured
  if (!key || key.trim() === '' || key === 'YOUR_GEMINI_API_KEY') {
    throw new Error('Please provide a valid Gemini API key');
  }

  // Prepare transaction summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const recentTransactions = transactions
    .slice(-10)
    .map(t => `${t.type}: ₹${t.amount} - ${t.category} - ${t.title}`)
    .join('\n');

  const prompt = `You are a financial advisor. Analyze this user's financial data and provide a CONCISE summary:

Total Income: ₹${totalIncome.toLocaleString('en-IN')}
Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}
Balance: ₹${(totalIncome - totalExpense).toLocaleString('en-IN')}

Expense Breakdown by Category:
${Object.entries(categoryBreakdown)
  .map(([cat, amt]) => `- ${cat}: ₹${amt.toLocaleString('en-IN')}`)
  .join('\n')}

Recent Transactions:
${recentTransactions}

Provide a SHORT response (max 150 words) with:
1. One sentence financial health assessment
2. Top 2 spending insights
3. 2 actionable recommendations

Use **bold** for important numbers and key points. Keep it concise and practical. Use Indian Rupee context.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      
      // If model not found, list available models
      if (errorData.error?.message?.includes('not found')) {
        const models = await listAvailableModels();
        const modelNames = models?.map(m => m.name).join(', ') || 'Unable to fetch models';
        throw new Error(`Model not found. Available models: ${modelNames}. Please update GEMINI_API_URL in src/config/gemini.js`);
      }
      
      throw new Error(errorData.error?.message || 'Failed to get AI analysis. Please check your API key.');
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || 'Failed to analyze finances. Please try again.');
  }
}
