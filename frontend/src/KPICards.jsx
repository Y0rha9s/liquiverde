import { useState, useEffect } from 'react';
import { shoppingListsAPI, productsAPI } from './api';

function KPICards() {
  const [kpis, setKpis] = useState({
    totalSavings: 0,
    avgSustainability: 0,
    totalOptimized: 0,
    efficiency: 0
  });

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const [listsRes, productsRes] = await Promise.all([
        shoppingListsAPI.getAll(),
        productsAPI.getAll()
      ]);

      const lists = listsRes.data;
      const totalSavings = lists.reduce((sum, l) => sum + (l.total_savings || 0), 0);
      const totalSustainability = lists.reduce((sum, l) => sum + (l.sustainability_score || 0), 0);
      const avgSustainability = lists.length > 0 ? totalSustainability / lists.length : 0;
      const optimizedLists = lists.filter(l => l.total_savings > 0).length;
      const efficiency = lists.length > 0 ? (optimizedLists / lists.length) * 100 : 0;

      setKpis({
        totalSavings: Math.round(totalSavings),
        avgSustainability: Math.round(avgSustainability),
        totalOptimized: optimizedLists,
        efficiency: Math.round(efficiency)
      });
    } catch (error) {
      console.error('Error cargando KPIs:', error);
    }
  };

  const kpiData = [
    {
      title: 'Ahorros Totales',
      value: `$${kpis.totalSavings.toLocaleString()}`,
      color: '#4CAF50',
      icon: '💰'
    },
    {
      title: 'Sostenibilidad Promedio',
      value: `${kpis.avgSustainability}/100`,
      color: '#2196F3',
      icon: '🌱'
    },
    {
      title: 'Listas Optimizadas',
      value: kpis.totalOptimized,
      color: '#FF9800',
      icon: '🎯'
    },
    {
      title: 'Eficiencia',
      value: `${kpis.efficiency}%`,
      color: '#9C27B0',
      icon: '📊'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px',
      marginTop: '30px',
      marginBottom: '30px'
    }}>
      {kpiData.map((kpi, index) => (
        <div key={index} style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: `3px solid ${kpi.color}`,
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>{kpi.icon}</div>
          <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>{kpi.title}</p>
          <h2 style={{ margin: '10px 0', color: kpi.color, fontSize: '32px' }}>{kpi.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default KPICards;