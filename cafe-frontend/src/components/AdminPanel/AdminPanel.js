import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./AdminPanel.css";
import { useNavigate } from 'react-router-dom'; 
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const AdminPanel = () => {
    const navigate = useNavigate();  
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showHidden, setShowHidden] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5189/api/products');
            setProducts(response.data.sort((a, b) => a.id - b.id)); 
        } catch (error) {
            setError('Ошибка при загрузке товаров');
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductAdded = async (newProduct) => {
        await fetchProducts();
        setShowForm(false);
        setSuccess('Товар успешно добавлен');
    };

    const handleProductDeleted = async (id) => {
        try {
            await axios.delete(`http://localhost:5189/api/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
            setSuccess('Товар успешно удалён');
        } catch (error) {
            setError('Ошибка при удалении товара');
            console.error('Error deleting product:', error);
        }
    };

    const handleProductEdited = async (editedProduct) => {
        try {
            await axios.put(`http://localhost:5189/api/products/${editedProduct.id}`, editedProduct);
    
            setProducts((prevProducts) => {
                const index = prevProducts.findIndex(product => product.id === editedProduct.id);
                if (index === -1) return prevProducts;
                const updatedProducts = [...prevProducts];
                updatedProducts[index] = { ...updatedProducts[index], ...editedProduct };
                return updatedProducts;
            });
    
            setProductToEdit(null);
            setShowForm(false);
            setSuccess('Товар успешно обновлён');
        } catch (error) {
            setError('Ошибка при редактировании товара');
            console.error('Error editing product:', error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setShowForm(false);
        setProductToEdit(null);
    };

    const handleEditClick = (product) => {
        setProductToEdit(product);
        setShowForm(true);
    };

    const handleToggleHidden = async (product) => {
        try {
            const response = await axios.put(`http://localhost:5189/api/products/toggleHidden/${product.id}`);
            const updatedProduct = response.data;
            setProducts(prevProducts =>
                prevProducts
                    .map(p => (p.id === updatedProduct.id ? updatedProduct : p))
                    .sort((a, b) => a.id - b.id) 
            );
            setSuccess('Статус товара обновлён');
        } catch (error) {
            setError('Ошибка при обновлении статуса товара.');
            console.error('Toggle hidden error:', error);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesVisibility = showHidden ? product.isHidden : !product.isHidden;
        const matchesCategory = selectedCategory === 'All' ? true : product.category === selectedCategory;
        return matchesVisibility && matchesCategory;
    });

    const handleShowHiddenToggle = () => {
        setShowHidden(!showHidden);
    };

    const handleGoBack = () => {
        navigate(-1); 
    };

    return (
        <div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div className="category-buttons">
                <button onClick={handleGoBack} className="back-button">
                    Назад
                </button>
                
                {['All', 'Coffee', 'Dessert', 'Dish'].map((category) => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={selectedCategory === category ? 'active' : ''}>
                        {category === 'All' ? 'All' : category}
                    </button>
                ))}
                <button
                    className="create-button"
                    onClick={() => {
                        setShowForm(!showForm);
                        setProductToEdit(null);
                    }}>
                    {showForm ? 'Hide form' : 'Create a position'}
                </button>
                <button
                    className="toggle-hidden-catalog-button"
                    onClick={handleShowHiddenToggle}>
                    {showHidden ? 'Show visible' : 'Show hidden'}
                </button>
            </div>
            
            {showForm && (
                <ProductForm 
                    onProductAdded={handleProductAdded}
                    productToEdit={productToEdit}
                    onProductEdited={handleProductEdited}
                />
            )}

            <ProductList 
                products={filteredProducts} 
                onDelete={handleProductDeleted}
                onEdit={handleEditClick} 
                onToggleHidden={handleToggleHidden}
            />
        </div>
    );
};

export default AdminPanel;
