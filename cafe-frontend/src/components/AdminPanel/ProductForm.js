import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = ({ onProductAdded, productToEdit, onProductEdited }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Coffee');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setCategory(productToEdit.category);
            setPrice(productToEdit.price !== undefined ? productToEdit.price.toString() : '');
            setDescription(productToEdit.description || '');
            setWeight(productToEdit.weight !== undefined ? productToEdit.weight.toString() : '');
            setImagePreview(productToEdit.imageUrl ? `http://localhost:5189${productToEdit.imageUrl}` : null);
            setImage(null);
        } else {
            setName('');
            setCategory('Coffee');
            setPrice('');
            setDescription('');
            setWeight('');
            setImagePreview(null);
            setImage(null);
        }
    }, [productToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        const numericPrice = parseFloat(price).toFixed(2); 

        if (isNaN(numericPrice) || numericPrice <= 0) {
            setError('Цена должна быть положительным числом.');
            return;
        }
        
        const productData = new FormData();
    
        if (productToEdit) {
            productData.append('id', productToEdit.id);
        }
    
        productData.append('name', name);
        productData.append('category', category);
        productData.append('price', numericPrice);
        productData.append('description', description);
        
        let numericWeight = parseFloat(weight);
        if (category === 'Coffee') {
            numericWeight *= 1;
        }
        productData.append('weight', numericWeight);
    
        if (image) {
            productData.append('file', image);
        }
    
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
            if (productToEdit) {
                await axios.put(`http://localhost:5189/api/products/${productToEdit.id}`, productData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                onProductEdited({ ...productToEdit, name, category, price: numericPrice, description, weight: numericWeight, imageUrl: imagePreview });
                setSuccess('Товар успешно обновлён!');
                window.location.reload();
            } else {
                await axios.post('http://localhost:5189/api/products', productData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                onProductAdded({ name, category, price: numericPrice, description, weight: numericWeight, imageUrl: imagePreview });
                setSuccess('Товар успешно добавлен!');
                window.location.reload();
            }
        } catch (error) {
            console.error('Ошибка при обновлении товара:', error.response?.data || error.message);
            setError('Ошибка при обновлении товара. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImage(null);
            setImagePreview(null);
        }
    };

    const unit = category === 'Coffee' ? 'мл.' : 'гр.';

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2 className="form-title">
                {productToEdit ? 'Редактировать товар' : 'Добавить товар'}
            </h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <input
                className="form-input"
                type="text"
                placeholder="Название товара"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="Coffee">Кофе</option>
                <option value="Dessert">Десерт</option>
                <option value="Dish">Блюдо</option>
            </select>
            <div className="price-container">
                <input
                    className="form-input"
                    type="number"
                    placeholder="Цена"
                    value={price}
                    step={0.1}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <span className="price-label">BYN</span>
            </div>
            <div className="weight-container">
                <input
                    className="form-input"
                    type="number"
                    placeholder="Граммовка"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
                <span className="weight-label">{unit}</span>
            </div>
            <textarea
                className="form-textarea"
                placeholder="Описание товара"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                </div>
            )}
            <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Загрузка...' : (productToEdit ? 'Обновить товар' : 'Добавить товар')}
            </button>
        </form>
    );
};

export default ProductForm;
