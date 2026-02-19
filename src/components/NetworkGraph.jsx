import { useEffect, useRef, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import styles from './ForceGraph3D.module.css';

export default function ExpenseForceGraph({ transactions }) {
  const fgRef = useRef();

  const graphData = useMemo(() => {
    if (transactions.length === 0) {
      return { nodes: [], links: [] };
    }

    const categoryMap = {};
    const nodes = [{ id: 'center', name: 'You', val: 30, color: '#13ecec' }];
    const links = [];

    transactions.forEach((t, idx) => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = {
          id: t.category,
          name: t.category,
          val: 0,
          color: getCategoryColor(t.category),
          type: 'category'
        };
        nodes.push(categoryMap[t.category]);
        links.push({
          source: 'center',
          target: t.category,
          value: 1
        });
      }

      categoryMap[t.category].val += t.amount / 100;

      const transactionNode = {
        id: `tx-${idx}`,
        name: t.title,
        amount: t.amount,
        val: Math.max(t.amount / 200, 2),
        color: t.type === 'income' ? '#10b981' : '#ef4444',
        type: 'transaction',
        date: t.date
      };

      nodes.push(transactionNode);
      links.push({
        source: t.category,
        target: `tx-${idx}`,
        value: t.amount / 500
      });
    });

    return { nodes, links };
  }, [transactions]);

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-120);
      fgRef.current.d3Force('link').distance(link => link.value * 20);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Spatial Expense Network</h3>
        <p className={styles.subtitle}>3D visualization of your spending patterns</p>
      </div>
      <div className={styles.graphWrapper}>
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel={node => `${node.name}${node.amount ? `: ₹${node.amount.toLocaleString('en-IN')}` : ''}`}
          nodeAutoColorBy="color"
          nodeVal={node => node.val}
          linkWidth={link => link.value}
          linkOpacity={0.3}
          linkColor={() => 'rgba(19, 236, 236, 0.3)'}
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={true}
          enableNavigationControls={true}
          nodeThreeObject={node => {
            const sprite = new window.THREE.Sprite(
              new window.THREE.SpriteMaterial({
                map: new window.THREE.CanvasTexture(generateNodeTexture(node)),
                transparent: true
              })
            );
            sprite.scale.set(12, 12, 1);
            return sprite;
          }}
        />
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#13ecec' }}></div>
          <span>Center (You)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#ef4444' }}></div>
          <span>Expenses</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendDot} style={{ background: '#10b981' }}></div>
          <span>Income</span>
        </div>
      </div>
    </div>
  );
}

function generateNodeTexture(node) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 64;
  canvas.height = 64;

  // Draw circle
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, 2 * Math.PI);
  ctx.fillStyle = node.color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px Manrope';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = node.name.substring(0, 3).toUpperCase();
  ctx.fillText(text, 32, 32);

  return canvas;
}

function getCategoryColor(category) {
  const colors = {
    'Food': '#f59e0b',
    'Transport': '#3b82f6',
    'Shopping': '#ec4899',
    'Entertainment': '#8b5cf6',
    'Bills': '#ef4444',
    'Health': '#10b981',
    'Education': '#06b6d4',
    'Salary': '#10b981',
    'Investment': '#3b82f6',
    'Freelance': '#8b5cf6',
    'Business': '#f59e0b',
    'Gift': '#ec4899',
    'Other': '#6b7280'
  };
  return colors[category] || '#6b7280';
}