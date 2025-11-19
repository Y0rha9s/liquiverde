import { useState, useEffect } from 'react';
import { productsAPI } from './api';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeSearch, setBarcodeSearch] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadProducts();
            return;
        }

        setLoading(true);
        try {
            const response = await productsAPI.searchByName(searchQuery);
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error buscando:', error);
        }
        setLoading(false);
    };

    const handleBarcodeSearch = async () => {
        if (!barcodeSearch.trim()) return;

        setLoading(true);
        try {
            const response = await productsAPI.searchByBarcode(barcodeSearch);
            setProducts([response.data]);
        } catch (error) {
            console.error('Error buscando por código:', error);
            alert('Producto no encontrado con ese código de barras');
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Productos Disponibles</h2>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                        padding: '10px',
                        width: '300px',
                        marginRight: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Buscar
                </button>
                <button
                    onClick={loadProducts}
                    style={{
                        padding: '10px 20px',
                        marginLeft: '10px',
                        backgroundColor: '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Ver Todos
                </button>
            </div>
            <div style={{ marginBottom: '20px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                <input
                    type="text"
                    placeholder="Buscar por código de barras..."
                    value={barcodeSearch}
                    onChange={(e) => setBarcodeSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                    style={{
                        padding: '10px',
                        width: '300px',
                        marginRight: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                    }}
                />
                <button
                    onClick={handleBarcodeSearch}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Buscar por Código
                </button>
            </div>

            {loading ? (
                <p>Cargando productos...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '15px',
                                backgroundColor: '#f9f9f9'
                            }}
                        >
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{product.name}</h3>
                            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                                <strong>Marca:</strong> {product.brand || 'N/A'}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                                <strong>Precio:</strong> ${product.price}
                            </p>
                            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                                <strong>Tienda:</strong> {product.store || 'N/A'}
                            </p>
                            <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                                <p style={{ margin: '2px 0', fontSize: '12px' }}>
                                    <strong>Nutriscore:</strong> {product.nutriscore || 'N/A'}
                                </p>
                                <p style={{ margin: '2px 0', fontSize: '12px' }}>
                                    <strong>Ecoscore:</strong> {product.ecoscore || 'N/A'}
                                </p>
                                <p style={{ margin: '2px 0', fontSize: '12px' }}>
                                    <strong>Sostenibilidad:</strong> {product.sustainability_score}/100
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && products.length === 0 && (
                <p>No se encontraron productos.</p>
            )}
        </div>
    );
}

export default Products;