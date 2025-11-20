import { useState, useEffect } from 'react';
import Products from './Products.jsx';
import ShoppingLists from './ShoppingLists.jsx';
import { productsAPI, shoppingListsAPI } from './api.js';
import Rewards from './Rewards.jsx';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [stats, setStats] = useState({ products: 0, lists: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [productsRes, listsRes] = await Promise.all([
        productsAPI.getAll(),
        shoppingListsAPI.getAll()
      ]);
      setStats({
        products: productsRes.data.length,
        lists: listsRes.data.length
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '10px',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#4CAF50', margin: 0 }}>LiquiVerde</h1>
        <p style={{ color: '#666', margin: '5px 0' }}>
          Plataforma de Retail Inteligente
        </p>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentView('home')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: currentView === 'home' ? '#4CAF50' : '#ddd',
            color: currentView === 'home' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Inicio
        </button>
        <button
          onClick={() => setCurrentView('products')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: currentView === 'products' ? '#4CAF50' : '#ddd',
            color: currentView === 'products' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Productos
        </button>
        <button
          onClick={() => setCurrentView('lists')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentView === 'lists' ? '#4CAF50' : '#ddd',
            color: currentView === 'lists' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Listas de Compras
        </button>
        <button
          onClick={() => setCurrentView('rewards')}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: currentView === 'rewards' ? '#4CAF50' : '#ddd',
            color: currentView === 'rewards' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Recompensas
        </button>
      </nav>

      <main>
        {currentView === 'home' && (
          <div>
            <h2>Bienvenido a LiquiVerde</h2>
            <p>Optimiza tus compras, ahorra dinero y ayuda al planeta.</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginTop: '30px',
              marginBottom: '30px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                border: '2px solid #2196F3',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '36px', margin: '0', color: '#2196F3' }}>{stats.products}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>Productos Disponibles</p>
              </div>

              <div style={{
                padding: '20px',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                border: '2px solid #4CAF50',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '36px', margin: '0', color: '#4CAF50' }}>{stats.lists}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>Listas Creadas</p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>Funcionalidades:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Busca y compara productos por precio y sostenibilidad</li>
                <li>Crea listas de compras optimizadas con algoritmo inteligente</li>
                <li>Ahorra dinero mientras cuidas el medio ambiente</li>
                <li>Algoritmo multi-objetivo de optimización</li>
                <li>Integración con Open Food Facts para datos nutricionales</li>
              </ul>
            </div>

            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#fff3e0',
              borderRadius: '8px',
              border: '1px solid #ff9800'
            }}>
              <h3 style={{ marginTop: 0 }}>Cómo usar:</h3>
              <ol style={{ lineHeight: '1.8' }}>
                <li>Ve a "Productos" para explorar el catálogo</li>
                <li>Crea una nueva lista en "Listas de Compras"</li>
                <li>Agrega productos a tu lista</li>
                <li>Haz clic en "Optimizar Lista" para obtener la mejor selección</li>
              </ol>
            </div>
          </div>
        )}

        {currentView === 'products' && <Products />}
        {currentView === 'lists' && <ShoppingLists />}
        {currentView === 'rewards' && <Rewards />}
      </main>
    </div>
  );
}

export default App;