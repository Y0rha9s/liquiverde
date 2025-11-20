import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { shoppingListsAPI, productsAPI } from './api';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function Charts() {
    const [listsData, setListsData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [listsRes, productsRes] = await Promise.all([
                shoppingListsAPI.getAll(),
                productsAPI.getAll()
            ]);

            const lists = listsRes.data.slice(0, 5);
            setListsData({
                labels: lists.map(l => l.name),
                datasets: [{
                    label: 'Ahorros ($)',
                    data: lists.map(l => l.total_savings),
                    backgroundColor: '#4CAF50',
                }]
            });

            const categories = {};
            productsRes.data.forEach(p => {
                const cat = p.category || 'Sin categoría';
                categories[cat] = (categories[cat] || 0) + 1;
            });

            setCategoryData({
                labels: Object.keys(categories),
                datasets: [{
                    label: 'Cantidad de Productos',
                    data: Object.values(categories),
                    backgroundColor: '#2196F3'
                }]
            });

            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando gráficos...</p>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
            {listsData && (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3>Ahorros por Lista</h3>
                    <Bar data={listsData} options={{ responsive: true }} />
                </div>
            )}

            {categoryData && (
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <h3>Productos por Categoría</h3>
                    <Bar
                        data={categoryData}
                        options={{
                            responsive: true,
                            indexAxis: 'y',
                            maintainAspectRatio: true
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Charts;