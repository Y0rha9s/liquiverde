import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://liquiverde-backend-mjea.onrender.com';

function Rewards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/rewards/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error cargando recompensas:', error);
    }
    setLoading(false);
  };

  if (loading) return <p>Cargando recompensas...</p>;
  if (!stats) return <p>No hay datos disponibles.</p>;

  return (
    <div>
      <h2>Mis Recompensas</h2>
      
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#fff3e0', 
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0', color: '#FF9800' }}>
          {stats.total_points}
        </h1>
        <p style={{ fontSize: '18px', margin: '10px 0', color: '#666' }}>
          Puntos Totales
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Estadísticas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Mejor Ahorro</p>
            <p style={{ margin: '5px 0', fontSize: '24px', color: '#4CAF50' }}>
              {stats.best_savings_percent}%
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Sostenibilidad Promedio</p>
            <p style={{ margin: '5px 0', fontSize: '24px', color: '#2196F3' }}>
              {stats.avg_sustainability_score}/100
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Listas Creadas</p>
            <p style={{ margin: '5px 0', fontSize: '24px', color: '#9C27B0' }}>
              {stats.total_lists}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3>Logros Desbloqueados</h3>
        {stats.badges.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {stats.badges.map((badge, index) => (
              <div key={index} style={{
                padding: '20px',
                border: '2px solid #4CAF50',
                borderRadius: '12px',
                backgroundColor: '#f9f9f9',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                  {badge.icon}
                </div>
                <h4 style={{ margin: '10px 0' }}>{badge.name}</h4>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Crea y optimiza listas para desbloquear logros.</p>
        )}
      </div>
    </div>
  );
}

export default Rewards;