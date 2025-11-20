import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import { productsAPI } from './api';

function ParetoChart() {
    const [paretoData, setParetoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadParetoData();
    }, []);

    const loadParetoData = async () => {
        try {
            const response = await productsAPI.getAll();
            const products = response.data;

            const categoryCount = {};
            products.forEach(p => {
                const cat = p.category || 'Sin categoría';
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });

            const sorted = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8);

            const labels = sorted.map(item => item[0]);
            const values = sorted.map(item => item[1]);
            const total = values.reduce((sum, val) => sum + val, 0);

            let cumulative = 0;
            const cumulativePercent = values.map(val => {
                cumulative += val;
                return Math.round((cumulative / total) * 100);
            });

            setParetoData({
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Cantidad de Productos',
                        data: values,
                        backgroundColor: '#2196F3',
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Porcentaje Acumulado',
                        data: cumulativePercent,
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    }
                ]
            });

            setLoading(false);
        } catch (error) {
            console.error('Error cargando Pareto:', error);
            setLoading(false);
        }
    };

    if (loading) return null;
    if (!paretoData) return null;

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Cantidad'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Porcentaje Acumulado (%)'
                },
                grid: {
                    drawOnChartArea: false
                },
                max: 100
            }
        }
    };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginTop: '30px',
            maxWidth: '1000px',
            margin: '10px auto',
            maxHeight: '650px'
        }}>
            <h3>Análisis Pareto - Categorías de Productos</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                Principio 80/20: Las categorías más importantes representan la mayoría de productos
            </p>
            <Bar data={paretoData} options={options} />
        </div>
    );
}

export default ParetoChart;