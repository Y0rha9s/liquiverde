import { useState, useEffect } from 'react';
import { shoppingListsAPI, productsAPI, optimizationAPI } from './api';

function ShoppingLists() {
    const [lists, setLists] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState(null);

    const [newList, setNewList] = useState({ name: '', budget: '' });
    const [newItem, setNewItem] = useState({ product_id: '', quantity: 1 });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadLists();
        loadProducts();
    }, []);

    const loadLists = async () => {
        try {
            const response = await shoppingListsAPI.getAll();
            setLists(response.data);
        } catch (error) {
            console.error('Error cargando listas:', error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await productsAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleCreateList = async (e) => {
        e.preventDefault();
        try {
            await shoppingListsAPI.create({
                name: newList.name,
                budget: parseFloat(newList.budget)
            });
            setNewList({ name: '', budget: '' });
            setShowCreateForm(false);
            loadLists();
            showMessage('Lista creada exitosamente', 'success');
        } catch (error) {
            console.error('Error creando lista:', error);
            showMessage('Error al crear la lista', 'error');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!selectedList) return;

        try {
            await shoppingListsAPI.addItem(selectedList.id, {
                product_id: parseInt(newItem.product_id),
                quantity: parseInt(newItem.quantity)
            });
            setNewItem({ product_id: '', quantity: 1 });
            setShowAddProduct(false);

            const response = await shoppingListsAPI.getById(selectedList.id);
            setSelectedList(response.data);
            loadLists();
            showMessage('Producto agregado a la lista', 'success');
        } catch (error) {
            console.error('Error agregando producto:', error);
            showMessage('Error al agregar producto', 'error');
        }
    };

    const handleOptimizeList = async () => {
        if (!selectedList || !selectedList.items || selectedList.items.length === 0) {
            showMessage('La lista debe tener productos para optimizar', 'error');
            return;
        }

        try {
            const response = await optimizationAPI.optimizeList(selectedList.id);
            setOptimizationResult(response.data);
        } catch (error) {
            console.error('Error optimizando:', error);
            showMessage('Error al optimizar la lista', 'error');
        }
    };

    return (
        <div>
            {message && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    padding: '15px 25px',
                    backgroundColor: message.type === 'success' ? '#4CAF50' : '#f44336',
                    color: 'white',
                    borderRadius: '4px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {message.text}
                </div>
            )}

            <h2>Listas de Compras</h2>

            <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                {showCreateForm ? 'Cancelar' : 'Crear Nueva Lista'}
            </button>

            {showCreateForm && (
                <form onSubmit={handleCreateList} style={{
                    padding: '20px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>Nueva Lista</h3>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
                        <input
                            type="text"
                            value={newList.name}
                            onChange={(e) => setNewList({ ...newList, name: e.target.value })}
                            required
                            style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Presupuesto:</label>
                        <input
                            type="number"
                            value={newList.budget}
                            onChange={(e) => setNewList({ ...newList, budget: e.target.value })}
                            required
                            min="0"
                            step="100"
                            style={{ padding: '8px', width: '100%', maxWidth: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Crear Lista
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                <div>
                    <h3>Mis Listas</h3>
                    {lists.map((list) => (
                        <div
                            key={list.id}
                            onClick={() => {
                                setSelectedList(list);
                                setOptimizationResult(null);
                            }}
                            style={{
                                padding: '15px',
                                marginBottom: '10px',
                                border: selectedList?.id === list.id ? '2px solid #4CAF50' : '1px solid #ddd',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: selectedList?.id === list.id ? '#e8f5e9' : 'white'
                            }}
                        >
                            <h4 style={{ margin: '0 0 5px 0' }}>{list.name}</h4>
                            <p style={{ margin: '2px 0', fontSize: '14px' }}>Presupuesto: ${list.budget}</p>
                            <p style={{ margin: '2px 0', fontSize: '14px' }}>Total: ${list.total_price}</p>
                            <p style={{ margin: '2px 0', fontSize: '14px' }}>Items: {list.items?.length || 0}</p>
                        </div>
                    ))}
                    {lists.length === 0 && <p>No hay listas creadas.</p>}
                </div>

                <div>
                    {selectedList ? (
                        <>
                            <h3>{selectedList.name}</h3>
                            <p>Presupuesto: ${selectedList.budget}</p>
                            <p>Total Gastado: ${selectedList.total_price}</p>
                            <p>Disponible: ${selectedList.budget - selectedList.total_price}</p>

                            <button
                                onClick={() => setShowAddProduct(!showAddProduct)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                    marginTop: '10px'
                                }}
                            >
                                Agregar Producto
                            </button>

                            <button
                                onClick={handleOptimizeList}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#FF9800',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                Optimizar Lista
                            </button>

                            {showAddProduct && (
                                <form onSubmit={handleAddItem} style={{
                                    padding: '15px',
                                    marginTop: '15px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    <h4>Agregar Producto</h4>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Producto:</label>
                                        <select
                                            value={newItem.product_id}
                                            onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
                                            required
                                            style={{ padding: '8px', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - ${p.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Cantidad:</label>
                                        <input
                                            type="number"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                            required
                                            min="1"
                                            style={{ padding: '8px', width: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#2196F3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Agregar
                                    </button>
                                </form>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <h4>Productos en la lista:</h4>
                                {selectedList.items && selectedList.items.length > 0 ? (
                                    selectedList.items.map((item) => {
                                        const product = products.find(p => p.id === item.product_id);
                                        return (
                                            <div key={item.id} style={{
                                                padding: '10px',
                                                marginBottom: '10px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: 'white'
                                            }}>
                                                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>
                                                    {product ? product.name : `Producto ID: ${item.product_id}`}
                                                </p>
                                                {product && (
                                                    <>
                                                        <p style={{ margin: '2px 0', fontSize: '14px', color: '#666' }}>
                                                            {product.brand} - {product.store}
                                                        </p>
                                                        <p style={{ margin: '2px 0', fontSize: '14px' }}>
                                                            Precio unitario: ${product.price}
                                                        </p>
                                                    </>
                                                )}
                                                <p style={{ margin: '2px 0' }}>Cantidad: {item.quantity}</p>
                                                <p style={{ margin: '2px 0', fontWeight: 'bold', color: '#4CAF50' }}>
                                                    Subtotal: ${item.subtotal}
                                                </p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p>No hay productos en esta lista.</p>
                                )}
                            </div>

                            {optimizationResult && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    backgroundColor: '#e8f5e9',
                                    borderRadius: '8px',
                                    border: '2px solid #4CAF50'
                                }}>
                                    <h3>Resultado de Optimización</h3>

                                    <div style={{ marginBottom: '15px' }}>
                                        <p><strong>Productos seleccionados:</strong> {optimizationResult.total_products}</p>
                                        <p><strong>Total:</strong> ${optimizationResult.total_price}</p>
                                        <p><strong>Ahorros:</strong> ${optimizationResult.savings} ({optimizationResult.savings_percentage}%)</p>
                                        <p><strong>Score Sostenibilidad:</strong> {optimizationResult.avg_sustainability_score}/100</p>
                                        <p><strong>Score Nutrición:</strong> {optimizationResult.avg_nutrition_score}/100</p>
                                        <p><strong>Score Optimización:</strong> {optimizationResult.optimization_score}/100</p>
                                    </div>

                                    <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Productos Recomendados:</h4>
                                    <div style={{ display: 'grid', gap: '10px' }}>
                                        {optimizationResult.selected_products && optimizationResult.selected_products.map((product, index) => (
                                            <div key={index} style={{
                                                padding: '10px',
                                                backgroundColor: 'white',
                                                borderRadius: '4px',
                                                border: '1px solid #4CAF50'
                                            }}>
                                                <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{product.name}</p>
                                                <p style={{ margin: '2px 0', fontSize: '14px', color: '#666' }}>
                                                    {product.brand} - {product.store}
                                                </p>
                                                <p style={{ margin: '2px 0', fontSize: '14px' }}>
                                                    Precio: ${product.price} | Sostenibilidad: {product.sustainability_score}/100
                                                </p>
                                                <p style={{ margin: '2px 0', fontSize: '12px', color: '#4CAF50' }}>
                                                    Score combinado: {product.combined_score?.toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Selecciona una lista para ver detalles.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ShoppingLists;